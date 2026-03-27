"use client";
import React, { ChangeEvent, useState, forwardRef } from "react";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, placeholder, type = "text", error, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    const Icon = type === "email" ? Mail : isPassword ? Lock : type === "text" && label.toLowerCase().includes("name") ? User : null;

    return (
      <div className="group flex flex-col w-full">
        <label className={`text-[10px] uppercase font-black mb-1 tracking-widest transition-colors ${error ? 'text-red-500' : 'text-orange-900/40 group-focus-within:text-orange-700'}`}>
          {label}
        </label>

        <div className="relative flex items-center">
          {Icon && (
            <div className={`absolute left-3 transition-colors ${error ? 'text-red-400' : 'text-stone-400 group-focus-within:text-orange-600'}`}>
              <Icon size={18} strokeWidth={2} />
            </div>
          )}

          <input
            {...props}
            ref={ref}
            type={inputType}
            placeholder={placeholder}
            className={`w-full bg-stone-100/50 border-b-2 p-3 outline-none transition-all focus:bg-white text-stone-800 rounded-t-md
              ${error ? 'border-red-500' : 'border-stone-200 focus:border-orange-600'}
              ${Icon ? "pl-10" : "pl-3"} ${isPassword ? "pr-10" : "pr-3"}`}
          />

          {isPassword && (
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-stone-400 hover:text-stone-600">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && <p className="text-[10px] text-red-500 mt-1 font-bold italic tracking-wide">{error}</p>}
      </div>
    );
  }
);

InputField.displayName = "InputField";
export default InputField;