import { useWrapper } from "./WrapperProvider/lib/useWrapper";

// helpful links
// https://getbootstrap.com/docs/5.3/components/navbar/#brand
// https://chakra-ui.com/docs/get-started/frameworks/vite#setup-provider
// https://chakra-ui.com/docs/get-started/frameworks/vite#setup-provider
// https://www.google.com/search?q=react+dot+notation+components&oq=react+dot+notation+components&gs_lcrp=EgRlZGdlKgYIABBFGDkyBggAEEUYOTIKCAEQABiiBBiJBTIKCAIQABiiBBiJBTIHCAMQABjvBTIGCAQQRRhAMgYIBRBFGEAyBggGEEUYQNIBCDQ0MjdqMGoxqAIAsAIA&sourceid=chrome&ie=UTF-8
// https://react-bootstrap.netlify.app/docs/components/accordion/
// https://github.com/react-bootstrap/react-bootstrap/blob/master/src/Accordion.tsx
// https://github.com/chancellor-whitaker/resources-template/blob/master/src/remote/createRemoteModuleProvider.jsx
// https://github.com/Paciolan/remote-module-loader
// https://github.com/Paciolan/remote-component?tab=readme-ov-file#react-hooks
// https://react-docgen.dev/docs/getting-started/cli
// https://stackblitz.com/edit/vitejs-vite-myxwzz?file=src%2FApp.jsx&terminal=dev

// need to document how to add wrapper to project
// add WrapperProvider folder
// add WrapperProvider to main
// modify constants in WrapperProvider folder
// pull wrapper component from useWrapper

// need to document how to append to remote wrapper component

export default function App() {
  const { Component: Wrapper } = useWrapper();

  return <Wrapper></Wrapper>;
}
