import { LoadingComponent } from "./constants/LoadingComponent";
import { useRemoteComponent } from "./lib/useRemoteComponent";
import { ErrorComponent } from "./constants/ErrorComponent";
import { WrapperContext } from "./lib/WrapperContext";
import { url } from "./constants/url";

export const WrapperProvider = ({ children }) => {
  const [loading, err, Component] = useRemoteComponent(url);

  if (loading) return <LoadingComponent></LoadingComponent>;

  if (err != null) return <ErrorComponent>{err}</ErrorComponent>;

  return <WrapperContext value={{ Component }}>{children}</WrapperContext>;
};
