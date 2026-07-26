// app/(auth)/verify-otp/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { OtpInput } from '@/components/auth/OtpInput';
import { useResendTimer } from '@/hooks/useResendTimer';
import { verifyOtpAction, forgotPasswordAction } from '@/actions/court-manager-auth.action';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [email, setEmail] = useState('');
  const { seconds, isActive, resetTimer, formattedTime } = useResendTimer(60);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('resetEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setIsLoading(true);
    setError(undefined);

    const result = await verifyOtpAction({ otp });
    setIsLoading(false);

    if (result.success) {
      toast.success('OTP verified successfully!');
      router.push('/reset-password');
    } else {
      setError(result.message || 'Invalid verification code. Please try again.');
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError('Please enter your email to resend the code.');
      return;
    }

    setIsResending(true);
    setError(undefined);

    const result = await forgotPasswordAction({ email });
    setIsResending(false);

    if (result.success) {
      resetTimer();
      toast.success('New verification code sent!');
      setOtp('');
    } else {
      setError(result.message || 'Unable to resend verification code.');
    }
  };

  return (
    <div className="space-y-8">
      <Link 
        href="/" 
        className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Login
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Verify Code</h1>
        <p className="mt-2 text-slate-500">
          We&apos;ve sent a 6-digit verification code to your email address.
        </p>
        {email && (
          <p className="mt-1 text-sm text-slate-400">
            Sent to: <span className="font-medium text-slate-600">{email}</span>
          </p>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <label className="mb-3 block text-sm font-medium text-slate-700 text-center">
            Enter verification code
          </label>
          <OtpInput 
            value={otp} 
            onChange={setOtp} 
            length={6}
            disabled={isLoading}
          />
          {error && (
            <p className="text-sm text-red-500 mt-3 text-center">{error}</p>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">
            {isActive ? (
              <>Resend available in <span className="font-medium text-slate-700">{formattedTime}</span></>
            ) : (
              <span className="text-slate-400">Ready to resend</span>
            )}
          </span>
          <button
            type="button"
            onClick={handleResend}
            disabled={isActive || isResending}
            className={cn(
              "text-emerald-600 font-medium hover:underline transition-colors",
              (isActive || isResending) && "opacity-50 cursor-not-allowed hover:no-underline"
            )}
          >
            {isResending ? (
              <span className="flex items-center">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Sending...
              </span>
            ) : (
              'Resend Code'
            )}
          </button>
        </div>

        <Button 
          onClick={handleVerify}
          className="w-full h-12 text-base bg-emerald-500 hover:bg-emerald-600"
          disabled={isLoading || otp.length !== 6}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify & Continue'
          )}
        </Button>
      </div>

      <div className="text-center text-sm text-slate-500">
        <p>
          Didn&apos;t receive the code? Check your spam folder or{' '}
          <button
            onClick={handleResend}
            disabled={isActive}
            className="text-emerald-600 hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            try again
          </button>
        </p>
      </div>
    </div>
  );
}