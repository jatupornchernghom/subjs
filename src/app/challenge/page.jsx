"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const Challenge = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");
  const [timeLeft, setTimeLeft] = useState(60);
  const [questions, setQuestions] = useState([]);
  const [userHistory, setUserHistory] = useState([]);

  const { data: session } = useSession();

  const [networkAnswer, setNetworkAnswer] = useState("");
  const [broadcastAnswer, setBroadcastAnswer] = useState("");
  const [hostsAnswer, setHostsAnswer] = useState("");
  const [firstHostAnswer, setFirstHostAnswer] = useState("");
  const [lastHostAnswer, setLastHostAnswer] = useState("");
  const [subnetMask, setSubnetMask] = useState("");

  const [showFeedback, setShowFeedback] = useState(false);
  const [answerResults, setAnswerResults] = useState({
    network: false,
    broadcast: false,
    hosts: false,
    firstHost: false,
    lastHost: false,
    subnetMask: false,
  });

  const difficultyOptions = [
    { value: "easy", label: "ง่าย" },
    { value: "medium", label: "ปานกลาง" },
    { value: "hard", label: "เดือด🔥(ยาก)" },
  ];

  function getSubnetInfo(ip, cidr) {
    const ipParts = ip.split(".").map(Number);
    const mask = ~(2 ** (32 - cidr) - 1) >>> 0;

    const subnetMask = [
      (mask >>> 24) & 255,
      (mask >>> 16) & 255,
      (mask >>> 8) & 255,
      mask & 255,
    ].join(".");

    const ipInt =
      (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];

    const networkInt = ipInt & mask;
    const broadcastInt = networkInt | ~mask;

    const network = [
      (networkInt >>> 24) & 255,
      (networkInt >>> 16) & 255,
      (networkInt >>> 8) & 255,
      networkInt & 255,
    ].join(".");

    const broadcast = [
      (broadcastInt >>> 24) & 255,
      (broadcastInt >>> 16) & 255,
      (broadcastInt >>> 8) & 255,
      broadcastInt & 255,
    ].join(".");

    const firstHostInt = networkInt + 1;
    const lastHostInt = broadcastInt - 1;

    const firstHost = [
      (firstHostInt >>> 24) & 255,
      (firstHostInt >>> 16) & 255,
      (firstHostInt >>> 8) & 255,
      firstHostInt & 255,
    ].join(".");

    const lastHost = [
      (lastHostInt >>> 24) & 255,
      (lastHostInt >>> 16) & 255,
      (lastHostInt >>> 8) & 255,
      lastHostInt & 255,
    ].join(".");

    const hosts = 2 ** (32 - cidr) - 2;

    return { network, broadcast, firstHost, lastHost, subnetMask, hosts };
  }

  function getRandomSubnetInfo(difficulty) {
    let minCIDR, maxCIDR;

    switch (difficulty) {
      case "easy":
        minCIDR = 24;
        maxCIDR = 30;
        break;
      case "medium":
        minCIDR = 19;
        maxCIDR = 26;
        break;
      case "hard":
        minCIDR = 16;
        maxCIDR = 22;
        break;
      default:
        minCIDR = 16;
        maxCIDR = 28;
    }

    const randomIP = `${rand(1, 223)}.${rand(0, 255)}.${rand(0, 255)}.${rand(1, 254)}`;
    const randomCIDR = rand(minCIDR, maxCIDR);

    return {
      id: Date.now(),
      ipAddress: randomIP,
      subnetMask: randomCIDR.toString(),
      correctAnswers: getSubnetInfo(randomIP, randomCIDR),
    };
  }

  const generateQuestions = (count) => {
    const newQuestions = [];
    for (let i = 0; i < count; i++) {
      newQuestions.push(getRandomSubnetInfo(difficulty));
    }
    return newQuestions;
  };
  const checkAnswers = () => {
    if (questions.length === 0) return;
  
    const currentQuestionData = questions[currentQuestion];
  
    const correct = {
      network: networkAnswer.trim() === currentQuestionData.correctAnswers.network,
      broadcast: broadcastAnswer.trim() === currentQuestionData.correctAnswers.broadcast,
      hosts: hostsAnswer.trim() === currentQuestionData.correctAnswers.hosts.toString(),
      firstHost: firstHostAnswer.trim() === currentQuestionData.correctAnswers.firstHost,
      lastHost: lastHostAnswer.trim() === currentQuestionData.correctAnswers.lastHost,
      subnetMask: subnetMask.trim() === currentQuestionData.correctAnswers.subnetMask
    };
  
    setAnswerResults(correct);
  
    const userSubmission = {
      questionId: currentQuestionData.id,
      ipAddress: currentQuestionData.ipAddress,
      subnetMask: currentQuestionData.subnetMask,
      answers: {
        network: correct.network ? currentQuestionData.correctAnswers.network : { userAnswer: networkAnswer, correctAnswer: currentQuestionData.correctAnswers.network },
        broadcast: correct.broadcast ? currentQuestionData.correctAnswers.broadcast : { userAnswer: broadcastAnswer, correctAnswer: currentQuestionData.correctAnswers.broadcast },
        hosts: correct.hosts ? currentQuestionData.correctAnswers.hosts : { userAnswer: hostsAnswer, correctAnswer: currentQuestionData.correctAnswers.hosts },
        firstHost: correct.firstHost ? currentQuestionData.correctAnswers.firstHost : { userAnswer: firstHostAnswer, correctAnswer: currentQuestionData.correctAnswers.firstHost },
        lastHost: correct.lastHost ? currentQuestionData.correctAnswers.lastHost : { userAnswer: lastHostAnswer, correctAnswer: currentQuestionData.correctAnswers.lastHost },
        subnetMask: correct.subnetMask ? currentQuestionData.correctAnswers.subnetMask : { userAnswer: subnetMask, correctAnswer: currentQuestionData.correctAnswers.subnetMask }
      },
      isCorrect: Object.values(correct).every(Boolean), // True if all answers are correct
    };
  
    setUserHistory([...userHistory, userSubmission]);
  
    
    const correctCount = Object.values(correct).filter(Boolean).length;
    if(difficulty === "easy"){
      setScore(score + correctCount);
    }else if(difficulty === "hard"){
      setScore(score + (correctCount * 3));
    }else{
      setScore(score + (correctCount * 2));
    }
    
    setShowFeedback(true);
  };

  const startGame = () => {
    const newQuestions = generateQuestions(5);
    setQuestions(newQuestions);

    setGameStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);

    let time = 90;
    if (difficulty === "easy") time = 120;
    if (difficulty === "hard") time = 60;
    setTimeLeft(time);

    resetAnswers();
  };

  const resetAnswers = () => {
    setNetworkAnswer("");
    setBroadcastAnswer("");
    setHostsAnswer("");
    setFirstHostAnswer("");
    setLastHostAnswer("");
    setSubnetMask("");
    setShowFeedback(false);
  };

  const thresholds = {
    easy: { trophy: 25, thumbsUp: 15 },
    medium: { trophy: 50, thumbsUp: 30 },
    hard: { trophy: 75, thumbsUp: 45 },
  };
  

  const getEmoji = (difficulty, score) => {
    const { trophy, thumbsUp } = thresholds[difficulty] || { trophy: 0, thumbsUp: 0 };
    return score >= trophy ? "🏆" : score >= thumbsUp ? "👍" : "🤔";
  };
  

  const nextQuestion = async () => {
    if(session){
      try {
        const response = await fetch("/api/user-history", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userHistory }),
        });
        const data = await response.json();
  
        }
       catch (error) {
        console.error("Error saving/updating user history:", error);
      }
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      resetAnswers();
      
      // Reset timer for each question
      setUserHistory([]); 
      let time = 90;
      if (difficulty === "easy") time = 120;
      if (difficulty === "hard") time = 60;
      setTimeLeft(time);
    } else {
      setShowResults(true);
    }
  };

  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      Swal.fire({
        title: "หมดเวลาแล้ว",
        showClass: {
          popup: `
            animate__animated
            animate__fadeInUp
            animate__faster
          `,
        },
        hideClass: {
          popup: `
            animate__animated
            animate__fadeOutDown
            animate__faster
          `,
        },
      });
      setShowFeedback(true);
    }
  }, [timeLeft, gameStarted]);

  const { theme } = useTheme();

  const restartGame =  () => {
    setUserHistory([]); 
    setGameStarted(false);
    setShowResults(false);
    resetAnswers();
    setTimeLeft(60);
  };
  

  return (
    <div className={`min-h-screen w-full px-4 py-8 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#282a2c] ' : 'bg-gray-100 text-gray-900'
    }`}>
    <div className="w-full min-h-[80vh] max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Subnet Challenge</h1>
      
      {!gameStarted && !showResults ? (
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">วิธีเล่น</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>คุณจะได้วง IP และ SUBNET MASK แบบสุ่ม</li>
              <li>คุณต้องคำนวน network address, broadcast address, และ จำนวน IP ทั้งหมด</li>
              <li>และคุณต้องคำนวน IP เริ่มต้นและจุดสิ้นสุดของวง IP ที่ใช้งานได้</li>
              <li>ป้อนคำตอบของคุณในรูปแบบที่ถูกต้อง (ตัวอย่าง 192.168.1.0)</li>
              <li>คุณจะได้รับคะแนนสำหรับคำตอบที่ถูกต้องแต่ละข้อ</li>
              <li>คุณจะได้ทำทั้งหมด 5 ชุด</li>
              <li>คะแนนความยาก: ง่าย ข้อล่ะ 1 คะแนน 1 ชุดรวม 6 คะแนน ถ้าตอบถูกทั้งหมดจะได้ 30 คะแนน</li>
              <li>คะแนนความยาก: ปานกลาง ข้อล่ะ 2 คะแนน 1 ชุดรวม 12 คะแนน ถ้าตอบถูกทั้งหมดจะได้ 60 คะแนน</li>
              <li>คะแนนความยาก: ยาก ข้อล่ะ 3 คะแนน 1 ชุดรวม 18 คะแนน ถ้าตอบถูกทั้งหมดจะได้ 90 คะแนน</li>
            </ul>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              เลือกระดับความยาก:
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {difficultyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={startGame}
            className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-md transition duration-200"
          >
            Start Challenge
          </button>
        </div>
      ) : showResults ? (
        <div className="text-center py-8">
          <div className="text-6xl font-bold mb-4">
          <span>{getEmoji(difficulty, score)}</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Challenge Complete!</h2>
          <p className="text-xl mb-6">
            คะแนนของคุณ: <span className="font-bold">{score}</span> จาก <span className="font-bold">{difficulty === "easy" ? questions.length * 6 : difficulty === "hard" ? (questions.length * 3) * 6 :  (questions.length * 2) * 6 }</span>
          </p>
          <div className="mb-8">
            {score >= questions.length * 5 ? (
              <p className="text-green-600 font-semibold">เยี่ยมมาก! คุณเป็นผู้เชี่ยวชาญ Subnet!</p>
            ) : score >= questions.length * 3 ? (
              <p className="text-blue-600 font-semibold">ทำได้ดี ฝึกต่อไปจะได้เก่งขึ้น</p>
            ) : (
              <p className="text-amber-600 font-semibold">อย่ายอมแพ้ ศึกษาแนวคิดการแบ่ง Subnet ต่อไป!</p>
            )}
          </div>
          <button
            onClick={restartGame}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md transition duration-200"
          >
            เล่นอีกครั้ง
          </button>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">
              ข้อที่ {currentQuestion + 1} / {questions.length}
            </span>
            <span className="bg-gray-200 py-1 px-3 rounded-full text-sm font-medium">
              เวลา: {timeLeft} วินาที
            </span>
            <span className="text-lg font-semibold">
              คะแนน: {score}
            </span>
          </div>
          
          {questions.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h2 className="text-xl font-semibold mb-4">จงคำนวน Subnet ตามข้อมูลด้านล่าง:</h2>
              <div className="flex flex-col sm:flex-row sm:space-x-4 mb-2">
                <div className="font-mono text-lg bg-blue-100 p-2 rounded mb-2 sm:mb-0">
                  IP: {questions[currentQuestion].ipAddress}
                </div>
                <div className="font-mono text-lg bg-blue-100 p-2 rounded">
                  / {questions[currentQuestion].subnetMask}
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Network Address:
              </label>
              <input
                type="text"
                required
                value={networkAnswer}
                onChange={(e) => setNetworkAnswer(e.target.value)}
                className={`w-full p-2 border rounded-md focus:outline-none ${
                  showFeedback
                    ? answerResults.network
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                    : "focus:ring-2 focus:ring-blue-500"
                }`}
                disabled={showFeedback}
              />
              {showFeedback && !answerResults.network && questions.length > 0 && (
                <p className="text-red-500 text-sm mt-1">
                  คำตอบที่ถูกต้อง: {questions[currentQuestion].correctAnswers.network}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Broadcast Address:
              </label>
              <input
                type="text"
                value={broadcastAnswer}
                required
                onChange={(e) => setBroadcastAnswer(e.target.value)}
                className={`w-full p-2 border rounded-md focus:outline-none ${
                  showFeedback
                    ? answerResults.broadcast
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                    : "focus:ring-2 focus:ring-blue-500"
                }`}
                disabled={showFeedback}
              />
              {showFeedback && !answerResults.broadcast && (
                <p className="text-red-500 text-sm mt-1">
                  คำตอบที่ถูกต้อง: {questions[currentQuestion].correctAnswers.broadcast}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Subnet Mask:
              </label>
              <input
                type="text"
                value={subnetMask}
                onChange={(e) => setSubnetMask(e.target.value)}
                required
                className={`w-full p-2 border rounded-md focus:outline-none ${
                  showFeedback
                    ? answerResults.subnetMask
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                    : "focus:ring-2 focus:ring-blue-500"
                }`}
                disabled={showFeedback}
              />
              {showFeedback && !answerResults.subnetMask && (
                <p className="text-red-500 text-sm mt-1">
                  คำตอบที่ถูกต้อง: {questions[currentQuestion].correctAnswers.subnetMask}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                จำนวน IP ที่ใช้งานได้:
              </label>
              <input
                type="text"
                value={hostsAnswer}
                required
                onChange={(e) => setHostsAnswer(e.target.value)}
                className={`w-full p-2 border rounded-md focus:outline-none ${
                  showFeedback
                    ? answerResults.hosts
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                    : "focus:ring-2 focus:ring-blue-500"
                }`}
                disabled={showFeedback}
              />
              {showFeedback && !answerResults.hosts && (
                <p className="text-red-500 text-sm mt-1">
                  คำตอบที่ถูกต้อง: {questions[currentQuestion].correctAnswers.hosts}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                 IP ที่เริ่มต้นใช้งานได้:
              </label>
              <input
                type="text"
                value={firstHostAnswer}
                onChange={(e) => setFirstHostAnswer(e.target.value)}
                className={`w-full p-2 border rounded-md focus:outline-none ${
                  showFeedback
                    ? answerResults.firstHost
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                    : "focus:ring-2 focus:ring-blue-500"
                }`}
                disabled={showFeedback}
              />
              {showFeedback && !answerResults.firstHost && (
                <p className="text-red-500 text-sm mt-1">
                  คำตอบที่ถูกต้อง: {questions[currentQuestion].correctAnswers.firstHost}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                IP สุดท้ายที่ใช้งานได้:
              </label>
              <input
                type="text"
                value={lastHostAnswer}
                onChange={(e) => setLastHostAnswer(e.target.value)}
                className={`w-full p-2 border rounded-md focus:outline-none ${
                  showFeedback
                    ? answerResults.lastHost
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                    : "focus:ring-2 focus:ring-blue-500"
                }`}
                disabled={showFeedback}
              />
              {showFeedback && !answerResults.lastHost && (
                <p className="text-red-500 text-sm mt-1">
                  คำตอบที่ถูกต้อง: {questions[currentQuestion].correctAnswers.lastHost}
                </p>
              )}
            </div>
          </div>
          
          {!showFeedback ? (
            <button
              onClick={checkAnswers}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition duration-200"
            >
              เช็คคำตอบ
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition duration-200"
            >
              {currentQuestion < questions.length - 1 ? "ข้อต่อไป" : "ดูผลคะแนน"}
            </button>
          )}
        </div>
      )}
    </div>
    </div>
  );
};

export default Challenge;