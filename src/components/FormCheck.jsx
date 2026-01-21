import { useId } from "react";

export default function FormCheck({
  type = "checkbox",
  className,
  children,
  inline,
  ...rest
}) {
  const id = useId();

  return (
    <div
      className={["form-check", inline && "form-check-inline"]
        .filter(Boolean)
        .join(" ")}
    >
      <input
        {...rest}
        className={["form-check-input", className].filter(Boolean).join(" ")}
        type={type}
        id={id}
      />
      <label className="form-check-label" htmlFor={id}>
        {children}
      </label>
    </div>
  );
}
