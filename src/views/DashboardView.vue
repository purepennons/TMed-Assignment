<script>
import { subHours, addHours, startOfDay, getTime, addDays, format } from 'date-fns/fp'
import { pipe, map, defaultsDeep } from 'lodash/fp'

import { toUTCDate } from '@/utils'
import { TIME_ZONE, DATE_STRING_FORMAT } from '@/constants'

import useTimeData from '@/data/use_time.json'
import realTimeData20240116 from '@/data/real_time_20240116.json'
import realTimeData20240118 from '@/data/real_time_20240118.json'

function getDateTimeBoundaries(date) {
    const period = 12 // hours

    const baseDate = pipe(toUTCDate, startOfDay, addDays(1))(date)

    return [getTime(subHours(period)(baseDate)), getTime(addHours(period)(baseDate))]
}

const normalizeRealTimeData = map(([x, y]) => [toUTCDate(x), y])

const realTimeDataMap = {
    '2024-01-16 00:00:00.000': realTimeData20240116,
    '2024-01-18 00:00:00.000': realTimeData20240118
}

const defaultLargePointChartOptions = () => ({
    chart: {
        type: 'line',
        zoomType: 'x'
    },
    title: {
        text: 'PulseRate',
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
        const realTimeSelectedDate = format(DATE_STRING_FORMAT, startOfDay(new Date()))
        const defaultRealTimeData = realTimeDataMap[realTimeSelectedDate] ?? { data: [] }
        let initialRealTimeMinDateTime = undefined 
        let initialRealTimeMaxDateTime = undefined

        if (defaultRealTimeData) {
            [initialRealTimeMinDateTime, initialRealTimeMaxDateTime] = getDateTimeBoundaries(
                realTimeSelectedDate
            )
        }

        return {
            columnChartOptions: {
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    categories: useTimeData.dates
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
                        data: useTimeData.data
                    }
                ]
            },
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
    computed: {},
    methods: {
        handleRealTimeDateChange() {
            const dateString = format(DATE_STRING_FORMAT, this.realTimeSelectedDate)
            const realTimeData = realTimeDataMap[dateString]

            if (!realTimeData) {
                this.largePointChartOptions = defaultLargePointChartOptions()
            } else {
                const [minDateTime, maxDateTime] = getDateTimeBoundaries(dateString)
    
                this.largePointChartOptions.xAxis.min = minDateTime
                this.largePointChartOptions.xAxis.max = maxDateTime
                this.largePointChartOptions.series[0].data = normalizeRealTimeData(realTimeData.data)
            }
        }
    },
    watch: {
        realTimeSelectedDate() {
            this.handleRealTimeDateChange()
        }
    }
}
</script>

<template>
    <div class="container-fluid">
        <div class="row">
            <nav class="col-lg-2">nav</nav>
            <main class="col-sm-12 col-lg-10">
                <highcharts :options="columnChartOptions"></highcharts>
                <div class="container">
                    <VDatePicker v-model="realTimeSelectedDate" :popover="{ visibility: 'click' }">
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
    background: tomato;
}
</style>
