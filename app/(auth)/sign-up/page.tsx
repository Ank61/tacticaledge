"use client";

import { CenterCard } from "@/components/Layout";
import { PrimaryButton, TextField } from "@/components/ui/FormField";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    name?: string;
    general?: string;
  }>({});

  function validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    api("/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, password, name }),
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
          setErrors({ general: e.message || "An error occurred" });
        }
      });
  }

  return (
    <CenterCard title="Sign up">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <TextField
          label="Name"
          placeholder="Your name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors({ ...errors, name: undefined });
          }}
          error={errors.name}
        />
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
          Create account
        </PrimaryButton>
        <p className="text-center text-sm text-white/80">
          Already have an account?{" "}
          <Link href="/sign-in" className="underline">
            Sign in
          </Link>
        </p>
      </form>
    </CenterCard>
  );
}
