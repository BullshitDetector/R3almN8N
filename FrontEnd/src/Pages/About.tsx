// src/pages/About.tsx
import React from 'react';

export default function About() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        About NexusPro
      </h1>
      <p className="text-lg text-gray-300 leading-relaxed">
        NexusPro is a modern, dark-themed dashboard framework built for developers who demand beauty and performance. 
        Powered by React, TypeScript, Tailwind CSS, and Framer Motion, it delivers a premium experience out of the box.
      </p>
      <div className="mt-8 p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
        <h2 className="text-2xl font-semibold mb-4">Tech Stack</h2>
        <ul className="space-y-2 text-gray-300">
          <li>React 18 + TypeScript</li>
          <li>Vite for blazing fast builds</li>
          <li>Tailwind CSS with glassmorphism</li>
          <li>Framer Motion for smooth animations</li>
          <li>Lucide React icons</li>
        </ul>
      </div>
    </div>
  );
}