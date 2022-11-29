import { IObjectWithKey } from "@fluentui/react";
import { TeamsFx } from "@microsoft/teamsfx";
import { useContext } from "react";
import { useMutation, useQueryClient } from "react-query";
import { getGraphClient } from "../bl/GraphFunctions";
import { TeamsFxContext } from "../components/Context";
import { LISTNAME, SITEID } from "../Constants";

export function useDeleteSelectionMutation(selectedItems: IObjectWithKey[] | undefined) {
    const { teamsfx } = useContext(TeamsFxContext);
    const queryClient = useQueryClient();

    const mutation = useMutation(
        () => deleteSelection(teamsfx, ["Sites.ReadWrite.All"], selectedItems), {
            onSuccess: () => {
              // Invalidate and refetch
              setTimeout(() => {
                queryClient.invalidateQueries(["orderItems", "filteredAndSorted"]);
              }, 1000)
            }
        });

    return mutation;
}

async function deleteSelection(teamsfx: TeamsFx | undefined, scopes: string[], selectedItems: IObjectWithKey[] | undefined) {
    if (!teamsfx) {
        throw new Error("TeamsFx not found!");
    }

    if (!selectedItems)
    {
        return Promise.reject("NOSELECTION");
    }

    try {
        const graph = await getGraphClient(teamsfx, scopes);
        const userInfo = await teamsfx.getUserInfo()
        const items = selectedItems as any[];

        items.map(async x => {
            if (userInfo.preferredUserName == x.user)
            {
                await graph.api(`/sites/${SITEID}/lists/${LISTNAME}/items/${x.id}`).delete();
            }
        });
    }
    catch {
        return Promise.reject("Could not delete selected items!");
    }
}