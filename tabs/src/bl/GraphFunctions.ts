import { createMicrosoftGraphClient, TeamsFx } from "@microsoft/teamsfx";

export async function getGraphClient(teamsfx: TeamsFx, scope: string[]) {
    const graph = createMicrosoftGraphClient(teamsfx, scope);
    return graph;
}