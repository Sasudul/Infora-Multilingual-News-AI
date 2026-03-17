'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Bot, Globe } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'si', label: 'සිංහල' },
  { code: 'ta', label: 'தமிழ்' },
];

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState('en');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Firebase Auth integration point
      // const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
      // const { auth } = await import('@/lib/firebase');
      // const cred = await createUserWithEmailAndPassword(auth, email, password);
      // await updateProfile(cred.user, { displayName: name });
      // Then create user profile via backend API

      // Demo mode
      await new Promise((r) => setTimeout(r, 1200));
      window.location.href = '/chat';
    } catch (err: any) {
      setError(err.message || 'Sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-900 pt-20 pb-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-brand-500/25">
            <Bot size={30} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-white/40 text-sm">Get started with Infora AI — free forever</p>
        </div>

        {/* Form */}
        <div className="glass p-8">
          <form onSubmit={handleSignUp} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs font-medium text-white/50 mb-2">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-brand-500/40 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-white/50 mb-2">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-brand-500/40 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-white/50 mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  required
                  className="w-full pl-11 pr-12 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-brand-500/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Language */}
            <div>
              <label className="block text-xs font-medium text-white/50 mb-2">Preferred Language</label>
              <div className="relative">
                <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-brand-500/40 transition-all appearance-none"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code} className="bg-surface-900">
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-rose-400 bg-rose-400/10 rounded-lg px-4 py-2"
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 !py-3.5 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-surface-900/30 border-t-surface-900 rounded-full animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-white/30">
              Already have an account?{' '}
              <Link href="/login" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-[10px] text-white/20 mt-6">
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}
