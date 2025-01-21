import React from 'react';
import Image from 'next/image';
import hero from '@/assets/1024x1024.png';
export default function HeroSection() {
  return (
    <div className="relative h-screen flex items-center justify-center text-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={hero}
          alt="Hero Image"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>{' '}
        {/* Overlay */}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <h1 className="text-5xl font-bold mb-4 animate-appear">
          Welcome to Our Website
        </h1>
        <p className="text-xl mb-8 animate-appear">
          Your catchy slogan or description goes here.
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Get Started
        </button>
      </div>
    </div>
  );
}
