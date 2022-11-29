import { useMutation, useQueryClient } from "react-query";

export function useInvalidateListTabClick() {
    const queryClient = useQueryClient();

    const mutation = useMutation(
        () => queryClient.invalidateQueries(["orderItems", "filteredAndSorted"]));

    return mutation;
}