"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "../context/ThemeContext";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();
  const userId = session?.user.id;
  const { theme } = useTheme();

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId) return; // Avoid fetching if no userId

      try {
        const response = await fetch(`/api/get-history?userId=${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch history");
        }
        const data = await response.json();
        setHistory(data.historyTests || []);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError("Failed to load history");
      }
    };

    fetchHistory();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg">Loading history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">No history found.</p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen w-full px-4 md:px-12 lg:px-50 transition-colors duration-300 ${
        theme === "dark" ? "bg-[#282a2c]" : " bg-gray-100 text-gray-900"
      }`}
    >
      <div className="container mx-auto p-4">
        <h1
          className={`text-2xl font-semibold mb-4 ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
        >
          Your History
        </h1>
        <ul className="space-y-4">
          {history.slice().reverse().map((item, index) => (
            <li key={index} className="p-4">
              <div>
                {item.ipAddress && (
                  <div
                    className={`${
                      item.isCorrect ? "bg-green-300" : "bg-red-300"
                    } block p-4 border border-gray-300 rounded-lg shadow-md`}
                  >
                    <div className="mb-2">
                      <strong
                        className={`text-xl font-semibold  "text-black"
                        }`}
                      >
                        Date:{" "}
                      </strong>
                      <span
                        className={`font-medium "text-black"
                        }`}
                      >
                        {new Date(item.questionId).toLocaleString("th-TH") }
                      </span>
                    </div>
                    <div className="mb-2">
                      <strong
                        className={`text-xl font-semibold 
                           "text-black"
                        }`}
                      >
                        IP Address:{" "}
                      </strong>
                      <span
                        className={`font-medium 
                           "text-black"
                        `}
                      >
                        {item.ipAddress}/ {item.subnetMask}
                      </span>
                    </div>
                    <div className="mb-2">
                      <strong
                        className={`text-xl font-semibold  "text-black"
                        }`}
                      >
                        {!item.isCorrect
                          ? "Your Answers:"
                          : "All Your Answers Are Correct"}{" "}
                      </strong>
                      <span
                        className={`font-medium ${
                          theme === "dark" ? "text-white" : "text-black"
                        }`}
                      ></span>
                      <div>
                        {!item.isCorrect && (
                          <div>
                            <p>
                              Network:{" "}
                              {!item.answers.network.userAnswer
                                ? "Your answer is correct"
                                : `Your answer: ${item.answers.network.userAnswer}, Correct answer: ${item.answers.network.correctAnswer}`}
                            </p>
                            <p>
                              Broadcast:{" "}
                              {!item.answers.broadcast.userAnswer
                                ? "Your answer is correct"
                                : `Your answer: ${item.answers.broadcast.userAnswer}, Correct answer: ${item.answers.broadcast.correctAnswer}`}
                            </p>
                            <p>
                              Total hosts:{" "}
                              {!item.answers.hosts.userAnswer
                                ? "Your answer is correct"
                                : `Your answer: ${item.answers.hosts.userAnswer}, Correct answer: ${item.answers.hosts.correctAnswer}`}
                            </p>
                            <p>
                              SubnetMask:{" "}
                              {!item.answers.subnetMask.userAnswer
                                ? "Your answer is correct"
                                : `Your answer: ${item.answers.subnetMask.userAnswer}, Correct answer: ${item.answers.subnetMask.correctAnswer}`}
                            </p>
                            <p>
                              First Usable Host:{" "}
                              {!item.answers.firstHost.userAnswer
                                ? "Your answer is correct"
                                : `Your answer: ${item.answers.firstHost.userAnswer}, Correct answer: ${item.answers.firstHost.correctAnswer}`}
                            </p>
                            <p>
                              Last Usable Host:{" "}
                              {!item.answers.lastHost.userAnswer
                                ? "Your answer is correct"
                                : `Your answer: ${item.answers.lastHost.userAnswer}, Correct answer: ${item.answers.lastHost.correctAnswer}`}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}