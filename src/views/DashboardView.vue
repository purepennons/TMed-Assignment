<script>
import useTimeData from '@/data/use_time.json'

export default {
    name: 'DashboardView',
    data() {
        return {
            chartOptions: {
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
                    verticalAlign: 'top',
                },
                series: [
                    {
                        name: 'USETIME(h)',
                        data: useTimeData.data
                    }
                ]
            }
        }
    }
}
</script>

<template>
    <div class="container">
        <div class="row">
            <nav class="col-sm-6 col-lg-4">nav</nav>
            <main class="col-sm-6 col-lg-8">
                main
                <highcharts :options="chartOptions"></highcharts>
            </main>
        </div>
    </div>
</template>

<style lang="scss" scoped>
nav {
    height: 200px;
    background: yellow;
}

main {
    background: tomato;
}
</style>
