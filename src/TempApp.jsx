import { useEffect, useState } from "react";

// import { RemoteComponent } from "./components/RemoteComponent";
import loadRemoteModule from "./lib/loadRemoteModule";

// const Dropdown = ({ url = "http://localhost:4173/dropdown.cjs", ...props }) => (
//   <RemoteComponent url={url} {...props}></RemoteComponent>
// );

const usePromise = (promise) => {
  const [state, setState] = useState(null);

  useEffect(() => {
    if (promise) {
      let ignore = false;

      promise.then((response) => !ignore && setState(response));

      return () => {
        ignore = true;
      };
    }
  }, [promise]);

  return state;
};

const promise = loadRemoteModule("http://localhost:4173/dropdown.cjs");

export default function App() {
  const module = usePromise(promise);

  return module ? <App1 module={module}></App1> : null;
}

function App1({ module }) {
  const [selected, setSelected] = useState([]);

  const Dropdown = module.default;

  console.log(module);

  return (
    <>
      Hello
      <Dropdown
        options={[
          "Kentucky",
          "West Virginia",
          "Virginia",
          "Tennessee",
          "Ohio",
          "Indiana",
        ]}
        url="http://localhost:4173/dropdown.cjs"
        styledJsxAccessor={(str) => str}
        // onClick={(e) => console.log(e)}
        variant={"outline-primary"}
        onChange={setSelected}
        selected={selected}
        singleSelect={true}
        className="font-xl"
        allOption={true}
        searchBox={true}
        title="States"
      >
        <Dropdown.Button>This seems to be working!</Dropdown.Button>
      </Dropdown>
    </>
  );
}
