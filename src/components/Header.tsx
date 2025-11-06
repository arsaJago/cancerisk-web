'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
    setMobileMenuOpen(false);
  };

  // Handle scroll for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className={`bg-white sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🛡️</span>
            <span className="text-xl font-bold text-primary">Cancerisk</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`font-medium transition ${
                pathname === '/' ? 'text-primary' : 'text-gray-600 hover:text-primary'
              }`}
            >
              Beranda
            </Link>
            <Link
              href="/test"
              className={`font-medium transition ${
                isActive('/test') ? 'text-primary' : 'text-gray-600 hover:text-primary'
              }`}
            >
              Cek Risiko
            </Link>
            <Link
              href="/detailinformation"
              className={`font-medium transition ${
                isActive('/detailinformation') ? 'text-primary' : 'text-gray-600 hover:text-primary'
              }`}
            >
              Informasi Kesehatan
            </Link>
            
            {/* Admin menu - only show for admin */}
            {isAuthenticated() && isAdmin() && (
              <Link
                href="/admin"
                className={`font-medium transition ${
                  isActive('/admin') ? 'text-primary' : 'text-gray-600 hover:text-primary'
                }`}
              >
                Admin
              </Link>
            )}

            {/* Login/Logout button */}
            {isAuthenticated() ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Halo, <strong>{user?.username}</strong>
                  {isAdmin() && <span className="ml-1 text-xs bg-primary text-white px-2 py-0.5 rounded">Admin</span>}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-danger text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-600 hover:text-primary transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-slideDown">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  pathname === '/' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                🏠 Beranda
              </Link>
              <Link
                href="/test"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  isActive('/test') ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                🔬 Cek Risiko
              </Link>
              <Link
                href="/detailinformation"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  isActive('/detailinformation') ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                📚 Informasi Kesehatan
              </Link>
              
              {/* Admin menu - only show for admin */}
              {isAuthenticated() && isAdmin() && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    isActive('/admin') ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  👤 Admin
                </Link>
              )}

              {/* User info and Login/Logout */}
              {isAuthenticated() ? (
                <div className="px-4 py-2 border-t border-gray-200 mt-2 pt-4">
                  <p className="text-sm text-gray-600 mb-3">
                    Halo, <strong>{user?.username}</strong>
                    {isAdmin() && <span className="ml-2 text-xs bg-primary text-white px-2 py-0.5 rounded">Admin</span>}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-danger text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="mx-4 mt-2 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition text-center"
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
