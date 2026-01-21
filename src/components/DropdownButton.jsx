const DropdownButton = ({
  variant = "secondary",
  type = "button",
  as = "button",
  className,
  children,
  ...rest
}) => {
  const As = as;

  return (
    <As
      className={[`btn btn-${variant} dropdown-toggle`, className]
        .filter(Boolean)
        .join(" ")}
      type={type}
      {...rest}
    >
      {children}
    </As>
  );
};

export default DropdownButton;
