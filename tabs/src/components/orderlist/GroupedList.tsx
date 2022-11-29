import "./GroupedList.css";
import {
  DetailsList,
  IGroup,
  IObjectWithKey,
  Selection,
  SelectionMode,
  Spinner
} from '@fluentui/react';
import { useState } from 'react';
import { getDatesMondayToFridayCalenderWeek } from '../../bl/DateFunctions';
import { useSharepointListData } from '../../hooks/useSharepointListData';
import { DeletionPanel } from './DeletionPanel';

export interface IDetailsListGroupedExampleItem {
  key: string;
  name: string;
  color: string;
}

export interface IDetailsListGroupedExampleState {
  items: IDetailsListGroupedExampleItem[];
  groups: IGroup[];
  showItemIndexInView: boolean;
  isCompactMode: boolean;
}

const columns = [
  { key: 'name', name: 'Name', fieldName: 'name', minWidth: 100, maxWidth: 200, isResizable: true },
  { key: 'menu', name: 'Menu', fieldName: 'menu', minWidth: 100, maxWidth: 200 },
  { key: 'timeslot', name: 'Timeslot', fieldName: 'timeslot', minWidth: 100, maxWidth: 200 },
];

export function GroupedList(props: {
  currentWeek: number;
  year: number;
}) {

  const [selectedItems, setSelectedItems] = useState<IObjectWithKey[]>();

  const selection = new Selection({
    onSelectionChanged: () => {
      setSelectedItems(selection.getSelection())
    },
    selectionMode: SelectionMode.multiple
  });

  const cwDateValues = getDatesMondayToFridayCalenderWeek(props.currentWeek, props.year);
  const itemsQuery = useSharepointListData(props.currentWeek, props.year);

  if (itemsQuery.isError){
    return (
      <div>
      </div>
    );
  }

  let groups: IGroup[] = cwDateValues.map((dateValue) => ({
    key: dateValue.replaceAll(".", ""),
    name: dateValue,
    startIndex: 0,
    count: 0,
    level: 0
  }
  ));

  if (itemsQuery.data) {
    groups = cwDateValues.map((dateValue) => ({
      key: dateValue.replaceAll(".", ""),
      name: dateValue,
      startIndex: getStartIndex(itemsQuery.data, dateValue.replaceAll('.', '')),
      count: itemsQuery.data.filter(x => x.key.split('_')[0] == `${dateValue.replaceAll('.', '')}`).length,
      level: 0
    }
    ));
  }

  if (itemsQuery.isLoading) {
    return (
      <div className="grouped-list">
        <Spinner label="I am definitely loading..." />
      </div>
    )
  }

  if (itemsQuery.isFetching) {
    return (
      <div className="grouped-list">
        <DeletionPanel selectedItems={selectedItems} />
        <Spinner label="I am fetching data..." />
      </div>
    )
  }

  return (
    <div className="grouped-list">
      <div className="delete-button">
        <DeletionPanel selectedItems={selectedItems} />
      </div>
      <DetailsList
        items={itemsQuery.data!}
        groups={groups}
        columns={columns}
        ariaLabelForSelectAllCheckbox="Toggle selection for all items"
        ariaLabelForSelectionColumn="Toggle selection"
        checkButtonAriaLabel="select row"
        checkButtonGroupAriaLabel="select section"
        selection={selection}
        selectionPreservedOnEmptyClick={true}
        groupProps={{
          showEmptyGroups: true,
        }}
      />
    </div>
  );
}

function getStartIndex(filteredItems: any[], currentDateGroupKey: string) {
  const currentItems = filteredItems.filter(x => x.key.split('_')[0] == currentDateGroupKey);

  if (currentItems.length == 0) {
    return 0;
  }

  const firstFilteredItemsIndex = parseInt(currentItems[0].key.split('_')[1]);

  return firstFilteredItemsIndex;
}