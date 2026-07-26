"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { forgotPasswordAction } from '@/actions/court-manager-auth.action';
import { forgotPasswordSchema, ForgotPasswordFormValues } from '@/schemas/auth.schema';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true);
    setError(undefined);

    const result = await forgotPasswordAction(values);
    setIsLoading(false);

    if (result.success) {
      setSuccess(true);
      // Store email for OTP page
      sessionStorage.setItem('resetEmail', values.email);
      setTimeout(() => {
        router.push('/verify-otp');
      }, 1500);
    } else {
      setError(result.message || 'Unable to send reset link.');
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
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Reset Password</h1>
        <p className="mt-2 text-slate-500">
          Enter your email address and we&apos;ll send you a verification code to reset your password.
        </p>
      </div>

      {success ? (
        <div className="rounded-lg bg-emerald-50 p-4 text-sm text-emerald-600 border border-emerald-200">
          <p className="font-medium">Check your email</p>
          <p className="mt-1">We&apos;ve sent a verification code to your email address.</p>
          <p className="mt-2 text-xs text-emerald-500">Redirecting to verification...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="email">
              Email address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register('email')}
              data-invalid={!!errors.email}
              aria-invalid={!!errors.email}
              className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
              {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full h-12 text-base bg-emerald-500 hover:bg-emerald-600" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Verification Code'
            )}
          </Button>
        </form>
      )}

      <div className="text-center text-sm text-slate-500">
        <p>
          Remember your password?{' '}
          <Link href="/" className="text-emerald-600 hover:underline font-medium">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}