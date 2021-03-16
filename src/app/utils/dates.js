/* eslint no-fallthrough: off */

import moment from "moment";

const MILLI = {
    seconds: 1000,
    minutes: 1000 * 60,
    hours: 1000 * 60 * 60,
    day: 1000 * 60 * 60 * 24
};

const MONTHS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

let dates = {

    hourAndMinuteForString(string) {
        let hours = string.split(':');

        return {hour: hours[0], minutes: hours[1]};
    },

    getMinutesOfInterval(start, end, minutes) {
        let minutesInterval = [];

        while (start <= end) {
            minutesInterval.push({
                value: start.format('HH:mm'),
                valueDate: start
            });

            start = moment(start).add(minutes, "minutes");
        }

        return minutesInterval;
    },

    existInRange(start, end, date) {

        const range = moment.range(start, end);

        return range.contains(date);
    },

    stringToDate(stringDate) {

        if (!stringDate) {
            return null;
        }

        //remove [local] of string date
        const string = stringDate.replace(/ *\[[^)]*\] */g, "");

        return moment(string);
    },


    monthsInYear(year) {
        let date = new Date(year, 0, 1)

        return MONTHS.map(i => dates.month(date, i))
    },


    visibleDays(date, culture) {
        let current = dates.firstVisibleDay(date, culture)
            , last = dates.lastVisibleDay(date, culture)
            , days = [];

        while (dates.lte(current, last, 'day')) {
            days.push(current)
            current = dates.add(current, 1, 'day')
        }

        return days
    },

    ceil(date, unit) {
        let floor = dates.startOf(date, unit)

        return dates.eq(floor, date) ? floor : dates.add(floor, 1, unit)
    },

    range(start, end, unit = 'day') {
        let current = start
            , days = [];

        while (dates.lte(current, end, unit)) {
            days.push(current)
            current = dates.add(current, 1, unit)
        }

        return days
    },

    merge(date, time) {
        if (time == null && date == null)
            return null

        if (time == null) time = new Date()
        if (date == null) date = new Date()

        date = dates.startOf(date, 'day')
        date = dates.hours(date, dates.hours(time))
        date = dates.minutes(date, dates.minutes(time))
        date = dates.seconds(date, dates.seconds(time))
        return dates.milliseconds(date, dates.milliseconds(time))
    },

    sameMonth(dateA, dateB) {
        return dates.eq(dateA, dateB, 'month')
    },

    isToday(date) {
        return dates.eq(date, dates.today(), 'day')
    },

    eqTime(dateA, dateB) {
        return dates.hours(dateA) === dates.hours(dateB)
            && dates.minutes(dateA) === dates.minutes(dateB)
            && dates.seconds(dateA) === dates.seconds(dateB)
    },

    isJustDate(date) {
        return (
            dates.hours(date) === 0
            && dates.minutes(date) === 0
            && dates.seconds(date) === 0
            && dates.milliseconds(date) === 0
        )
    },

    duration(start, end, unit, firstOfWeek) {
        if (unit === 'day') unit = 'date';
        return Math.abs(dates[unit](start, undefined, firstOfWeek) - dates[unit](end, undefined, firstOfWeek))
    },

    diff(dateA, dateB, unit) {
        if (!unit || unit === 'milliseconds')
            return Math.abs(+dateA - +dateB)

        // the .round() handles an edge case
        // with DST where the total won't be exact
        // since one day in the range may be shorter/longer by an hour
        return Math.round(Math.abs(
            (+dates.startOf(dateA, unit) / MILLI[unit]) - (+dates.startOf(dateB, unit) / MILLI[unit])
        ))
    },

    total(date, unit) {
        let ms = date.getTime()
            , div = 1;

        switch (unit) {
            case 'week':
                div *= 7;
                break;
            case 'day':
                div *= 24;
                break;
            case 'hours':
                div *= 60;
                break;
            case 'minutes':
                div *= 60;
                break;
            case 'seconds':
                div *= 1000;
                break;
            default:
        }

        return ms / div;
    },

    week(date) {
        var d = new Date(date);
        d.setHours(0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        return Math.ceil((((d - new Date(d.getFullYear(), 0, 1)) / 8.64e7) + 1) / 7);
    },

    today() {
        return dates.startOf(new Date(), 'day')
    },

    yesterday() {
        return dates.add(dates.startOf(new Date(), 'day'), -1, 'day')
    },

    tomorrow() {
        return dates.add(dates.startOf(new Date(), 'day'), 1, 'day')
    },

    daysOfWeekTransform() {
        const daysOfWeek = [] 
        daysOfWeek["Domingo"] = "domingo";
        daysOfWeek["Segunda-feira"] = "segunda";
        daysOfWeek["Terça-feira"] = "terca";
        daysOfWeek["Quarta-feira"] = "quarta";
        daysOfWeek["Quinta-feira"] = "quinta";
        daysOfWeek["Sexta-feira"] = "sexta";
        daysOfWeek["Sábado"] = "sabado";
        return daysOfWeek;
    },
    calculaIdade(dataNascimento) {
        if(!dataNascimento){
            return null;
        }

        let dataNascimentoMoment = moment(dataNascimento),
            dataHoje = moment(),
            intervals = [{label: 'anos', value: 'years'},{label: 'meses', value: 'months'},{label: 'dias', value: 'days'}],
            out = [];

        for(let i=0; i<intervals.length; i++){
            let diff = dataHoje.diff(dataNascimentoMoment, intervals[i].value);
            dataNascimentoMoment.add(diff, intervals[i].value);
            out.push(diff + ' ' + intervals[i].label);
        }
        return out.join(', ');
    }
};

export default dates;