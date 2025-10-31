/**
 * Footer Component
 * Site footer with social links, navigation, and copyright information
 */

'use client'

import React from 'react';
import { Globe, Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';
import { useTheme } from '../common/ThemeProvider';
import { useRouter } from 'next/navigation';


export default function Footer() {
  const { theme } = useTheme();
  const router = useRouter();

  const footerLinks = [
    { name: 'Home', path: '/' },
    { name: 'Topics', path: '/topics' },
    { name: 'Timeline', path: '/timeline' },
    { name: 'Map', path: '/maps' },
    { name: 'About', path: '/about' },
  ];

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Youtube, label: 'YouTube', href: '#' },
    { icon: Mail, label: 'Email', href: '#' },
  ];

  return (
    <footer className={`${
      theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
    } border-t mt-20`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-amber-500 tracking-wider">WORLDDOC</span>
                <span className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  Knowledge of Your World
                </span>
              </div>
            </div>
            <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} text-sm max-w-xs`}>
              Explore the knowledge of our world through cinematic storytelling and immersive experiences.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-amber-500 mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2">
              {footerLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => router.push(link.path)}
                  className={`${
                    theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                  } hover:text-amber-500 transition-colors text-left text-sm`}
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-amber-500 mb-4">Connect With Us</h3>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className={`w-10 h-10 rounded-full ${
                      theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'
                    } hover:bg-amber-500 flex items-center justify-center transition-all hover:scale-110`}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className={`border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'} pt-8`}>
          <div className={`flex flex-col md:flex-row justify-between items-center gap-4 text-sm ${
            theme === 'dark' ? 'text-slate-500' : 'text-slate-600'
          }`}>
            <p>&copy; 2025 WorldDoc. All rights reserved.</p>
            <div className="flex gap-6">
              <button className="hover:text-amber-500 transition-colors">Privacy Policy</button>
              <button className="hover:text-amber-500 transition-colors">Terms of Service</button>
              <button className="hover:text-amber-500 transition-colors">Contact</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}