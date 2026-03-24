"use client";

import { toast, TypeOptions } from "react-toastify";

type AlertType = "success" | "error" | "info" | "warning";

interface AlertProps {
  type: AlertType;
  message: string;
}

export const showAlert = ({ type, message }: AlertProps) => {
  const toastType: TypeOptions = type as TypeOptions;

  toast(message, {
    type: toastType,
    position: "top-right",
    autoClose: 3000,
    // Use className to target the outer wrapper
    className: `custom-toast custom-toast-${type}`,
    // If bodyClassName still errors, we target it via CSS selectors in globals.css
    // to ensure 100% TypeScript compatibility.
  });
};