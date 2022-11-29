import { createMicrosoftGraphClient, TeamsFx } from "@microsoft/teamsfx";
import moment from "moment";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { getGraphClient } from "../bl/GraphFunctions";
import { TeamsFxContext } from "../components/Context";
import { LISTNAME, SITEID } from "../Constants";
import { IOrderItem } from "../models/IOrderItem";

export function useSharepointListMutation(orderItem: IOrderItem) {
    const { teamsfx } = useContext(TeamsFxContext);
    const queryClient = useQueryClient();

    const mutation = useMutation(
        () => postItemSharepointList(teamsfx, ["Sites.Read.All", "Sites.ReadWrite.All"], orderItem), {
            onSuccess: () => {
              // Invalidate and refetch
              queryClient.invalidateQueries(["orderItems", "filteredAndSorted"])
            }
        });

    return mutation;
}

async function postItemSharepointList(teamsfx: TeamsFx | undefined, scope: string[], orderItem: IOrderItem){
    if (!teamsfx){
        throw new Error("TeamsFx not found!");
    }

    if (orderItem.Menu == "" || orderItem.DateWithTime == "") {
        return Promise.reject("ERRORVALIDATE");
    }

    try{
        const graph = await getGraphClient(teamsfx, scope);
        const userInfo = await teamsfx.getUserInfo()

        const requestBody = 
        {
            "fields": {
                "Title": moment(),
                "MenuSelection": orderItem.Menu,
                "DateWithTimeslot": orderItem.DateWithTime,
                "Planned": false,
                "YearCW": parseInt(`${orderItem.Year}${orderItem.CalenderWeek}`),
                "User": userInfo.preferredUserName,
                "UserDisplayName": userInfo.displayName
            }
        };
            
        await graph.api(`/sites/${SITEID}/lists/${LISTNAME}/items`).post(requestBody);
    }
    catch {
        return Promise.reject("Failed to create new item!");
    }
}
