<script>
import { subHours, addHours, startOfDay, getTime, addDays } from 'date-fns/fp'
import { pipe } from 'lodash/fp'

import { toUTCDate } from '@/utils'
import { TIME_ZONE } from '@/constants'

import useTimeData from '@/data/use_time.json'
import realTimeData from '@/data/real_time_20240116.json'

function getDateTimeBoundaries(date) {
    const period = 12 // hours

    const baseDate = pipe(
        toUTCDate,
        startOfDay,
        addDays(1),
    )(date)

    return [getTime(subHours(period)(baseDate)), getTime(addHours(period)(baseDate))]
}

const selectedDateString = '2024-01-16 00:00:00.000'
const [initialRealTimeMinDateTime, initialRealTimeMaxDateTime] = getDateTimeBoundaries(selectedDateString)
console.log(initialRealTimeMinDateTime, initialRealTimeMaxDateTime)
console.log('2024-01-17 00:06:02.000', toUTCDate('2024-01-17 00:06:02.000'))

export default {
    name: 'DashboardView',
    data() {
        return {
            selectedDateString,
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
            largePointChartOptions: {
                chart: {
                    type: 'line',
                    zoomType: 'x',
                },
                title: {
                    text: 'PulseRate',
                    align: 'left'
                },
                xAxis: {
                    type: 'datetime',
                    min: initialRealTimeMinDateTime,
                    max: initialRealTimeMaxDateTime,
                    tickInterval: 3600 * 1000,
                },
                yAxis: {
                    title: {
                        text: 'Pulse'
                    },
                    min: 0,
                    tickInterval: 25,
                },
                legend: {
                    enabled: false
                },
                time: {
                    timezone: TIME_ZONE
                },
                series: [{
                    name: 'Pulse',
                    data: realTimeData.data.map(([x, y]) => [toUTCDate(x), y]),
                }]
            }
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
                <highcharts :options="largePointChartOptions"></highcharts>
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
