"use client";

import toast from "react-hot-toast";

type AlertType = "success" | "error" | "info" | "warning";

interface AlertProps {
  type: AlertType;
  message: string;
}

export const showAlert = ({ type, message }: AlertProps) => {
  const duration = type === "error" ? 3000 : 2500;

  if (type === "success") {
    toast.success(message, { duration });
    return;
  }

  if (type === "error") {
    toast.error(message, { duration });
    return;
  }

  toast(message, {
    duration,
    icon: type === "warning" ? "!" : "i",
    style:
      type === "warning"
        ? { background: "#fff8ef", color: "#8a5410" }
        : { background: "#f5f9ff", color: "#1f4c93" },
  });
};
