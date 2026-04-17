interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const Button = ({
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) => {
  const baseClasses =
    "hover:bg-green-80 h-16 w-full rounded-2xl bg-green-100 px-4 py-2 text-center text-nowrap text-lg font-bold text-white";

  return (
    <button
      className={`${baseClasses} ${className} ${disabled ? "cursor-not-allowed opacity-70" : ""}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
