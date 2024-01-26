import { parse, isDate } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'
import { TIME_ZONE, DATE_STRING_FORMAT } from './constants'

export function toUTCDate(
    dateString,
    options = { timeZone: TIME_ZONE, format: DATE_STRING_FORMAT }
) {
    let date = dateString

    if (!isDate(dateString)) {
        date = parse(date, options.format, new Date())
    }

    return zonedTimeToUtc(date, options.timeZone)
}
