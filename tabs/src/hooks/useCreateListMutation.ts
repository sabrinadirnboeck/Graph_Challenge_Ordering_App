import { TeamsFx } from "@microsoft/teamsfx";
import { NONAME } from "dns";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { getGraphClient } from "../bl/GraphFunctions";
import { TeamsFxContext } from "../components/Context";
import { LISTNAME, SITEID } from "../Constants";

export function useCreateListMutation() {
    const { teamsfx } = useContext(TeamsFxContext);
    const queryClient = useQueryClient();
    
    const mutation = useMutation(
        () => createOrderList(teamsfx, ["Sites.Manage.All"]), {
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries(["orderItems", "filteredAndSorted"]);          
        },
        onMutate: () => {
            queryClient.cancelQueries(["orderItems", "filteredAndSorted"]);
        }
    });

    return mutation;
}

async function createOrderList(teamsfx: TeamsFx | undefined, scopes: string[]) {
    if (!teamsfx) {
        throw new Error("TeamsFx not found!");
    }

    const graph = await getGraphClient(teamsfx, scopes);

    const listTemplate = {
        displayName: LISTNAME,
        columns: [
            {
                name: 'MenuSelection',
                choice: {
                    "allowTextEntry": false,
                    "choices": [
                        "Menu 1",
                        "Menu 2"
                    ],
                    "displayAs": "dropDownMenu"
                },
                required: true
            },
            {
                name: 'DateWithTimeslot',
                dateTime: {},
                required: true
            },
            {
                name: 'Planned',
                boolean: {},
                required: true,
                indexed: true
            },
            {
                name: "YearCW",
                number: {},
                required: true,
                decimalPlaces: "none",
                indexed: true
            },
            {
                name: "User",
                text: {},
                required: true,
                indexed: true
            },
            {
                name: "UserDisplayName",
                text: {},
                required: true
            }
        ],
        list: {
            template: 'genericList'
        }
    };

    try {
        await graph.api(`/sites/${SITEID}/lists`).post(listTemplate);
        console.log("created new order list");
    } catch {
        return Promise.reject("Failed to create new list!");
    }
}
