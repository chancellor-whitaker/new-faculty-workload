/**
 * src/lib/loadRemoteModule.js
 */

import createLoadRemoteModule, {
  createRequires,
} from "@paciolan/remote-module-loader";
// import * as ReactDOM from "react-dom";
import * as React from "react";

const requires = createRequires({
  //   "react-dom": ReactDOM,
  react: React,
});

export default createLoadRemoteModule({ requires });
