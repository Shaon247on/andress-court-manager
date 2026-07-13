"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { changePasswordAction } from '@/actions/settings.action';
import { toast } from 'sonner';

export default function ChangePassword() {
  const router = useRouter();
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    current_password?: string;
    new_password?: string;
    confirm_password?: string;
  }>({});

  const validatePasswords = () => {
    const newErrors: typeof errors = {};
    
    if (!currentPassword) {
      newErrors.current_password = 'Current password is required';
    }
    
    if (!newPassword) {
      newErrors.new_password = 'New password is required';
    } else if (newPassword.length < 8) {
      newErrors.new_password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(newPassword)) {
      newErrors.new_password = 'Password must contain at least one uppercase letter';
    } else if (!/[a-z]/.test(newPassword)) {
      newErrors.new_password = 'Password must contain at least one lowercase letter';
    } else if (!/[0-9]/.test(newPassword)) {
      newErrors.new_password = 'Password must contain at least one number';
    }
    
    if (!confirmPassword) {
      newErrors.confirm_password = 'Please confirm your password';
    } else if (newPassword && confirmPassword !== newPassword) {
      newErrors.confirm_password = "Passwords don't match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswords()) {
      return;
    }

    setLoading(true);
    const res = await changePasswordAction({
      current_password: currentPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    });

    if (res.success) {
      toast.success(res.data.message);
      setTimeout(() => {
        router.push('/dashboard/settings');
      }, 1500);
    } else {
      toast.error(res.message);
      if (res.message.toLowerCase().includes('current password')) {
        setErrors({ current_password: res.message });
      }
    }
    setLoading(false);
  };

  const passwordMet = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    match: newPassword && confirmPassword && newPassword === confirmPassword,
  };

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 bg-white overflow-y-auto w-full">
      <div className="mb-6 sm:mb-10 flex items-center shrink-0">
        <Link href="/dashboard/settings" className="p-2 border border-slate-200 bg-white mr-4 rounded-lg hover:bg-slate-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Change Password</h1>
          <p className="text-slate-500 mt-1">Update your password to keep your account secure</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 max-w-6xl pb-10 w-full">
        {/* Form Section */}
        <div className="flex-1 border border-slate-200 rounded-2xl p-4 sm:p-6 lg:p-8 bg-white shadow-sm">
          <div className="flex items-center mb-6 sm:mb-8">
            <Shield className="w-5 h-5 text-emerald-500 mr-3" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Password Information</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
              <div className="relative">
                <Input 
                  type={showCurrent ? "text" : "password"} 
                  placeholder="Enter your current password" 
                  className={`h-12 pr-12 ${errors.current_password ? 'border-red-500 focus:ring-red-500' : ''}`}
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    if (errors.current_password) {
                      setErrors({ ...errors, current_password: undefined });
                    }
                  }}
                />
                <button 
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                  onClick={() => setShowCurrent(!showCurrent)}
                >
                  {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.current_password && (
                <p className="text-sm text-red-500 mt-1">{errors.current_password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
              <div className="relative">
                <Input 
                  type={showNew ? "text" : "password"} 
                  placeholder="Enter your new password" 
                  className={`h-12 pr-12 ${errors.new_password ? 'border-red-500 focus:ring-red-500' : ''}`}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (errors.new_password) {
                      setErrors({ ...errors, new_password: undefined });
                    }
                  }}
                />
                <button 
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.new_password && (
                <p className="text-sm text-red-500 mt-1">{errors.new_password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
              <div className="relative">
                <Input 
                  type={showConfirm ? "text" : "password"} 
                  placeholder="Confirm your new password" 
                  className={`h-12 pr-12 ${errors.confirm_password ? 'border-red-500 focus:ring-red-500' : ''}`}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirm_password) {
                      setErrors({ ...errors, confirm_password: undefined });
                    }
                  }}
                />
                <button 
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirm_password && (
                <p className="text-sm text-red-500 mt-1">{errors.confirm_password}</p>
              )}
            </div>

            <div className="bg-slate-50 rounded-xl p-4 sm:p-6 border border-slate-100">
              <div className="text-sm font-semibold text-slate-700 mb-3">Password must contain:</div>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <div className={`w-3 h-3 rounded-full mr-3 ${passwordMet.length ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                  <span className={passwordMet.length ? 'text-slate-700' : 'text-slate-500'}>At least 8 characters</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className={`w-3 h-3 rounded-full mr-3 ${passwordMet.uppercase ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                  <span className={passwordMet.uppercase ? 'text-slate-700' : 'text-slate-500'}>One uppercase letter</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className={`w-3 h-3 rounded-full mr-3 ${passwordMet.lowercase ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                  <span className={passwordMet.lowercase ? 'text-slate-700' : 'text-slate-500'}>One lowercase letter</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className={`w-3 h-3 rounded-full mr-3 ${passwordMet.number ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                  <span className={passwordMet.number ? 'text-slate-700' : 'text-slate-500'}>One number</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className={`w-3 h-3 rounded-full mr-3 ${passwordMet.match ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                  <span className={passwordMet.match ? 'text-slate-700' : 'text-slate-500'}>Passwords match</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-2">
              <Button type="submit" variant="primary" className="h-12 px-8 rounded-lg font-semibold w-full sm:w-auto" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
              <Link href="/dashboard/settings" className="w-full sm:w-auto">
                <Button variant="ghost" className="h-12 px-6 rounded-lg font-semibold border border-slate-200 w-full sm:w-auto">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>

        {/* Security Tips */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="border border-slate-200 rounded-2xl p-6 sm:p-8 bg-slate-50/50">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-6">Security Tips</h3>
            
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-3 mt-2 shrink-0"></div>
                <span className="text-sm text-slate-600 leading-relaxed">Use a unique password that you don&apos;t use for other websites</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-3 mt-2 shrink-0"></div>
                <span className="text-sm text-slate-600 leading-relaxed">Avoid using personal information in your password</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-3 mt-2 shrink-0"></div>
                <span className="text-sm text-slate-600 leading-relaxed">Consider using a password manager to generate and store strong passwords</span>
              </li>
              <li className="flex items-start">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-3 mt-2 shrink-0"></div>
                <span className="text-sm text-slate-600 leading-relaxed">Change your password regularly, especially if you suspect unauthorized access</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}