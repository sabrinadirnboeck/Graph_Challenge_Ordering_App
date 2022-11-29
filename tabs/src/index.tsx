import { initializeIcons } from "@fluentui/react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "./index.css";

initializeIcons();
ReactDOM.render(<App />, document.getElementById("root"));
