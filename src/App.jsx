import { useWrapper } from "./WrapperProvider/lib/useWrapper";

export default function App() {
  const { Component: Wrapper } = useWrapper();

  return <Wrapper></Wrapper>;
}
