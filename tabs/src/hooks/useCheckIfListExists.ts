import { TeamsFx } from "@microsoft/teamsfx";
import { useContext } from "react";
import { useQuery } from "react-query";
import { getGraphClient } from "../bl/GraphFunctions";
import { TeamsFxContext } from "../components/Context";
import { LISTNAME, SITEID } from "../Constants";

export function useCheckIfListExists() {
    const { teamsfx } = useContext(TeamsFxContext);

    const query = useQuery(["checkForList"], () => checkForList(teamsfx, ["Sites.Read.All", "Sites.ReadWrite.All"]));

    return query;
}

async function checkForList(teamsfx: TeamsFx | undefined, scopes: string[]) {
    if (!teamsfx) {
        throw new Error("TeamsFx not found!");
    }

    const graph = await getGraphClient(teamsfx, scopes);

    try {
        await graph.api(`/sites/${SITEID}/lists/${LISTNAME}`).get();
        return Promise.resolve();
    }
    catch (error) {
        return Promise.reject("LISTNOTFOUND");
    }
}