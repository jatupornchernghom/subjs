"use client";

import Link from "next/link";
import { useTheme } from "./context/ThemeContext";
import Image from "next/image";
export default function Home() {
  const { theme } = useTheme();
  

  return (
    <div className={`min-h-screen w-full px-4 py-8 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#282A2C] text-gray-100' : 'bg-gray-100 text-gray-900'
    }`}>
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto p-6">
          {/* Header */}
          <header className="mb-8">
            <h1 className={`text-3xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
              เข้าใจเรื่อง IP Subnetting แบบครบจบในที่เดียว
            </h1>
            <div className={`flex items-center text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>

              <div>
              </div>
            </div>
          </header>

          <div className={`mb-8 rounded-lg overflow-hidden h-64 flex items-center justify-center bg-white`}>
              <div >
                <Image
                  src="/images/sub.svg"
                  width={400}
                  height={200}
                  alt="Subnetting Concept"
                  
                />
              </div>
          </div>

          <article className="prose max-w-none">
            <h2 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
              IP Subnetting คืออะไร?
            </h2>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              IP Subnetting ก็คือการ "แบ่งเครือข่ายใหญ่ๆ ออกเป็นเครือข่ายย่อยๆ หลายๆ เครือข่าย" 
              ลองนึกภาพว่าคุณมีบ้านหลังใหญ่หลังนึง แล้วคุณอยากจะแบ่งบ้านหลังนั้นออกเป็นห้องเล็กๆ หลายๆ ห้อง 
              เพื่อให้แต่ละห้องมีคนอยู่ได้เป็นสัดส่วนมากขึ้น และจัดการได้ง่ายขึ้น IP Subnetting ก็เหมือนกัน
            </p>

            <h2 className={`text-2xl font-bold mt-6 mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
            ทำไมต้องแบ่ง?
            </h2>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              มีเหตุผลสำคัญหลายประการที่ผู้ดูแลระบบเครือข่ายเลือกใช้การแบ่งซับเน็ต:
            </p>
            <ul className={`list-disc pl-6 mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <li className="mb-2"><strong>ทำให้เครือข่ายเร็วขึ้น:</strong> ลดปริมาณข้อมูลที่ส่งกระจายทั่วทั้งเครือข่าย (broadcast) ทำให้การรับส่งข้อมูลเร็วขึ้น
              .</li>
              <li className="mb-2"><strong>ทำให้เครือข่ายปลอดภัยขึ้น:</strong> จำกัดขอบเขตของปัญหา หากเกิดปัญหาในซับเน็ตหนึ่ง จะไม่กระทบต่อซับเน็ตอื่น
              .</li>
              <li className="mb-2"><strong>จัดการทรัพยากรได้ดีขึ้น:</strong> แบ่งเครือข่ายตามแผนกหรือประเภทอุปกรณ์ ทำให้ควบคุมและจัดการได้ง่ายขึ้น</li>
            </ul>
              <p>สรุปง่ายๆ คือ IP Subnetting ช่วยให้คนดูแลเครือข่าย (Network Administrator) จัดการเครือข่ายได้ง่ายขึ้น เร็วขึ้น และปลอดภัยขึ้น</p>

              <h2 className={`text-2xl font-bold mt-6 mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
              Subnet VS  VLAN 
            </h2>
            <ul className={`list-disc pl-6 mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <li className="mb-2"><strong>Subnet แบ่งเครือข่ายโดยใช้ IP address (Layer 3) ในขณะที่ VLAN แบ่งเครือข่ายโดยใช้ Port ของ Switch (Layer 2)
              </strong></li>
              <li className="mb-2"><strong>Subnet เน้นการจัดการการรับส่งข้อมูลระหว่างเครือข่าย ในขณะที่ VLAN เน้นการเพิ่มความปลอดภัยและจัดการเครือข่ายภายใน LAN </strong></li>
              <li className="mb-2"><strong>ทั้งสองเทคโนโลยีสามารถใช้ร่วมกันเพื่อเพิ่มประสิทธิภาพและความปลอดภัยของเครือข่าย</strong></li>
            </ul>
              
            <h2 className={`text-2xl font-bold mt-6 mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
            CIDR Notation หรือ "การเขียนแบบย่อของ IP address"
            </h2>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            ยกตัวอย่าง "192.168.1.0/24" เป็นการระบุ IP address ของเครือข่าย โดย "192.168.1.0" คือตัวเลข IP address ที่ใช้แทนเครือข่ายนั้นๆ และ "/24" คือสัญลักษณ์ที่เรียกว่า CIDR (Classless Inter-Domain Routing) ซึ่งบอกว่า IP address นี้ถูกแบ่งออกเป็น 2 ส่วน
            </p>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              ส่วนแรกคือ Network ID (24 บิตแรก): ใช้ระบุว่า IP address นี้อยู่ในเครือข่ายไหน เปรียบเสมือนชื่อหมู่บ้านที่บอกว่าบ้านหลังนี้อยู่ในหมู่บ้านอะไร
            </p>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>ส่วนที่สองคือ Host ID (8 บิตที่เหลือ): ใช้ระบุว่าอุปกรณ์ใดอยู่ในเครือข่ายนั้นๆ เปรียบเสมือนเลขที่บ้านที่บอกว่าบ้านหลังนี้เป็นบ้านเลขที่อะไรในหมู่บ้าน
            </p>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>ดังนั้น "/24" จึงหมายความว่า 24 บิตแรกของ IP address ใช้สำหรับระบุเครือข่าย และ 8 บิตที่เหลือใช้สำหรับระบุอุปกรณ์ภายในเครือข่ายนั้นๆ ทำให้ทราบได้ว่าเครือข่ายนี้สามารถมีอุปกรณ์เชื่อมต่อได้สูงสุด 254 อุปกรณ์ (2^8 - 2)
            </p>

            <h2 className={`text-2xl font-bold mt-6 mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
              Subnet Mask ที่ใช้บ่อยๆ กับการใช้งานของมัน แบบเข้าใจง่ายๆ
            </h2>
            <div className="overflow-x-auto mb-6">
              <table className={`min-w-full border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`}>
                <thead>
                  <tr className={theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}>
                    <th className={`border px-4 py-2 ${
                      theme === 'dark' ? 'border-gray-700 text-gray-200' : 'border-gray-300'
                    }`}>CIDR</th>
                    <th className={`border px-4 py-2 ${
                      theme === 'dark' ? 'border-gray-700 text-gray-200' : 'border-gray-300'
                    }`}>Subnet Mask</th>
                    <th className={`border px-4 py-2 ${
                      theme === 'dark' ? 'border-gray-700 text-gray-200' : 'border-gray-300'
                    }`}>Usable Hosts</th>
                    <th className={`border px-4 py-2 ${
                      theme === 'dark' ? 'border-gray-700 text-gray-200' : 'border-gray-300'
                    }`}>การใช้งาน</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={theme === 'dark' ? 'bg-gray-900' : ''}>
                    <td className={`border px-4 py-2 ${
                      theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-300'
                    }`}>/32</td>
                    <td className={`border px-4 py-2 ${
                      theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-300'
                    }`}>255.255.255.255</td>
                    <td className={`border px-4 py-2 ${
                      theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-300'
                    }`}>1</td>
                    <td className={`border px-4 py-2 ${
                      theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-300'
                    }`}>ใช้กำหนดเส้นทางสำหรับอุปกรณ์เดี่ยวๆ (Single host route)</td>
                  </tr>
                  <tr className={theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}>
                    <td className={`border px-4 py-2 ${
                      theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-300'
                    }`}>/31</td>
                    <td className={`border px-4 py-2 ${
                      theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-300'
                    }`}>255.255.255.254</td>
                    <td className={`border px-4 py-2 ${
                      theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-300'
                    }`}>2</td>
                    <td className={`border px-4 py-2 ${
                      theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-300'
                    }`}>Point-to-point WAN links</td>
                  </tr>
                  <tr className={theme === 'dark' ? 'bg-gray-900' : ''}>
                    <td className={`border px-4 py-2 ${
                      theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-300'
                    }`}>/30</td>
                    <td className={`border px-4 py-2 ${
                      theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-300'
                    }`}>255.255.255.252</td>
                    <td className={`border px-4 py-2 ${
                      theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-300'
                    }`}>2</td>
                    <td className={`border px-4 py-2 ${
                      theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-300'
                    }`}>ใช้เชื่อมต่ออุปกรณ์ 2 ตัวแบบตรงๆ (Point-to-point links)</td>
                  </tr>
                  <tr className={theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}>
                    <td className={`border px-4 py-2 ${
                      theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-300'
                    }`}>/29</td>
                    <td className={`border px-4 py-2 ${
                      theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-300'
                    }`}>255.255.255.248</td>
                    <td className={`border px-4 py-2 ${
                      theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-300'
                    }`}>6</td>
                    <td className={`border px-4 py-2 ${
                      theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-300'
                    }`}> ใช้กับเครือข่ายเล็กๆ (Small networks)</td>
                  </tr>
                  <tr className={theme === 'dark' ? 'bg-gray-900' : ''}>
                    <td className={`border px-4 py-2 ${
                      theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-300'
                    }`}>/24</td>
                    <td className={`border px-4 py-2 ${
                      theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-300'
                    }`}>255.255.255.0</td>
                    <td className={`border px-4 py-2 ${
                      theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-300'
                    }`}>254</td>
                    <td className={`border px-4 py-2 ${
                      theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-300'
                    }`}>ใช้กับเครือข่ายขนาดทั่วไป (Traditional Class C network)</td>
                  </tr>
                  <tr className={theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}>
                    <td className={`border px-4 py-2 ${
                      theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-300'
                    }`}>/16</td>
                    <td className={`border px-4 py-2 ${
                      theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-300'
                    }`}>255.255.0.0</td>
                    <td className={`border px-4 py-2 ${
                      theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-300'
                    }`}>65,534</td>
                    <td className={`border px-4 py-2 ${
                      theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-300'
                    }`}>ใช้กับเครือข่ายขนาดใหญ่ (Traditional Class B network)</td>
                  </tr>
                  <tr className={theme === 'dark' ? 'bg-gray-900' : ''}>
                    <td className={`border px-4 py-2 ${
                      theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-300'
                    }`}>/8</td>
                    <td className={`border px-4 py-2 ${
                      theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-300'
                    }`}>255.0.0.0</td>
                    <td className={`border px-4 py-2 ${
                      theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-300'
                    }`}>16,777,214</td>
                    <td className={`border px-4 py-2 ${
                      theme === 'dark' ? 'border-gray-700 text-gray-300' : 'border-gray-300'
                    }`}>ใช้กับเครือข่ายขนาดใหญ่มากๆ (Traditional Class A network)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className={`text-2xl font-bold mt-6 mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
              IP Address Classes
            </h2>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            แม้ว่าระบบเครือข่ายสมัยใหม่จะใช้รูปแบบ CIDR เป็นหลัก แต่การทำความเข้าใจคลาสของที่อยู่ IP แบบยังคงมีความสำคัญ:
            </p>
            <ul className={`list-disc pl-6 mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <li className="mb-2"><strong>Class A:</strong> บิตแรกของ IP address เป็น 0 เสมอ มีวงเครือข่ายได้ 126 เครือข่าย แต่ละเครือข่ายมีอุปกรณ์ได้ ประมาณ 16 ล้านอุปกรณ์ ช่วง IP address: (1.0.0.0 ถึง 126.255.255.255)</li>
              <li className="mb-2"><strong>Class B:</strong> สองบิตแรกของ IP address เป็น 10 เสมอ มีวงเครือข่ายได้ 16,384 เครือข่าย แต่ละเครือข่ายมีอุปกรณ์ได้ประมาณ 65,534 อุปกรณ์ช่วง IP address: (128.0.0.0 ถึง 191.255.255.255)</li>
              <li className="mb-2"><strong>Class C:</strong> สามบิตแรกของ IP address เป็น 110 เสมอ มีวงเครือข่ายได้ประมาณ 2 ล้านเครือข่าย แต่ละเครือข่ายมีอุปกรณ์ได้ 254 อุปกรณ์ ช่วง IP address: (192.0.0.0 ถึง 223.255.255.255)              </li>
              <li className="mb-2"><strong>Class D:</strong> ใช้สำหรับการส่งข้อมูลแบบ "multicast" (ส่งข้อมูลไปให้อุปกรณ์หลายๆ ตัวพร้อมกัน) ช่วง IP address: (224.0.0.0 ถึง 239.255.255.255)</li>
              <li className="mb-2"><strong>Class E:</strong> สงวนไว้สำหรับการทดลอง ช่วง IP address: (240.0.0.0 ถึง 255.255.255.255)</li>
            </ul>

            <h2 className={`text-2xl font-bold mt-6 mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
              ลองใช้เครื่องคำนวณซับเน็ต IP
            </h2>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            <Link href="/calculator">
              <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                ลองใช้งาน!
              </button>
            </Link>
            </p>
          </article>
          <Link href="https://en.wikipedia.org/wiki/Subnet">
          <h1 className="flex justify-end font-bold">ขอบคุณข้อมูลจาก wikipedia</h1>
          </Link>
        </div>
      </div>
    </div>
  );
}