// src/app/components/Button.js
export default function Button({
  type = "button",
  onClick,
  children,
  className,
}) {
  const baseStyles = "text-white px-4 py-2 rounded";
  const combinedClassName = `${baseStyles} ${className || ""}`;

  return (
    <button type={type} onClick={onClick} className={combinedClassName}>
      {children}
    </button>
  );
}
