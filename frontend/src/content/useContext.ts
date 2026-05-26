import * as React from "react";
import { ContentContext } from "./ContentContext";

export function useContent() {
  const context = React.useContext(ContentContext);

  if (!context) {
    throw new Error("useContent must be used within ContentProvider");
  }

  return context;
}
