import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "normalize.css";
import "./fonts/fonts.scss";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
