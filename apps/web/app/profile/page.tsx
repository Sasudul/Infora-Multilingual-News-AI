'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { userApi } from '@/lib/api';
import { motion } from 'framer-motion';
import { User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, dbUser, loading, refreshProfile } = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [profileImageUrl, setProfileImageUrl] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (dbUser) {
      const nameParts = (dbUser.name || '').split(' ');
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
      setEmail(dbUser.email || '');
      setProfileImageUrl(dbUser.profileImageUrl || user?.photoURL || '');
    } else if (user) {
      const nameParts = (user.displayName || '').split(' ');
      setFirstName(nameParts[0] || '');
      setLastName(nameParts.slice(1).join(' ') || '');
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
      const fullName = `${firstName} ${lastName}`.trim();
      await userApi.createOrUpdate(user.uid, {
        name: fullName,
        email,
        profileImageUrl,
        preferredLanguage: dbUser?.preferredLanguage || 'en',
      });
      await refreshProfile();
      setStatusMsg('Profile successfully updated.');
    } catch (err: any) {
      setStatusMsg(err.message || 'Failed to update profile.');
    }
    setIsSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-[#0A0D14]">
        <div className="w-8 h-8 rounded-full border-2 border-[#7DBDEC]/30 border-t-[#7DBDEC] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 bg-[#0A0D14] flex flex-col items-center">
      <div className="w-full max-w-[900px] px-6">
        
        <h1 className="font-display text-3xl md:text-4xl font-bold text-center text-[#7DBDEC] mb-12 tracking-wide">
          Edit Profile
        </h1>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-14 items-start">
          
          {/* Left Column: Profile Image Box */}
          <div className="w-full md:w-[320px] flex-shrink-0">
            <h2 className="text-white font-bold text-lg mb-4 tracking-wide font-display">Profile Image</h2>
            <div className="bg-[#10141F] rounded-2xl p-8 border border-white/5 flex flex-col items-center shadow-2xl">
              
              <div className="relative w-40 h-40 rounded-full border border-white/10 overflow-hidden bg-brand-500/10 flex items-center justify-center mb-8 shadow-inner">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={64} className="text-white/20" />
                )}
              </div>

              <div className="w-full space-y-3">
                <button
                  type="button"
                  className="w-full py-3 rounded text-[#0A0D14] font-semibold text-sm bg-gradient-to-r from-blue-100 to-[#7DBDEC] hover:opacity-90 transition-opacity"
                >
                  Update
                </button>
                <button
                  type="button"
                  className="w-full py-3 rounded text-white/70 font-semibold text-sm border border-white/20 hover:bg-white/5 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Account Info Form */}
          <div className="flex-1 w-full">
            <h2 className="text-white font-bold text-lg mb-4 tracking-wide font-display">Account Info</h2>
            
            <form onSubmit={handleSave} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-lg bg-[#181D29] border border-white/[0.04] text-white/70 placeholder:text-white/20 focus:border-[#7DBDEC]/50 focus:bg-[#1A202E] transition-all outline-none text-sm"
                    placeholder="Your first name here"
                  />
                </div>
                
                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-lg bg-[#181D29] border border-white/[0.04] text-white/70 placeholder:text-white/20 focus:border-[#7DBDEC]/50 focus:bg-[#1A202E] transition-all outline-none text-sm"
                    placeholder="Your last name here"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email Address */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    disabled
                    className="w-full px-4 py-3.5 rounded-lg bg-[#181D29] border border-white/[0.04] text-white/40 cursor-not-allowed text-sm"
                    placeholder="Your email address here"
                  />
                </div>

                {/* Contact Number */}
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Contact Number</label>
                  <input
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-lg bg-[#181D29] border border-white/[0.04] text-white/70 placeholder:text-white/20 focus:border-[#7DBDEC]/50 focus:bg-[#1A202E] transition-all outline-none text-sm"
                    placeholder="Your contact number here"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button type="button" className="text-sm text-[#7DBDEC] hover:text-white transition-colors">
                  Reset Password
                </button>
              </div>

              {statusMsg && (
                <div className={`p-4 rounded-lg text-sm ${statusMsg.includes('success') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  {statusMsg}
                </div>
              )}

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-8 py-3.5 rounded font-semibold text-sm text-[#0A0D14] bg-gradient-to-r from-blue-200 to-[#7DBDEC] hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSaving ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>

          </div>
        </div>

      </div>
    </div>
  );
}
