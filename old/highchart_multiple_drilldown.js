$(function () {
    // Create the chart
    $('#v_usage_stats_api_data').highcharts({
        chart: {
            type: 'column'
        },
        xAxis: {
            type: 'category'
        },
        series: [{
            data: [{
                name: 'Microsoft Internet Explorer',
                y: 56.33,
                drilldown: 'Microsoft Internet Explorer'
            }, {
                name: 'Chrome',
                y: 24.03,
                drilldown: 'Chrome'
            }]
        }],
        drilldown: {
            series: [{
                name: 'Microsoft Internet Explorer',
                id: 'Microsoft Internet Explorer',
                data: [{
                    name: 'M1',
                    y: 22,
                    drilldown: 'M1'
                }]
            }, {
                name: 'Chrome',
                id: 'Chrome',
                data: [
                    [
                        'v40.0',
                    5]
                ]
            }, {
                id: 'M1',
                data: [
                    [
                        'v8.0',
                    17.2],
                    [
                        '1.0',
                    25.2]
                ]
            }]
        }
    });
});