"use client";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit";
}

const Button = ({ text, onClick, type = "button" }: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className="w-full bg-amber-900 text-amber-50 py-4 rounded-xl font-medium tracking-wide shadow-xl hover:bg-black transition-all active:scale-95 hover:shadow-amber-900/20"
    >
      {text}
    </button>
  );
};

export default Button;