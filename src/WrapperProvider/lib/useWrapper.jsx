import { useContext } from "react";

import { WrapperContext } from "./WrapperContext";

export const useWrapper = () => useContext(WrapperContext);
