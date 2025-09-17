// src/components/Footer.js
import React from 'react';
import { FaTwitter, FaGithub, FaLinkedin } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm">&copy; 2025 LearnSphere. All Rights Reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          {/* FIX: Replaced '#' with actual links and added security attributes */}
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300"><FaTwitter size={20} /></a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300"><FaGithub size={20} /></a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors duration-300"><FaLinkedin size={20} /></a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;