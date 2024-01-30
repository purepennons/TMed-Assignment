<script>
import {
    subHours,
    addHours,
    startOfDay,
    getTime,
    addDays,
    subSeconds,
    format,
    parse
} from 'date-fns/fp'
import { pipe, map, defaultsDeep, zip, unzip, filter } from 'lodash/fp'
import Highcharts from 'highcharts'

import { toUTCDate, isAfterOrEqual, isBeforeOrEqual } from '@/utils'
import { TIME_ZONE, DATE_STRING_FORMAT, DATE_INPUT_FORMAT } from '@/constants'

import InputWithIcon from '@/components/InputWithIcon.vue'
import CalendarIcon from '@/components/icons/IconCalendar.vue'
import TwoSideArrowsIcon from '@/components/icons/IconTwoSideArrows.vue'

import logoImgURL from '@/assets/TMedTech-logo.png'

import useTimeData from '@/data/use_time.json'
import realTimeData20240116 from '@/data/real_time_20240116.json'
import realTimeData20240118 from '@/data/real_time_20240118.json'

function getDateTimeBoundaries(date) {
    const period = 12 // hours

    const baseDate = pipe(toUTCDate, startOfDay, addDays(1))(date)

    return [
        getTime(subHours(period)(baseDate)),
        getTime(pipe(addHours(period), subSeconds(1))(baseDate))
    ]
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
                return false
            }
        }),
        unzip
    )(useTimeData.data, useTimeData.dates)

    return {
        data: truncatedUseTimeData[0] ?? [],
        dates: truncatedUseTimeData[1] ?? []
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
        type: 'column',
        height: 164,
        style: {
            fontFamily: 'Inter'
        }
    },
    plotOptions: {
        column: {
            pointPadding: 0.4
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
        tickInterval: 5,
        lineWidth: 1,
        lineColor: '#000000'
    },
    legend: {
        align: 'left',
        verticalAlign: 'top'
    },
    tooltip: {
        formatter: function () {
            return `
                <div>
                    <span>${this.x}</span><br/>
                    <span style="color: ${this.color}">${this.series.name}:</span> <b>${this.y}</b><br/>
                </div>
            `
        }
    },
    time: {
        timezone: TIME_ZONE
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
        zoomType: 'x',
        height: 207,
        style: {
            fontFamily: 'Inter'
        }
    },
    title: {
        text: '',
        align: 'left'
    },
    xAxis: {
        type: 'datetime',
        crosshair: true,
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
    tooltip: {
        formatter: function () {
            return `<span style="color: ${this.color}">\u25CF</span> ${this.series.name}: <b>${this.y}</b><br/>`
        }
    },
    time: {
        timezone: TIME_ZONE
    },
    series: [
        {
            name: 'Pulse',
            pointIntervalUnit: 'hour',
            data: [],
            point: {
                events: {
                    mouseOver: function () {
                        const tooltip_width = 126
                        const chart = this.series.chart
                        const customTooltip = document.getElementById('custom-tooltip')
                        const xPos = chart.plotLeft + this.plotX - tooltip_width / 2
                        const yPos = chart.plotTop + chart.plotHeight

                        customTooltip.innerHTML = Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x)
                        customTooltip.style.width = `${tooltip_width}px`
                        customTooltip.style.left = `${xPos}px`
                        customTooltip.style.top = `${yPos}px`
                        customTooltip.style.display = 'block'
                    },
                    mouseOut: function () {
                        const customTooltip = document.getElementById('custom-tooltip')
                        customTooltip.style.display = 'none'
                    }
                }
            }
        }
    ]
})

