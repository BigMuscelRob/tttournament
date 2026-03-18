import React, { InputHTMLAttributes } from 'react';
import './ui.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && <label className="form-label">{label}</label>}
      <input {...props} />
      {error && <span className="text-danger mt-1 text-sm block">{error}</span>}
    </div>
  );
}
