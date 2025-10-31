/**
 * Navbar Component
 * Fixed navigation bar with logo, links, and responsive hamburger menu
 */
'use client'

import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, Sun, Moon } from 'lucide-react';
import { Button } from '../ui/button';
import { useTheme } from '../common/ThemeProvider';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';


export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Topics', path: '/topics' },
    { name: 'Timeline', path: '/timeline' },
    { name: 'Map', path: '/maps' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? theme === 'dark'
            ? 'bg-slate-900/95 backdrop-blur-md shadow-lg'
            : 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <button
            onClick={() => router.push('/home')}
            className="flex items-center gap-3 group transition-transform hover:scale-105"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-amber-500 tracking-wider">WORLDDOC</span>
              <span
                className={`text-xs -mt-1 ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                Knowledge of Your World
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => router.push(link.path)}
                className={`relative transition-colors ${
                  path === link.path
                    ? 'text-amber-500'
                    : theme === 'dark'
                    ? 'text-slate-300 hover:text-amber-500'
                    : 'text-slate-700 hover:text-amber-500'
                }`}
              >
                {link.name}
                {path === link.path && (
                  <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
                )}
              </button>
            ))}

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={
                theme === 'dark'
                  ? 'text-slate-300 hover:text-amber-500'
                  : 'text-slate-700 hover:text-amber-500'
              }
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className={
                theme === 'dark'
                  ? 'text-slate-300 hover:text-amber-500'
                  : 'text-slate-700 hover:text-amber-500'
              }
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={
                theme === 'dark'
                  ? 'text-slate-300 hover:text-amber-500'
                  : 'text-slate-700 hover:text-amber-500'
              }
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-6 animate-in fade-in slide-in-from-top-5 duration-200">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => {
                    router.push(link.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-left px-4 py-2 rounded-lg transition-colors ${
                    path === link.path
                      ? 'bg-amber-500/10 text-amber-500'
                      : theme === 'dark'
                      ? 'text-slate-300 hover:bg-slate-800 hover:text-amber-500'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-amber-500'
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}