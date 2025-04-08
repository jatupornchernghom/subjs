"use client";

import IPSubnetCalculator from "../components/Subnetmarkcal";
import { useTheme } from "../context/ThemeContext";

export default function Calculator(){
    const { theme } = useTheme();
    return (
        <div className={`min-h-screen w-full px-4 py-8 transition-colors duration-300 ${
            theme === 'dark' ? 'bg-[#282a2c] ' : 'bg-gray-100 text-gray-900'
          }`}>
            <div className="container mx-auto">
                <IPSubnetCalculator />
            </div>
        </div>
    )
}