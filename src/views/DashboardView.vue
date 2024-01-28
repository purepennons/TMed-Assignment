<script>
import { subHours, addHours, startOfDay, getTime, addDays, format, parse } from 'date-fns/fp'
import { pipe, map, defaultsDeep, zip, unzip, filter } from 'lodash/fp'

import { toUTCDate, isAfterOrEqual, isBeforeOrEqual } from '@/utils'
import { TIME_ZONE, DATE_STRING_FORMAT, DATE_INPUT_FORMAT } from '@/constants'

import useTimeData from '@/data/use_time.json'
import realTimeData20240116 from '@/data/real_time_20240116.json'
import realTimeData20240118 from '@/data/real_time_20240118.json'

function getDateTimeBoundaries(date) {
    const period = 12 // hours

    const baseDate = pipe(toUTCDate, startOfDay, addDays(1))(date)

    return [getTime(subHours(period)(baseDate)), getTime(addHours(period)(baseDate))]
}

function truncateUseTimeDataByRange(useTimeData, { start, end }) {
    const parseWithFormat = parse(new Date(), 'yyyy-MM-dd')
    const truncatedUseTimeData = pipe(
        zip,
        filter(([, date]) => {
            const parsedDate = parseWithFormat(date)

            if (start && end) {
                return isAfterOrEqual(parsedDate, start) && isBeforeOrEqual(parsedDate, end)
            } else if (start) {
                return isAfterOrEqual(parsedDate, start)
            } else if (end) {
                return isBeforeOrEqual(parsedDate, end)
            } else {
                return true
            }
        }),
        unzip
    )(useTimeData.data, useTimeData.dates)

    return {
        data: truncatedUseTimeData[0],
        dates: truncatedUseTimeData[1]
    }
}

const normalizeRealTimeData = map(([x, y]) => [toUTCDate(x), y])

const realTimeDataMap = {
    '2024-01-16 00:00:00.000': realTimeData20240116,
    '2024-01-18 00:00:00.000': realTimeData20240118
}

const defaultUseTimeDateRange = () => ({
    start: '',
    end: ''
})
const defaultColumnChartOptions = () => ({
    chart: {
        type: 'column'
    },
    plotOptions: {
        column: {
            pointPadding: 0.4,
        }
    },
    title: {
        text: ''
    },
    xAxis: {
        categories: []
    },
    yAxis: {
        title: {
            text: ''
        },
        min: 0,
        tickInterval: 5
    },
    legend: {
        align: 'left',
        verticalAlign: 'top'
    },
    series: [
        {
            name: 'USETIME(h)',
            color: '#06BF92',
            data: []
        }
    ]
})

const defaultLargePointChartOptions = () => ({
    chart: {
        type: 'line',
        zoomType: 'x'
    },
    title: {
        text: '',
        align: 'left'
    },
    xAxis: {
        type: 'datetime',
        tickInterval: 3600 * 1000
    },
    yAxis: {
        title: {
            text: 'Pulse'
        },
        tickInterval: 25
    },
    legend: {
        enabled: false
    },
    time: {
        timezone: TIME_ZONE
    },
    series: [
        {
            name: 'Pulse',
            data: []
        }
    ]
})

