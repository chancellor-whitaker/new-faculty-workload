import {
  createUseRemoteComponent,
  createRequires,
} from "@paciolan/remote-component";

import { resolve } from "../constants/resolve";

export const useRemoteComponent = createUseRemoteComponent({
  requires: createRequires(resolve),
});
