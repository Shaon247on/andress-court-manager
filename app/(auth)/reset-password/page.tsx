// app/(auth)/reset-password/page.tsx

"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { resetPasswordAction } from '@/actions/court-manager-auth.action';
import { resetPasswordSchema, ResetPasswordFormValues } from '@/schemas/auth.schema';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const newPassword = watch('new_password');

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setIsLoading(true);
    setError(undefined);

    const result = await resetPasswordAction(values);
    setIsLoading(false);

    if (result.success) {
      toast.success('Password reset successfully! Please log in with your new password.');
      router.push('/');
    } else {
      setError(result.message || 'Unable to reset password. Please try again.');
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
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Set New Password</h1>
        <p className="mt-2 text-slate-500">
          Please create a new password for your account.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="new_password">
              New Password
            </label>
            <div className="relative">
              <Input
                id="new_password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                className="pr-10"
                {...register('new_password')}
                data-invalid={!!errors.new_password}
                aria-invalid={!!errors.new_password}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.new_password && (
              <p className="text-sm text-red-500 mt-1">{errors.new_password.message}</p>
            )}
            <p className="text-xs text-slate-400 mt-2">
              Password must be at least 8 characters long.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="confirm_password">
              Confirm Password
            </label>
            <div className="relative">
              <Input
                id="confirm_password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className="pr-10"
                {...register('confirm_password')}
                data-invalid={!!errors.confirm_password}
                aria-invalid={!!errors.confirm_password}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirm_password && (
              <p className="text-sm text-red-500 mt-1">{errors.confirm_password.message}</p>
            )}
          </div>

          {newPassword && newPassword.length > 0 && (
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full transition-all duration-300 rounded-full",
                      newPassword.length < 8 ? "w-1/3 bg-red-500" :
                      newPassword.length < 12 ? "w-2/3 bg-yellow-500" :
                      "w-full bg-emerald-500"
                    )}
                  />
                </div>
                <span className={cn(
                  "text-xs font-medium",
                  newPassword.length < 8 ? "text-red-500" :
                  newPassword.length < 12 ? "text-yellow-600" :
                  "text-emerald-600"
                )}>
                  {newPassword.length < 8 ? "Weak" :
                   newPassword.length < 12 ? "Medium" :
                   "Strong"}
                </span>
              </div>
            </div>
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
              Resetting Password...
            </>
          ) : (
            'Reset Password'
          )}
        </Button>
      </form>

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