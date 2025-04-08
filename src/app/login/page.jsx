"use client";

import React, { useState } from "react";
import Head from "next/head";
import { signIn ,useSession } from "next-auth/react";
import Swal from "sweetalert2";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useRouter } from 'next/navigation'
import Image from "next/image";


export default function Account() {
  const [isLogin, setIsLogin] = useState(true);
  const [identifier, setIdentifier] = useState(""); // Can be email or username
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { setIsLoggedIn } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();
  const { data: session } = useSession()

  React.useEffect(()=>{
    if(session){
      Swal.fire({
        position: "top-end",
        icon: "success",
        text: "เข้าสู่ระบบสำเร็จ!",
        showConfirmButton: false,
        timer: 1500
      });
      router.push("/");
    }
  },[session])
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!identifier || !password || (!isLogin && !name)) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      setLoading(false);
      return;
    }

    if (isLogin) {
      const result = await signIn("credentials", {
        redirect: false,
        identifier, 
        password,
      });

      if (result?.error) {
        setError("เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบข้อมูลอีกครั้ง");
      } else {
        Swal.fire({
          position: "top-end",
          icon: "success",
          text: "เข้าสู่ระบบสำเร็จ!",
          showConfirmButton: false,
          timer: 1500
        });
        setIsLoggedIn(true);
        router.push("/");
      }
    } else {
      try {
        const response = await axios.post("/api/signup", {
          name,
          username: identifier,
          email: identifier, 
          password,
        });
        if (response.data.message == "User registered successfully") {
          // Auto-login after successful signup
          const result = await signIn("credentials", {
            redirect: false,
            identifier,
            password,
          });
          if (result?.error) {
            setError("สร้างบัญชีสำเร็จ แต่เข้าสู่ระบบไม่สำเร็จ กรุณาลองใหม่");
          } else {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: "สร้างบัญชีเรียบร้อย",
              text: "เข้าสู่ระบบสำเร็จ!",
              showConfirmButton: false,
              timer: 1500
            });
            setIsLoggedIn(true);
            router.push("/");

          }
        }
      } catch (error) {
        setError(error.response?.data?.error || "เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    }

    setLoading(false);

  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/" });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  return (
    <div className={`min-h-screen w-full px-4 py-8 transition-colors duration-300 ${theme === "dark" ? "bg-[#282a2c] max-h-[80vh]" : "max-h-[80vh] bg-gray-100 text-gray-900"}`}>
      <Head>
        <title>{isLogin ? "เข้าสู่ระบบ" : "สร้างบัญชี"}</title>
      </Head>
      <div className="flex justify-center items-center mt-20">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <h1 className="text-2xl font-semibold mb-4 text-center">
            {isLogin ? "เข้าสู่ระบบ" : "สร้างบัญชี"}
          </h1>

          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  ชื่อบัญชี
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="กรุณากรอกชื่อบัญชี"
                  disabled={loading}
                  className="mt-4 h-10 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            )}

            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
                อีเมล หรือ ชื่อบัญชี
              </label>
              <input
                type="text"
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="กรอกอีเมล หรือ ชื่อบัญชี"
                disabled={loading}
                className="mt-4 h-10 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                รหัสผ่าน
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="กรอกรหัสผ่านของคุณ"
                disabled={loading}
                className="mt-4 h-10 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {loading ? "กำลังดำเนินการ..." : isLogin ? "เข้าสู่ระบบ" : "สร้างบัญชี"}
            </button>
          </form>
          <div className="mt-4 text-center">
            {isLogin ? "ยังไม่มีบัญชีใช่ไหม?" : "มีบัญชีอยู่แล้วใช่ไหม?"}
            <button
              onClick={toggleMode}
              disabled={loading}
              className="text-indigo-600 hover:text-indigo-500 ml-1"
            >
              {isLogin ? "สร้างบัญชี" : "เข้าสู่ระบบ"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
