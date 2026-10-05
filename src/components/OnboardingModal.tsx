import React, { useState } from 'react';
import { UserProfile, UserPermissions } from '../types';
import { StorageService } from '../services/storage';
import { Shield, Mic, Camera, Bell, FolderUp, Check, ArrowRight } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (user: UserProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Progressive Permissions
  const [permissions, setPermissions] = useState<UserPermissions>({
    microphone: true,
    camera: false,
    notifications: true,
    files: true,
  });

  // Step 2: Auth
  const [authMethod, setAuthMethod] = useState<'google' | 'email_otp' | 'phone_otp'>('google');
  const [emailOrPhone, setEmailOrPhone] = useState('dileepsah267@gmail.com');
  const [otpCode, setOtpCode] = useState('482910');
  const [otpSent, setOtpSent] = useState(false);

  // Step 3: Personal Setup
  const [name, setName] = useState('Suraj Kumar');
  const [displayName, setDisplayName] = useState('Suraj Kumar');
  const [dailyHours, setDailyHours] = useState(5);
  const [language, setLanguage] = useState<'Hindi' | 'English' | 'Hinglish'>('Hindi');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Robotics & AI',
    'Cybersecurity',
    'Hardware Systems',
  ]);

  if (!isOpen) return null;

  const togglePermission = (key: keyof UserPermissions) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFinish = () => {
    const existing = StorageService.getUserProfile();
    const updated: UserProfile = {
      ...existing,
      name,
      displayName,
      email: emailOrPhone.includes('@') ? emailOrPhone : existing.email,
      phone: !emailOrPhone.includes('@') ? emailOrPhone : existing.phone,
      dailyAvailableHours: dailyHours,
      preferredLanguage: language,
      learningInterests: selectedInterests,
      permissions,
      isOnboarded: true,
    };
    StorageService.saveUserProfile(updated);
    onComplete(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400" />
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Onboarding • Step {step} of 3
            </span>
          </div>
          <span className="text-xs font-semibold text-indigo-400">
            {step === 1 ? 'Permissions' : step === 2 ? 'Authentication' : 'Personal Setup'}
          </span>
        </div>

        {/* STEP 1: Progressive Permissions */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">App Permissions</h2>
              <p className="text-xs text-slate-400 mt-1">
                WHO AM I? uses progressive permissions. Only grant what you need; you can continue without non-essential permissions.
              </p>
            </div>

            <div className="space-y-3">
              <div
                onClick={() => togglePermission('microphone')}
                className={`cursor-pointer p-3.5 rounded-2xl border transition flex items-start gap-3.5 ${
                  permissions.microphone
                    ? 'bg-indigo-950/40 border-indigo-500/50'
                    : 'bg-slate-950 border-slate-800 opacity-60'
                }`}
              >
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0">
                  <Mic className="w-4 h-4" />
                </div>
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between font-semibold text-slate-200">
                    <span>Microphone</span>
                    {permissions.microphone && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Required for live voice conversations with LYRA.
                  </p>
                </div>
              </div>

              <div
                onClick={() => togglePermission('camera')}
                className={`cursor-pointer p-3.5 rounded-2xl border transition flex items-start gap-3.5 ${
                  permissions.camera
                    ? 'bg-indigo-950/40 border-indigo-500/50'
                    : 'bg-slate-950 border-slate-800 opacity-60'
                }`}
              >
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 shrink-0">
                  <Camera className="w-4 h-4" />
                </div>
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between font-semibold text-slate-200">
                    <span>Camera (Avatar Video Mode)</span>
                    {permissions.camera && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Optional: For video call interface representation with fairy avatar.
                  </p>
                </div>
              </div>

              <div
                onClick={() => togglePermission('notifications')}
                className={`cursor-pointer p-3.5 rounded-2xl border transition flex items-start gap-3.5 ${
                  permissions.notifications
                    ? 'bg-indigo-950/40 border-indigo-500/50'
                    : 'bg-slate-950 border-slate-800 opacity-60'
                }`}
              >
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between font-semibold text-slate-200">
                    <span>Notifications & Alerts</span>
                    {permissions.notifications && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Alerts for Success Track warnings and spaced revision schedules.
                  </p>
                </div>
              </div>

              <div
                onClick={() => togglePermission('files')}
                className={`cursor-pointer p-3.5 rounded-2xl border transition flex items-start gap-3.5 ${
                  permissions.files
                    ? 'bg-indigo-950/40 border-indigo-500/50'
                    : 'bg-slate-950 border-slate-800 opacity-60'
                }`}
              >
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                  <FolderUp className="w-4 h-4" />
                </div>
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between font-semibold text-slate-200">
                    <span>File / PDF Storage Access</span>
                    {permissions.files && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Allows uploading syllabi, question banks, and notes for AI topic extraction.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full mt-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs flex items-center justify-center gap-2 transition"
            >
              <span>Continue to Authentication</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* STEP 2: Authentication */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">Secure Account Access</h2>
              <p className="text-xs text-slate-400 mt-1">
                Isolated user workspace. Select your verified authentication channel.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setAuthMethod('google');
                  setEmailOrPhone('dileepsah267@gmail.com');
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition ${
                  authMethod === 'google'
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Google Auth
              </button>
              <button
                onClick={() => {
                  setAuthMethod('email_otp');
                  setEmailOrPhone('dileepsah267@gmail.com');
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition ${
                  authMethod === 'email_otp'
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Email OTP
              </button>
              <button
                onClick={() => {
                  setAuthMethod('phone_otp');
                  setEmailOrPhone('+91 98765 43210');
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition ${
                  authMethod === 'phone_otp'
                    ? 'bg-indigo-600 border-indigo-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Mobile OTP
              </button>
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-medium text-slate-300">
                {authMethod === 'phone_otp' ? 'Mobile Phone Number' : 'Email Address'}
              </label>
              <input
                type="text"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-hidden focus:border-indigo-500"
              />
            </div>

            {authMethod !== 'google' && (
              <div className="space-y-2 pt-1">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-medium text-slate-300">One-Time Password (OTP)</label>
                  {!otpSent ? (
                    <button
                      onClick={() => setOtpSent(true)}
                      className="text-indigo-400 hover:underline text-[11px]"
                    >
                      Send OTP
                    </button>
                  ) : (
                    <span className="text-emerald-400 text-[11px]">OTP Sent ✓</span>
                  )}
                </div>
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono tracking-widest text-center focus:outline-hidden focus:border-indigo-500"
                />
              </div>
            )}

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => setStep(1)}
                className="py-3 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs flex items-center justify-center gap-2 transition"
              >
                <span>Confirm & Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Personal Setup */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">Personal Setup</h2>
              <p className="text-xs text-slate-400 mt-1">
                Configure your identity and baseline learning parameters.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-300">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-300">Daily Study Hours</label>
                <select
                  value={dailyHours}
                  onChange={(e) => setDailyHours(Number(e.target.value))}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-indigo-500"
                >
                  <option value={2}>2 hrs / day (Gentle)</option>
                  <option value={4}>4 hrs / day (Steady)</option>
                  <option value={5}>5 hrs / day (Cheetah)</option>
                  <option value={7}>7 hrs / day (Intensive)</option>
                  <option value={16}>16 hrs / day (Tiger Extreme Immersion)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-slate-300">LYRA Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-indigo-500"
                >
                  <option value="Hindi">हिंदी (Hindi)</option>
                  <option value="Hinglish">Hinglish</option>
                  <option value="English">English</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300">Primary Domains</label>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {[
                  'Robotics & AI',
                  'Cybersecurity',
                  'Hardware Systems',
                  'Distributed Systems',
                  'Physical Computing',
                  'Venture Architecture',
                ].map((item) => {
                  const active = selectedInterests.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => {
                        setSelectedInterests((prev) =>
                          active ? prev.filter((i) => i !== item) : [...prev, item]
                        );
                      }}
                      className={`text-[11px] px-3 py-1.5 rounded-full border transition ${
                        active
                          ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => setStep(2)}
                className="py-3 px-4 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-xs flex items-center justify-center gap-2 transition"
              >
                <span>Launch WHO AM I? OS</span>
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
