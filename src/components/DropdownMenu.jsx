const DropdownMenu = ({ children = [], className, ...rest }) => {
  return (
    <ul
      className={["dropdown-menu d-block overflow-y-scroll", className]
        .filter(Boolean)
        .join(" ")}
      style={{ maxHeight: 200 }}
      {...rest}
    >
      {children.map((child, i) => (
        <li key={i}>{child}</li>
      ))}
    </ul>
  );
};

export default DropdownMenu;
