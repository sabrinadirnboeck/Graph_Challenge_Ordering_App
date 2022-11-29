import moment from "moment";

export function getDateByWeek(week: number,  year: number): Date {
    var day = new Date(year, 0);

    var dayNum = day.getDay();
    var requiredDate = --week * 7;
  
    if (dayNum != 0 || dayNum > 4) {
      requiredDate += 7;
    }

    day.setDate(1 - day.getDay() + ++requiredDate);
    return day;
}

export function getDatesMondayToFridayCalenderWeek(week: number, year: number): string[] {
    var dateOptions:string[] = [];
    var startDate = getDateByWeek(week, year);
    var tomorrowDate = new Date(startDate);

    dateOptions.push(moment(tomorrowDate).format("DD.MM.YYYY"));
    for (let i = 0; i < 4; i++) {
        tomorrowDate.setDate(tomorrowDate.getDate()+1);
        dateOptions.push(moment(tomorrowDate).format("DD.MM.YYYY"));
    }
    return dateOptions;
}

export function getCurrentCalenderWeek(): number {
    return parseInt(moment().format("W"));
}

export function getCurrentYear(addedWeek?: number): number {

    if (!addedWeek || addedWeek <= 0){
        return parseInt(moment().startOf('isoWeek').format("YYYY"));
    }

    var currentDayMondayWithAddedWeek = moment().startOf('isoWeek').add(addedWeek, 'w');

    return parseInt(currentDayMondayWithAddedWeek.format("YYYY"));
}

export function getDateString(date: string, timeslot: string) {
    // return ex. "2022-11-19T17:00:00Z"

    if (date == "" || timeslot == ""){
        return "";
    }

    const formattedDate = moment(date, "DD.MM.YYYY").format("YYYY-MM-DD");
    const formattedTime = `T${timeslot}:00Z`;

    return formattedDate + formattedTime;
}

export function getDateStringWithAddedHour(dateString: string) {
    const dateAndTimeSplit = dateString.split('T');
    let time = moment(dateAndTimeSplit[1].replace("Z", ""), "HH:mm:ss");
    time = time.add(1, "hours");

    return `${dateAndTimeSplit[0]}T${time.format("HH:mm:ss")}Z`;
}

export function getDateFromDateString(dateString: string) {
    let dateAndTimeSplit = dateString.split('T');
    dateAndTimeSplit[1] = dateAndTimeSplit[1].replace("Z", "");

    return moment(`${dateAndTimeSplit[0]} ${dateAndTimeSplit[1]}`, 'YYYY-MM-DD HH:mm:ss').toDate();
}

export function getDateKeyString(dateString: string){
    const date = dateString.split('T')[0]

    return moment(date, "YYYY-MM-DD").format("DDMMYYYY");
}