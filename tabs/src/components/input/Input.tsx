import "./Input.css"
import React, { useState } from "react";
import { Dropdown } from '@fluentui/react/lib/Dropdown';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { getDatesMondayToFridayCalenderWeek, getDateString } from "../../bl/DateFunctions";
import { useSharepointListMutation } from "../../hooks/useSharepointListMutation";
import { usePlanningMutation } from "../../hooks/usePlanningMutation";
import { IOrderItem } from "../../models/IOrderItem";
import { Label, Spinner, Stack } from "@fluentui/react";

export function Input(props: {
  currentWeek: number;
  year: number;
}) {
  const [selectedMenu, setSelectedMenu] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeslot, setSelectedTimeslot] = useState("");

  const handleMenuChange = (e: React.FormEvent<HTMLDivElement>) => {
    setSelectedMenu(e.currentTarget.textContent ?? "");
  }
  const handleDateChange = (e: React.FormEvent<HTMLDivElement>) => {
    setSelectedDate(e.currentTarget.textContent ?? "");
  }
  const handleTimeslotChange = (e: React.FormEvent<HTMLDivElement>) => {
    setSelectedTimeslot(e.currentTarget.textContent ?? "");
  }

  const orderItem: IOrderItem = {
    Menu: selectedMenu,
    DateWithTime: getDateString(selectedDate, selectedTimeslot),
    CalenderWeek: props.currentWeek,
    Year: props.year
  }

  const sharepointListMutation = useSharepointListMutation(orderItem);
  const planningMutation = usePlanningMutation(orderItem);
  const datesCalenderWeek = getDatesMondayToFridayCalenderWeek(props.currentWeek, props.year);

  return (
    <div>
      <Dropdown
        placeholder="Menu selection"
        label="Select a menu"
        options={[
          { key: "1", text: "Menu 1" },
          { key: "2", text: "Menu 2" }
        ]}
        required={true}
        styles={{ dropdown: { width: 300 } }}
        onChange={handleMenuChange}
      />
      <Dropdown
        placeholder="Date selection"
        label="Select a date"
        options={datesCalenderWeek.map(x => {
          return { key: x.replaceAll(".", ""), text: x }
        })}
        required={true}
        styles={{ dropdown: { width: 300 } }}
        onChange={handleDateChange}
      />
      <Dropdown
        placeholder="Timeslot selection"
        label="Select a timeslot"
        options={[
          { key: "1130", text: "11:30" },
          { key: "1215", text: "12:15" },
          { key: "1200", text: "12:00" }
        ]}
        required={true}
        styles={{ dropdown: { width: 300 } }}
        onChange={handleTimeslotChange}
      />

      <Stack horizontal className="input-buttons">
        <PrimaryButton text="Save" disabled={sharepointListMutation.isLoading} onClick={() => sharepointListMutation.mutate()} />
        {sharepointListMutation.error == "ERRORVALIDATE" && (
          <Label className="input-validation">Please input required fields!</Label>
        )}
      </Stack>
      <Stack horizontal className="input-buttons">
        <PrimaryButton text="Plan all my order entries for this calender week" disabled={planningMutation.isLoading} onClick={() => planningMutation.mutate()} />
        {planningMutation.isLoading && (
          <Spinner label=" Planning into calender..." ariaLive="assertive" labelPosition="right" />
        )}
      </Stack>
    </div>
  );
}