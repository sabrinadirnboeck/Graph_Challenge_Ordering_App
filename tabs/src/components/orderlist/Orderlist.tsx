import { GroupedList } from "./GroupedList";
import { ListCreationPanel } from "./ListCreationPanel";
import { useCheckIfListExists } from "../../hooks/useCheckIfListExists";

export function Orderlist(props: { currentWeek: number, year: number }) {
    const checkQuery = useCheckIfListExists();

    return (
        <div>
            <GroupedList currentWeek={props.currentWeek} year={props.year} />

            {checkQuery.isError && (
                <ListCreationPanel />
            )}
        </div>
    );
}