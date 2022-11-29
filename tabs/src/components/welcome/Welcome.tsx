import { useContext, useState } from "react";
import { Button, Menu } from "@fluentui/react-northstar";
import "./Welcome.css";
import { TeamsFxContext } from "../Context";
import { getCurrentCalenderWeek, getCurrentYear } from "../../bl/DateFunctions";
import { Input } from "../input/Input";
import { Orderlist } from "../orderlist/Orderlist";
import { useInvalidateListTabClick } from "../../hooks/useInvalidateListTabClick";
import { Providers, ProviderState } from "@microsoft/mgt-element";
import { useData } from "@microsoft/teamsfx-react";
import { TeamsFxProvider } from "@microsoft/mgt-teamsfx-provider";

const scopes = [
  "User.Read",
  "Calendars.ReadWrite",
  "Sites.Read.All",
  "Sites.ReadWrite.All",
  "Sites.Manage.All"
]

export function Welcome() {
  const currentCalenderWeek = getCurrentCalenderWeek();

  const steps = ["cw0", "cw1", "cw2"];
  const friendlyStepsName: { [key: string]: string } = {
    cw0: `CW${currentCalenderWeek}`,
    cw1: `CW${currentCalenderWeek + 1}`,
    cw2: `CW${currentCalenderWeek + 2}`
  };
  const [selectedMenuItem, setSelectedMenuItem] = useState("cw0");
  const items = steps.map((step) => {
    return {
      key: step,
      content: friendlyStepsName[step] || "",
      onClick: () => setSelectedMenuItem(step),
    };
  });

  const invalidateMutation = useInvalidateListTabClick();

  const [showLogin, setShowLogin] = useState(false);
  const { teamsfx } = useContext(TeamsFxContext);

  if (!teamsfx) {
    throw new Error("TeamsFx not found!");
  }

  const { reload } = useData(
    async () => {

      const provider = new TeamsFxProvider(teamsfx, scopes);
      Providers.globalProvider = provider;
      let consentNeeded = false;
      try {
        await teamsfx.getCredential().getToken(scopes);
      } catch (error) {
        consentNeeded = true;
      }

      setShowLogin(consentNeeded);
      Providers.globalProvider.setState(consentNeeded ? ProviderState.SignedOut : ProviderState.SignedIn);
    }
  );

  const handleloginClick = async () => {
    try {
      if (!teamsfx) {
        throw new Error("TeamsFx not found! ");
      }

      await teamsfx.login(scopes);
      Providers.globalProvider.setState(ProviderState.SignedIn);
      setShowLogin(true);
      reload();
    } catch (err: any) {
      if (err.message?.includes("CancelledByUser")) {
        console.error("Login failed - cancelled by user.");
      }

      console.error("Login failed.");
      return;
    }
  }

  if (!showLogin) {
    return (
      <div className="welcome page">
        <div className="narrow page-padding">
          <h1 className="center">Place an order!</h1>
          <Menu defaultActiveIndex={1} items={items} underlined secondary onClickCapture={() => invalidateMutation.mutate()} />
          <div className="sections">
            {selectedMenuItem === "cw0" && (
              <div>
                <Input currentWeek={currentCalenderWeek} year={getCurrentYear()} />
                <Orderlist currentWeek={currentCalenderWeek} year={getCurrentYear()} />
              </div>
            )}
            {selectedMenuItem === "cw1" && (
              <div>
                <Input currentWeek={currentCalenderWeek + 1} year={getCurrentYear(1)} />
                <Orderlist currentWeek={currentCalenderWeek + 1} year={getCurrentYear(1)} />
              </div>
            )}
            {selectedMenuItem === "cw2" && (
              <div>
                <Input currentWeek={currentCalenderWeek + 2} year={getCurrentYear(2)} />
                <Orderlist currentWeek={currentCalenderWeek + 2} year={getCurrentYear(2)} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  else {
    return (
      <div className="welcome page">
        <div className="narrow page-padding">
          <div className="center">
            <h2>Welcome to Ordering App!</h2>
            <Button primary onClick={() => handleloginClick()}>Login</Button>
          </div>
        </div>
      </div>
    )
  }
}