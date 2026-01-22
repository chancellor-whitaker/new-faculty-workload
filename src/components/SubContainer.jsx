const SubContainer = ({
  defaultClassName = "my-3 p-3 bg-body rounded shadow-sm",
  as = "div",
  className,
  ...rest
}) => {
  const As = as;
  return (
    <As
      className={[defaultClassName, className].filter(Boolean).join(" ")}
      {...rest}
    ></As>
  );
};

export default SubContainer;
