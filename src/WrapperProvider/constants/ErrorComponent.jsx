export const ErrorComponent = ({ children: err }) => {
  return <div>Unknown Error: {err.toString()}</div>;
};
