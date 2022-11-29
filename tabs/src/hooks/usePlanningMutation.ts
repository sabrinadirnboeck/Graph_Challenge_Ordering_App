import { createMicrosoftGraphClient, TeamsFx } from "@microsoft/teamsfx";
import moment from "moment";
import { useContext } from "react";
import { useMutation } from "react-query";
import { getDateStringWithAddedHour } from "../bl/DateFunctions";
import { getGraphClient } from "../bl/GraphFunctions";
import { getListItems } from "../bl/SharepointListFunctions";
import { TeamsFxContext } from "../components/Context";
import { LISTNAME, SITEID } from "../Constants";
import { IOrderItem } from "../models/IOrderItem";

export function usePlanningMutation(orderItem: IOrderItem) {
    const { teamsfx }  = useContext(TeamsFxContext);

    const mutation = useMutation(
        () => postPlanItems(teamsfx, ["Calendars.ReadWrite"], orderItem));

    return mutation;
}

async function postPlanItems(teamsfx: TeamsFx | undefined, scope: string[], orderItem: IOrderItem){
    if (!teamsfx) {
        throw new Error("TeamsFx not found!");
    }

    const graph = await getGraphClient(teamsfx, scope);
    let listItemValues = await getListItems(teamsfx, ["Sites.Read.All", "Sites.ReadWrite.All"], orderItem.CalenderWeek, orderItem.Year, true)

    const listItems = listItemValues.map(valueItem => {
        const fields = valueItem.fields;
        return fields;
    });

    if (listItems.length == 0){
        return;
    }

    const today = new Date();
    let currentUTC = "";

    if (moment(today).isDST()){
        currentUTC = "UTC+02";
    }
    else
    {
        currentUTC = "UTC+01";
    }

    listItems.map(async (listItem, index) =>  {
        const dateTimeAddedHour = getDateStringWithAddedHour(listItem.DateWithTimeslot);       

        const requestBody = 
        {
            "subject": listItem.MenuSelection,
            "reminderMinutesBeforeStart": 15,
            "isReminderOn": true,
            "start": {
                "dateTime": listItem.DateWithTimeslot,
                "timeZone": currentUTC
            },
            "end": {
                "dateTime": dateTimeAddedHour,
                "timeZone": currentUTC
            }
        }; 

        const patchRequestBody =     
        {
            "Planned": true,
        };

        try {
            await graph.api("/me/events").post(requestBody);
            console.log("successfully posted event");

            await graph.api(`/sites/${SITEID}/lists/${LISTNAME}/items/${listItemValues[index].id}/fields`).patch(patchRequestBody);
            console.log("sucessfully patched item");
        } catch {
            return Promise.reject("Could not post new event!");
        }
    });
}