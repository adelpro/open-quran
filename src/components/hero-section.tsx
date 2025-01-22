import Image from 'next/image';
import React from 'react';

import hero from '@/assets/1024x1024.png';
export default function HeroSection() {
  return (
    <div className="relative flex h-screen items-center justify-center text-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image src={hero} alt="Hero Image" fill quality={100} />
        <div className="absolute inset-0 bg-black opacity-50"></div>{' '}
        {/* Overlay */}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <h1 className="animate-appear mb-4 text-5xl font-bold">
          Welcome to Our Website
        </h1>
        <p className="animate-appear mb-8 text-xl">
          Your catchy slogan or description goes here.
        </p>
        <button className="rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700">
          Get Started
        </button>
      </div>
    </div>
  );
}