export default {
    name: 'DashboardView',
    data() {
        const today = new Date()
        const defaultUseTimeData = truncateUseTimeDataByRange(useTimeData, {
            start: '',
            end: ''
        })
        const realTimeSelectedDate = format(DATE_STRING_FORMAT, startOfDay(today))
        const defaultRealTimeData = realTimeDataMap[realTimeSelectedDate] ?? { data: [] }
        let initialRealTimeMinDateTime = undefined
        let initialRealTimeMaxDateTime = undefined

        if (defaultRealTimeData) {
            ;[initialRealTimeMinDateTime, initialRealTimeMaxDateTime] =
                getDateTimeBoundaries(realTimeSelectedDate)
        }

        return {
            today,
            useTimeDateRange: defaultUseTimeDateRange(),
            columnChartOptions: defaultsDeep(defaultColumnChartOptions())({
                xAxis: {
                    categories: defaultUseTimeData.dates
                },
                series: [
                    {
                        name: 'USETIME(h)',
                        data: defaultUseTimeData.data
                    }
                ]
            }),
            realTimeSelectedDate,
            largePointChartOptions: defaultsDeep(defaultLargePointChartOptions())({
                xAxis: {
                    min: initialRealTimeMinDateTime,
                    max: initialRealTimeMaxDateTime
                },
                series: [
                    {
                        data: normalizeRealTimeData(defaultRealTimeData.data)
                    }
                ]
            })
        }
    },
    computed: {
        formatUseTimeDateStart() {
            return this.useTimeDateRange.start
                ? format(DATE_INPUT_FORMAT, this.useTimeDateRange.start)
                : ''
        },
        formaUseTimeDateEnd() {
            return this.useTimeDateRange.end
                ? format(DATE_INPUT_FORMAT, this.useTimeDateRange.end)
                : ''
        }
    },
    methods: {
        handleUseTimeDateRangeChange() {
            const { start, end } = this.useTimeDateRange
            const truncatedUseTimeData = truncateUseTimeDataByRange(useTimeData, {
                start,
                end
            })

            this.columnChartOptions.xAxis.categories = truncatedUseTimeData.dates
            this.columnChartOptions.series[0].data = truncatedUseTimeData.data
        },
        handleRealTimeDateChange() {
            const dateString = format(DATE_STRING_FORMAT, this.realTimeSelectedDate)
            const realTimeData = realTimeDataMap[dateString]

            if (!realTimeData) {
                this.largePointChartOptions = defaultLargePointChartOptions()
            } else {
                const [minDateTime, maxDateTime] = getDateTimeBoundaries(dateString)

                this.largePointChartOptions.xAxis.min = minDateTime
                this.largePointChartOptions.xAxis.max = maxDateTime
                this.largePointChartOptions.series[0].data = normalizeRealTimeData(
                    realTimeData.data
                )
            }
        }
    },
    watch: {
        useTimeDateRange() {
            this.handleUseTimeDateRangeChange()
        },
        realTimeSelectedDate() {
            this.handleRealTimeDateChange()
        }
    }
}
</script>

<template>
    <div class="dashboard container-fluid">
        <div class="row">
            <nav class="col-lg-3">
                <div class="row">
                    <div class="col-lg-5">
                        <div class="input-group">
                            <input
                                class="form-control"
                                :readonly="true"
                                v-model="formatUseTimeDateStart"
                            />
                        </div>
                    </div>
                    <div class="col-lg-2">&lt;></div>
                    <div class="col-lg-5">
                        <div class="input-group">
                            <input
                                class="form-control"
                                :readonly="true"
                                v-model="formaUseTimeDateEnd"
                            />
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <VDatePicker
                            class="form-control"
                            v-model="useTimeDateRange"
                            title-position="left"
                            :input-debounce="500"
                            :max-date="today"
                            :popover="{ visibility: 'hidden' }"
                            is-range
                        >
                        </VDatePicker>
                    </div>
                </div>
            </nav>
            <main class="col-sm-12 col-lg-9">
                <div class="chart-container use-time-chart container-fluid">
                    <highcharts :options="columnChartOptions"></highcharts>
                </div>
                <div class="chart-container real-time-chart container-fluid">
                    <VDatePicker
                        v-model="realTimeSelectedDate"
                        title-position="left"
                        :popover="{ visibility: 'click' }"
                        :max-date="today"
                        :input-debounce="500"
                    >
                        <template #default="{ inputValue, inputEvents }">
                            <input
                                type="text"
                                :readonly="true"
                                :value="inputValue"
                                v-on="inputEvents"
                            />
                        </template>
                    </VDatePicker>
                    <highcharts :options="largePointChartOptions"></highcharts>
                </div>
            </main>
        </div>
    </div>
</template>

<style lang="scss" scoped>
nav {
    background: yellow;
}

main {
    > .chart-container {
        margin-bottom: 39px;
    }

    .use-time-chart {
        border-radius: 8px;
        border: 2px solid #ededed;
    }

    background: tomato;
}
</style>
