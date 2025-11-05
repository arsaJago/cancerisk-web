'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🛡️</span>
            <span className="text-xl font-bold text-primary">Cancerisk</span>
          </Link>

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
          <button className="md:hidden text-gray-600">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
