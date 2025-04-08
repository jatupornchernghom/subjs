"use client"; 

export default function Footer() {
  return (
    <footer className="bg-[#282a2c] text-white p-4 text-center">
      <p>&copy; {new Date().getFullYear()} SubnetMarkCal All rights reserved.</p>
    </footer>
  );
}
