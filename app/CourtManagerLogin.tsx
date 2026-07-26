"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { courtManagerLoginAction } from '@/actions/court-manager-auth.action';
import { courtManagerLoginSchema, CourtManagerLoginFormValues } from '@/schemas/CourtManagerAuth.schema';

export default function CourtManagerLogin() {
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

    const result = await courtManagerLoginAction(values);
    setIsLoading(false);

    if (result.success) {
      router.push('/dashboard');
      return;
    }

    setError(result.message || 'Unable to sign in.');
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Form Section */}
      <div className="flex w-full xl:w-[50%] items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-sm space-y-8">
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
              <a href="#" className="font-medium text-primary hover:text-primary-hover text-sm">
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full h-12 text-base" disabled={isLoading}>
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
            <p>Login issues? <a href="#" className="text-primary hover:underline">Visit our Help Article</a></p>
            <p className="mt-2">
              Want to list your club on <strong className="text-slate-800">AthlonGO</strong>? <Link href="/register" className="text-primary hover:underline">Get started</Link>
            </p>
          </div>
        </div>
      </div>
    
      {/* Right Image Section */}
      <div className="hidden xl:block xl:w-[50%] relative bg-slate-900">
        <Image
          src="/assets/login_image.png"
          alt="Court view"
          fill
          className="object-cover opacity-80"
          priority
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
}