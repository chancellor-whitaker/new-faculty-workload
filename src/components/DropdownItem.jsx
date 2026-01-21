const DropdownItem = ({
  type = "button",
  as = "button",
  className,
  children,
  active,
  ...rest
}) => {
  const As = as;

  return (
    <As
      className={["dropdown-item", active && "active", className]
        .filter(Boolean)
        .join(" ")}
      type={type}
      {...rest}
    >
      {children}
    </As>
  );
};

export default DropdownItem;
