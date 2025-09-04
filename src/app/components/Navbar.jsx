"use client";

import { useState, useRef } from "react";

export default function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-gray-900 shadow-lg">
      <ul className="flex gap-6">
        <li>
          <a href="/dashboard" className="text-amber-400 font-bold hover:underline">
            Dashboard
          </a>
        </li>
        
      </ul>

      {/* Profile Menu */}
      <div className="relative" ref={profileRef}>
        <button
          className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center focus:outline-none"
          onClick={() => setProfileOpen((v) => !v)}
        >
          <svg width="24" height="24" fill="none" stroke="black" strokeWidth="2">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 16-4 16 0" />
          </svg>
        </button>
        {profileOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg py-2 z-50">
            <a
              href="/settings"
              className="block px-4 py-2 text-gray-200 hover:bg-gray-700"
            >
              Settings
            </a>
            <button
              className="block w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-700"
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
