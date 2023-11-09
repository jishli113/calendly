import useAPICallBody from "./useAPICallBody";
import { Temporal } from "@js-temporal/polyfill";
import useTimeConversion from "./useTimeConversion";
const useAlterEvents=()=>{
    const {callAPI:callGetEvents} = useAPICallBody()
    const {convertToLocal} = useTimeConversion()
    function timeComparator(obj1, obj2) {
        return obj1.starthour != obj2.starthour
          ? obj1.starthour - obj2.starthour
          : obj1.startminute - obj2.st;
      }
    async function getCurrentEvents(username, date) {
        let events = await callGetEvents(
          `http://localhost:4000/api/events/daily/`,
          "POST",
          {
            username,
            date
          }
        );
        if (events !== undefined) {
          let eventsStore = events;
          const localTz = Temporal.Now.timeZoneId();
          const dateOne = date;
          const dateTwo = dateOne.add({ days: 1 });
          for (var i = 0; i < events.length; i++) {
            let temp = undefined;
            let d1bool = false;
            let d2bool = false
            for (var j = 0; j < events[i].dates.length; j++) {
              d1bool = d1bool || dateOne.toString() == events[i].dates[j];
              d2bool = d2bool || dateTwo.toString() == events[i].dates[j];
            }
            if ((d1bool || d2bool) && (!d1bool || !d2bool)) {
              if (d1bool) {
                temp = convertToLocal(
                  localTz,
                  dateOne.year,
                  dateOne.month,
                  dateOne.day,
                  events[i].starthour,
                  events[i].startminute
                );
                if (
                  temp.year != dateOne.year ||
                  temp.month != dateOne.month ||
                  temp.day != dateOne.day
                ) {
                  eventsStore.splice(i, 1);
                  i = i - 1;
                  continue;
                }
              }
              if (d2bool) {
                temp = convertToLocal(
                  localTz,
                  dateTwo.year,
                  dateTwo.month,
                  dateTwo.day,
                  events[i].starthour,
                  events[i].startminute
                );
                if (
                  temp.year != dateOne.year ||
                  temp.month != dateOne.month ||
                  temp.day != dateOne.day
                ) {
                  eventsStore.splice(i, 1);
                  i = i - 1;
                  continue;
                }
              }
            }
            temp = convertToLocal(
              localTz,
              dateOne.year,
              dateOne.month,
              dateOne.day,
              events[i].starthour,
              events[i].startminute
            );
            eventsStore[i].starthour = temp.hour;
            eventsStore[i].startminute = temp.minute;
            temp = convertToLocal(
              localTz,
              dateOne.year,
              dateOne.month,
              dateOne.day,
              events[i].endhour,
              events[i].endminute
            );
            eventsStore[i].endhour = temp.hour;
            eventsStore[i].endminute = temp.minute;
          }
          return(eventsStore.sort(timeComparator))
        }
      }
      return {getCurrentEvents}
}
export default useAlterEvents