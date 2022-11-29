import { TeamsFx } from "@microsoft/teamsfx";
import { firstBy } from "thenby";
import { LISTNAME, SITEID } from "../Constants";
import { getDateFromDateString, getDateKeyString } from "./DateFunctions";
import { getGraphClient } from "./GraphFunctions";

export async function getListItems(teamsfx: TeamsFx | undefined, scope: string[], calenderWeek: number, year: number, includeUserAndPlannedFilter?: boolean) {

    if (!teamsfx) {
        throw new Error("TeamsFx not found!");
    }

    let userFilter = "";
    const emailUser = (await teamsfx.getUserInfo()).preferredUserName;
    if (includeUserAndPlannedFilter) {
        userFilter = ` and fields/User eq '${emailUser}' and fields/Planned eq false`;
    }

    try {
        const graph = await getGraphClient(teamsfx, scope);
        const listItems = await graph.api(`/sites/${SITEID}/lists/${LISTNAME}/items?$select=id&expand=fields(select=MenuSelection,DateWithTimeslot,Planned,YearCW,User,UserDisplayName)&$filter=fields/YearCW eq ${year}${calenderWeek}${userFilter}`)
            .get();

        const listItemValue: any[] = listItems.value;
        const items: any[] = [];

        listItemValue.map(valueItem => {
            const fields = valueItem.fields;
            items.push({
                id: valueItem.id,
                User: fields.User,
                UserDisplayName: fields.UserDisplayName,
                MenuSelection: fields.MenuSelection,
                DateWithTimeslot: fields.DateWithTimeslot
            });
        });

        if (includeUserAndPlannedFilter) {
            return new Promise<any[]>((resolve) => {
                resolve(listItemValue);
            });
        }

        items.sort(
            firstBy(function (a: any, b: any) {
                const dateA = `${a.DateWithTimeslot}`;
                const dateB = `${b.DateWithTimeslot}`;

                return getDateFromDateString(dateA) < getDateFromDateString(dateB) ? -1 : 1;
            })
        );

        return new Promise<any[]>((resolve) => {
            resolve(items.map((currentValue, index) => ({
                key: getKeyPrefix(currentValue, index),
                name: currentValue.UserDisplayName,
                menu: currentValue.MenuSelection,
                timeslot: currentValue.DateWithTimeslot.split('T')[1].replace(':00Z', ''),
                id: currentValue.id,
                user: currentValue.User
            }
            )));
        });
    }
    catch (error) {

        if (error == "Error: The specified list was not found") {
            return Promise.reject("LISTNOTFOUND");
        }

        return Promise.reject("Failed to load list!");
    }

}

function getKeyPrefix(currentValue: any | undefined, index: number) {
    const keyString = getDateKeyString(currentValue.DateWithTimeslot);

    return `${keyString}_${index}`;
}