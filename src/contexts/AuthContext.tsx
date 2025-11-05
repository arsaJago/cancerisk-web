'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  username: string;
  role: 'admin' | 'user';
}

interface StoredUser {
  username: string;
  password: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean | string;
  register: (fullName: string, password: string) => boolean | string;
  logout: () => void;
  isAdmin: () => boolean;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin account (hardcoded)
const ADMIN_USER = { username: 'admin', password: 'admin123', role: 'admin' as const };

// Get all registered users from localStorage
const getStoredUsers = (): StoredUser[] => {
  if (typeof window === 'undefined') return [];
  const users = localStorage.getItem('registeredUsers');
  return users ? JSON.parse(users) : [];
};

// Save users to localStorage
const saveStoredUsers = (users: StoredUser[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('registeredUsers', JSON.stringify(users));
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (username: string, password: string): boolean | string => {
    // Check admin first
    if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
      const userData = { username: ADMIN_USER.username, role: ADMIN_USER.role };
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return true;
    }

    // Check registered users
    const storedUsers = getStoredUsers();
    const foundUser = storedUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      const userData = { username: foundUser.username, role: foundUser.role };
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return true;
    }
    
    return 'Username atau password salah';
  };

  const register = (fullName: string, password: string): boolean | string => {
    // Validate full name (must have at least 2 words)
    const nameParts = fullName.trim().split(/\s+/);
    if (nameParts.length < 2) {
      return 'Nama harus terdiri dari minimal 2 kata (contoh: Ardhian Dwi)';
    }

    // Generate username from full name (remove spaces, lowercase)
    const username = fullName.trim().replace(/\s+/g, '').toLowerCase();

    // Validate username length
    if (username.length < 3) {
      return 'Username terlalu pendek';
    }

    // Check if username already exists (including admin)
    if (username === 'admin') {
      return 'Username tidak tersedia';
    }

    const storedUsers = getStoredUsers();
    const existingUser = storedUsers.find((u) => u.username === username);
    
    if (existingUser) {
      return 'Username sudah digunakan. Silakan gunakan nama yang berbeda.';
    }

    // Validate password
    if (password.length < 6) {
      return 'Password minimal 6 karakter';
    }

    // Create new user
    const newUser: StoredUser = {
      username,
      password,
      role: 'user',
    };

    // Save to localStorage
    storedUsers.push(newUser);
    saveStoredUsers(storedUsers);

    // Auto login after registration
    const userData = { username: newUser.username, role: newUser.role };
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));

    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isAuthenticated = () => {
    return user !== null;
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
