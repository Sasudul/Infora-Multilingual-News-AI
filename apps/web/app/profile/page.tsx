'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useI18n } from '@/i18n';
import { userApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { Save, User as UserIcon, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, dbUser, loading, signOut, refreshProfile } = useAuth();
  const { t } = useI18n();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (dbUser) {
      setName(dbUser.name);
      setEmail(dbUser.email);
      setProfileImageUrl(dbUser.profileImageUrl || user?.photoURL || '');
      setPreferredLanguage(dbUser.preferredLanguage || 'en');
    } else if (user) {
      setName(user.displayName || '');
      setEmail(user.email || '');
      setProfileImageUrl(user.photoURL || '');
    }
  }, [dbUser, user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    setStatusMsg('');
    try {
      await userApi.createOrUpdate(user.uid, {
        name,
        email,
        profileImageUrl,
        preferredLanguage,
      });
      await refreshProfile();
      setStatusMsg('Profile successfully saved! The AI now knows correctly who you are.');
    } catch (err: any) {
      setStatusMsg(err.message || 'Failed to update profile.');
    }
    setIsSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-surface-900">
        <div className="w-8 h-8 rounded-full border-2 border-brand-500/30 border-t-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-surface-900 flex flex-col">
      <div className="flex-1 w-full max-w-xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-800 border border-white/[0.06] rounded-2xl p-6 sm:p-10 shadow-xl"
        >
          <div className="text-center mb-10">
            <div className="relative w-24 h-24 mx-auto mb-4 rounded-full border-[3px] border-brand-500/30 overflow-hidden bg-brand-500/10 flex items-center justify-center">
              {profileImageUrl ? (
                <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={36} className="text-brand-400" />
              )}
            </div>
            <h1 className="font-display text-2xl font-bold text-white mb-2">My Profile</h1>
            <p className="text-white/40 text-sm">Integrate directly with Infora AI</p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Display Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-brand-500 focus:bg-white/[0.06] transition-all outline-none"
                placeholder="Name that AI will call you"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                disabled
                className="w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-white/50 cursor-not-allowed"
                placeholder="Email Address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Profile Image URL</label>
              <input
                type="url"
                value={profileImageUrl}
                onChange={(e) => setProfileImageUrl(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 focus:border-brand-500 focus:bg-white/[0.06] transition-all outline-none"
                placeholder="https://..."
              />
              <p className="text-xs text-brand-400/70 mt-1.5 flex items-center gap-1.5 px-1">Tip: By default imported exactly from your Google Profile</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Bot Preferred Interaction Language</label>
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white focus:border-brand-500 outline-none appearance-none"
              >
                <option value="en" className="bg-surface-800">English (Global)</option>
                <option value="si" className="bg-surface-800">Sinhala (Sri Lanka)</option>
                <option value="ta" className="bg-surface-800">Tamil (Sri Lanka)</option>
              </select>
            </div>

            {statusMsg && (
              <div className={`p-4 rounded-xl text-sm ${statusMsg.includes('success') ? 'bg-accent-green/10 text-accent-green' : 'bg-rose-500/10 text-rose-400'}`}>
                {statusMsg}
              </div>
            )}

            <div className="pt-4 flex flex-col gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="w-full py-3.5 rounded-xl bg-brand-500 hover:bg-brand-400 text-white font-semibold transition-colors flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-brand-500/20 disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={18} /> Update Matrix
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => { signOut(); router.push('/'); }}
                className="w-full py-3.5 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