export default {
    name: 'DashboardView',
    components: {
        InputWithIcon,
        TwoSideArrowsIcon
    },
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
            CalendarIcon,
            logoImgURL,
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
        },
        formatRealTimeSelectedDate() {
            return this.realTimeSelectedDate
                ? format(DATE_INPUT_FORMAT, toUTCDate(this.realTimeSelectedDate))
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
                    <div class="logo d-flex justify-content-center">
                        <img :src="logoImgURL" alt="TMedTech" />
                        <span>Portal</span>
                    </div>
                </div>
                <div class="row calendar-input-row justify-content-center">
                    <div class="col-lg-5 px-0 d-flex justify-content-end">
                        <div class="input-group calendar-input">
                            <label for="range.start" class="form-label">Start Date</label>
                            <InputWithIcon
                                id="range.start"
                                class="form-control"
                                :readonly="true"
                                v-model="formatUseTimeDateStart"
                                :svgIconComponent="CalendarIcon"
                            />
                        </div>
                    </div>
                    <div
                        class="two-side-arrows-icon col-lg-1 px-0 d-flex justify-content-center align-items-center"
                    >
                        <TwoSideArrowsIcon />
                    </div>
                    <div class="col-lg-5 px-0 d-flex justify-content-start">
                        <div class="input-group calendar-input">
                            <label for="range.end" class="form-label">End Date</label>
                            <InputWithIcon
                                id="range.end"
                                class="form-control"
                                :readonly="true"
                                v-model="formaUseTimeDateEnd"
                                :svgIconComponent="CalendarIcon"
                            />
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="range-date-picker col-12 d-flex justify-content-center">
                        <VDatePicker
                            class="vc-calendar-date-picker"
                            v-model="useTimeDateRange"
                            title-position="left"
                            expanded
                            borderless
                            color="green"
                            :input-debounce="500"
                            :max-date="today"
                            :popover="{ visibility: 'hidden' }"
                            is-range
                        >
                        </VDatePicker>
                    </div>
                </div>
            </nav>
            <main class="col-sm-12 col-lg-9 px-0">
                <header class="container-fluid">
                    <div>
                        <h1>Miller, Jonathan</h1>
                        <div class="subtitle">
                            <span>DOB: 11 / 14 / 1980 </span>
                            <span>SN: CP01832648</span>
                        </div>
                    </div>
                </header>
                <div class="chart-container container-fluid">
                    <div class="chart-item use-time-chart">
                        <highcharts :options="columnChartOptions"></highcharts>
                    </div>
                </div>
                <div class="chart-container container-fluid">
                    <div class="chart-item real-time-chart">
                        <div class="real-time-input-container d-flex align-items-center">
                            <p>PulseRate</p>
                            <span>⌵</span>
                            <VDatePicker
                                class="vc-calendar-date-picker"
                                v-model="realTimeSelectedDate"
                                title-position="left"
                                color="green"
                                borderless
                                :popover="{ visibility: 'click' }"
                                :max-date="today"
                                :input-debounce="500"
                            >
                                <template #default="{ inputEvents }">
                                    <div class="input-group calendar-input single-date-picker">
                                        <InputWithIcon
                                            class="form-control"
                                            type="text"
                                            v-model="formatRealTimeSelectedDate"
                                            v-on="inputEvents"
                                            :readonly="true"
                                            :svgIconComponent="CalendarIcon"
                                        />
                                    </div>
                                </template>
                            </VDatePicker>
                        </div>
                        <div class="large-point-chart">
                            <div id="custom-tooltip" class="custom-tooltip"></div>
                            <highcharts :options="largePointChartOptions"></highcharts>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '@/main.scss';

* {
    font-family: 'Inter';
    font-weight: 600;
    line-height: 140%;
}

.custom-tooltip {
    position: absolute;
    z-index: 10;
    display: none;
    background-color: white;
    border: 1px solid #666;
    padding: 8px;
    pointer-events: none;

    font-size: 10px;
    font-family: 'Inter';

    border-radius: 4px;
    box-shadow: 0px 0px 3px 3px rgba(0, 0, 0, 0.2);
    text-align: center;
}

label {
    font-size: 15px;
}

nav {
    background: #fafafa;
    border-right: 0.75px solid #d9d9d9;
    height: 100vh;

    .logo {
        max-height: 34px;
        color: #0e1123;
        font-style: normal;
        margin: 95px 0 34px 0;

        > span,
        img {
            vertical-align: baseline;
        }

        > span {
            font-family: 'Poppins';
            font-weight: 400;
            font-size: 33px;
            margin-top: -5px;
            margin-left: -9px;
        }
    }

    & .calendar-input-row {
        margin-bottom: 16px;

        & .two-side-arrows-icon {
            height: 38px;
            align-self: flex-end;
        }
    }

    & .range-date-picker {
        padding: 0 24px;
    }
}

main {
    > .chart-container {
        margin: 26px 0 39px 0;
        padding: 0 12px 0 58px;

        > .chart-item {
            border-radius: 8px;
            border: 2px solid #ededed;
            background: white;
            box-shadow: 0px 0px 0px 3px rgba(221, 221, 221, 0.16);
        }
    }

    .use-time-chart {
        padding: 34px 17px 17px 17px;
        border-radius: 8px;
        border: 2px solid #ededed;
        box-shadow: 0px 0px 0px 3px rgba(221, 221, 221, 0.16);
    }

    .real-time-chart {
        padding: 20px 20px 38px 20px;
        & .real-time-input-container {
            & p {
                margin: 0;
            }

            & span {
                margin: 0 10px;
            }
            & .single-date-picker {
                width: 125px;
            }
        }

        & .large-point-chart {
            position: relative;
        }
    }
}

header {
    height: 157px;
    background: #f1f3f4;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
    padding: 90px 190px 0 58px;

    & > div {
        border-bottom: 1px solid #c4c4c4;

        & h1 {
            font-size: 20px;
        }

        & .subtitle {
            font-size: 14px;
            color: #727171;
            margin-bottom: 10px;
        }
    }
}

@include media-breakpoint-down(md) {
    nav {
        height: auto;
    }
}
</style>
