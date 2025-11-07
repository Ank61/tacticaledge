"use client";

import { CenterCard } from "@/components/Layout";
import { PrimaryButton, TextField } from "@/components/ui/FormField";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  function validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
      .then(() => router.push("/movies"))
      .catch((e) => {
        try {
          const parsed = JSON.parse(e.message);
          if (parsed.message) {
            setErrors({ general: parsed.message });
          } else {
            setErrors({ general: e.message });
          }
        } catch {
          setErrors({ general: e.message || "Invalid credentials" });
        }
      });
  }

  return (
    <CenterCard title="Sign in">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <TextField
          label="Email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors({ ...errors, email: undefined });
          }}
          error={errors.email}
        />
        <TextField
          label="Password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors({ ...errors, password: undefined });
          }}
          error={errors.password}
        />
        {errors.general ? (
          <div className="text-[color:var(--color-error)] text-sm">
            {errors.general}
          </div>
        ) : null}
        <PrimaryButton type="submit" className="w-full">
          Login
        </PrimaryButton>
        <p className="text-center text-sm text-white/80">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="underline">
            Sign up
          </Link>
        </p>
      </form>
    </CenterCard>
  );
}
