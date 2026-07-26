// app/(auth)/page.tsx

"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { courtManagerLoginAction } from '@/actions/court-manager-auth.action';
import { courtManagerLoginSchema, CourtManagerLoginFormValues } from '@/schemas/CourtManagerAuth.schema';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourtManagerLoginFormValues>({
    resolver: zodResolver(courtManagerLoginSchema),
  });

  const onSubmit = async (values: CourtManagerLoginFormValues) => {
    setIsLoading(true);
    setError(undefined);

    try {
      const result = await courtManagerLoginAction(values);
      setIsLoading(false);

      if (result.success) {
        toast.success('Login successful!');
        
        // Redirect to the appropriate dashboard route
        const redirectTo = result.data?.redirectTo || '/dashboard';
        console.log('Redirecting to:', redirectTo);
        router.push(redirectTo);
        return;
      }

      setError(result.message || 'Unable to sign in.');
    } catch (error) {
      setIsLoading(false);
      setError('An unexpected error occurred.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Court Manager</h1>
        <p className="mt-2 text-slate-500">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
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
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pr-10"
                {...register('password')}
                data-invalid={!!errors.password}
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end">
          <Link href="/forgot-password" className="font-medium text-emerald-600 hover:text-emerald-700 text-sm">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full h-12 text-base bg-emerald-500 hover:bg-emerald-600" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-slate-500">
        <p>Login issues? <a href="#" className="text-emerald-600 hover:underline">Visit our Help Article</a></p>
        <p className="mt-2">
          Want to list your club on <strong className="text-slate-800">AthlonGO</strong>?{' '}
          <Link href="/register" className="text-emerald-600 hover:underline">Get started</Link>
        </p>
      </div>
    </div>
  );
}