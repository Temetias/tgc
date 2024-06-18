import { PropsWithChildren } from "react";
import "./Layout.css";

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="Layout">
      <div className="Layout-children">{children}</div>
    </div>
  );
};
