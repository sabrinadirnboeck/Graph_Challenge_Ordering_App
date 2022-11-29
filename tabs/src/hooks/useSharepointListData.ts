import { useContext } from "react";
import { useQuery } from "react-query";
import { getListItems } from "../bl/SharepointListFunctions";
import { TeamsFxContext } from "../components/Context";

export function useSharepointListData(calenderWeek: number, year: number) {
    const { teamsfx } = useContext(TeamsFxContext);

    const query = useQuery(["orderItems", "filteredAndSorted"], () => getListItems(teamsfx, ["Sites.ReadWrite.All"], calenderWeek, year));

    return query;
}