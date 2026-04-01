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
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    className: `custom-toast custom-toast-${type}`,
  });
};
