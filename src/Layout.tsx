import React, { PropsWithChildren } from "react";
import { useStoreDispatch } from "./store/Core";
import logo from "./logos/PST_Wicked.png";
import "./Layout.css";
import { Link, useParams } from "react-router-dom";

export const Layout = ({
  children,
  hideDataset,
}: PropsWithChildren<{ hideDataset?: boolean }>) => {
  return (
    <div className="Layout">
      <div className="Layout-children">{children}</div>
    </div>
  );
};
