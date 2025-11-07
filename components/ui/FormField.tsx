"use client";

import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function TextField({ label, error, className, ...props }: InputProps) {
  return (
    <label className="block w-full">
      <span className="mb-2 block text-white text-sm">{label}</span>
      <input
        className={`input ${
          error ? "border-2 border-[color:var(--color-error)]" : ""
        } ${className ?? ""}`}
        {...props}
      />
      {error ? (
        <span className="mt-1 block text-sm text-[color:var(--color-error)]">
          {error}
        </span>
      ) : null}
    </label>
  );
}

type FileFieldProps = {
  label: string;
  onFileSelected: (file: File) => void;
  accept?: string;
  error?: string;
};

export function FileField({
  label,
  onFileSelected,
  accept,
  error,
}: FileFieldProps) {
  return (
    <div className="w-full">
      <span className="mb-2 block text-white text-sm">{label}</span>
      <input
        type="file"
        id="file-input"
        accept={accept}
        onChange={(e) => {
          const file = e.currentTarget.files?.[0];
          if (file) onFileSelected(file);
        }}
        className="file:mr-4 file:rounded-md file:border-0 file:bg-[color:var(--color-primary)] file:px-4 file:py-2 file:text-[#093545] file:font-medium text-white/70"
      />
      {error ? (
        <span className="mt-1 block text-sm text-[color:var(--color-error)]">
          {error}
        </span>
      ) : null}
    </div>
  );
}

export function PrimaryButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  const { className, ...rest } = props;
  return <button className={`btn-primary ${className ?? ""}`} {...rest} />;
}
