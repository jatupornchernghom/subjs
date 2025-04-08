"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function Navbar() {
  const fullText = "IP SUBNET CALCULATOR";
  const animationSpeed = 150;

  const { theme, toggleTheme } = useTheme();
  const { isLoggedIn, user, logout } = useAuth();
  const router = useRouter();
  
  const [isOpen, setIsOpen] = useState(false);
  const [animatedText, setAnimatedText] = useState(fullText); // Default to full text

  useEffect(() => {
    let charIndex = 0;
    let animationInterval = setInterval(() => {
      if (charIndex <= fullText.length) {
        setAnimatedText(fullText.substring(0, charIndex));
        charIndex++;
      } else {
        clearInterval(animationInterval);
      }
    }, animationSpeed);

    return () => clearInterval(animationInterval);
  }, []); // Only runs on client

  const handleLogout = async () => {
    await logout();
    Swal.fire({
      position: "top-end",
      icon: "success",
      text: "ออกจากระบบเรียบร้อย!",
      showConfirmButton: false,
      timer: 1500,
    });
    router.push("/");
    setIsOpen(false);
  };

  return (
   <nav className={`shadow-lg ${theme === "dark" ? "bg-[#212121] text-white" : "bg-white text-gray-800"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <span className="text-xl font-bold cursor-pointer">{animatedText}</span>
            </Link>
          </div>
            
          <div className="hidden md:flex items-center space-x-4">
          <Link href="/calculator" className={`px-3 py-2 rounded-md text-sm font-medium  ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}>
              Calculator
            </Link>
            <Link href="/challenge" className={`px-3 py-2 rounded-md text-sm font-medium  ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}>
              Challenge
            </Link>
            
            {isLoggedIn ? (
              <>
              <Link href="/history" className={`block px-3 py-2 rounded-md text-base font-medium ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}>
                  History Challenge
              </Link>
                <span className="px-3 py-2 text-sm font-medium">
                  {user?.name || user?.username || "User"}
                </span>

                <button 
                  onClick={handleLogout}
                  className={`px-3 py-2 rounded-md text-sm font-medium  ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}>
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className={`px-3 py-2 rounded-md text-sm font-medium ${theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}>
                Login
              </Link>
            )}
            <button 
              onClick={toggleTheme} 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                theme === "dark" 
                  ? "bg-gray-700 hover:bg-gray-600" 
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
            </button>
          </div>
          
          <div className="flex md:hidden items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center justify-center p-2 rounded-md">
              {isOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className={`md:hidden ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link href="/calculator" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-200 dark:hover:bg-gray-700">
              Calculator
            </Link>
            <Link href="/challenge" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-200 dark:hover:bg-gray-700">
              Challenge
            </Link>
            
            {isLoggedIn ? (
              <>
                <span className="block px-3 py-2 text-base font-medium">
                  {user?.name || user?.username || "User"}
                </span>
                <Link href="/history" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-200 dark:hover:bg-gray-700">
                  History tests
                </Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-200 dark:hover:bg-gray-700">
                LOGIN
              </Link>
            )}

            <button 
              onClick={toggleTheme}
              className={`w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                theme === "dark" 
                  ? "bg-gray-700 hover:bg-gray-600" 
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {theme === "dark" ? "🌙 Dark Mode" : "☀️ Light Mode"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}