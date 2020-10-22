$(function () {
    var chart;
    $(document).ready(function () {
        var colors = Highcharts.getOptions().colors,
            categories1 = ['1011', '1112', '1213', '1415'],
            name1 = 'Actual',
            data1 = [{
                y: 1674,
                color: colors[0],
                drilldown: {
                    name: '1011 Actual',
                    categories: ['BS', 'B', 'IT', 'C'],
                    data: [3, 32, 54, 50],
                    color: colors[0],
                    name1: '1011 Target',
                    data1: [0, 31, 50, 60],
                    color1:colors[1]
                }
            }];            
        var colors = Highcharts.getOptions().colors,
            categories2 = ['1011', '1112', '1213', '1415'],
            name2 = 'Target',
            data2 = [{
                y: 1633,
                color: colors[1],
                drilldown: {
                    name: '1011 Actual',
                    categories: ['BS', 'B', 'IT', 'C'],
                    data: [3, 32, 54, 50],
                    color: colors[0],
                    name1: '1011 Target',
                    data1: [0, 31, 50, 60],
                    color1:colors[1]
                }
            }];
        function setChart(name, categories, data, color) {
            console.log(name, categories, data, color);
            chart.xAxis[0].setCategories(categories);
            while (chart.series.length > 0) {
                chart.series[0].remove(true);
            }
            for (var i = 0; i < data.length; i++) {
                chart.addSeries({
                    name: name[i],
                    data: data[i],
                    color: color[i]
                });

            }
        }
        chart = new Highcharts.Chart({
            chart: {
                renderTo: 'v_usage_stats_api_data',
                type: 'column'
            },
            title: {
                text: 'Learner Responsive 16-18'
            },
            subtitle: {
                text: 'Click the columns to view breakdown by department. Click again to view by Academic Year.'
            },
            xAxis: {
                categories: categories1
                , labels: {rotation:-90, align:'right'}
            },
            yAxis: {
                title: {
                    text: 'Learner Responsive 16-18'
                }
            },
            plotOptions: {
                column: {
                    cursor: 'pointer',
                    point: {
                        events: {
                            click: function () {
                                var drilldown = this.drilldown;
                                if (drilldown) { // drill down
                                    setChart([drilldown.name,drilldown.name1], drilldown.categories, [drilldown.data, drilldown.data1], [drilldown.color,drilldown.color1]);
                                } else { // restore
                                    setChart(name, categories1, [data1, data2], 'white');
                                }
                            }
                        }
                    },
                    dataLabels: {
                        enabled: true,
                        color: colors[0],
                        style: {
                            fontWeight: 'bold'
                        },
                        formatter: function () {
                            return this.y; // +'%';
                        }
                    }
                }
            },
            tooltip: {
                formatter: function () {
                    var point = this.point,
                        series = point.series,
                        s = 'Learner Responsive 16-18' + '<br/>' + this.x + ' ' + series.name + ' is <b>' + this.y + '</b><br/>';
                    if (point.drilldown) {
                        s += 'Click to view <b>' + point.category + ' ' + series.name + ' </b>' + ' by department';
                    } else {
                        s += 'Click to return to view by academic year.';
                    }
                    return s;
                }
            },
            series: [{
                name: name1,
                data: data1,
                color: colors[0]
            },{
                name: name2,
                data: data2,
                color: colors[1]
            }],
            exporting: {
                enabled: false
            }
        },
        function (chart) {
            console.log(chart);
        });
    });
});