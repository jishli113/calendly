import { useState } from "react";
import React from "react";
import { Temporal } from "@js-temporal/polyfill";

const useTimeConversion=()=>{

    function formatTime(hour, minute){
        return(`${(hour < 10 || (hour > 12 && hour < 22) ? "0" : "")}${hour > 12 ? hour - 12 : hour}:${minute < 10 ? "0" : ""}${minute} ${hour >= 12 ? "PM" : "AM"}`)
    }

    function convertToLocal(tz, year, month, day, hour, minute){
            let now = Temporal.ZonedDateTime.from({timeZone:"UTC", year:year, month: month, day: day, hour: hour, minute: minute})
            return now.withTimeZone(tz)

    }

    function convertToUTC(tz, year, month, day, hour, minute){
        let date = Temporal.ZonedDateTime.from({timeZone: tz, year: year, month: month, day: day, hour:hour, minute: minute})
        let utctz = Temporal.TimeZone.from("UTC")
        return date.withTimeZone(utctz)
    }



    return {formatTime, convertToLocal, convertToUTC}

}
export default useTimeConversion