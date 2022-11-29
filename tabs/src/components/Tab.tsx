import { useContext } from "react";
import { Welcome } from "./welcome/Welcome";
import { TeamsFxContext } from "./Context";

export default function Tab() {
  const { themeString } = useContext(TeamsFxContext);
  return (
    <div className={themeString === "default" ? "" : "dark"}>
      <Welcome />
    </div>
  );
}
