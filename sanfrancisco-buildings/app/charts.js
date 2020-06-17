define(["app/config", "app/utils", "app/statistics"], function (config, appUtils, statistics) {
  var def_expression_date = "1=1 ";
  var def_expression_height = "AND 1=1 ";
  var def_expression_usage = "AND 1=1";
  //var layer = main.bdgLayer;
  //console.log(layer);
  Chart.defaults.global.defaultFontFamily = `"Avenir Next W00","Helvetica Neue",Helvetica,Arial,sans-serif`;
  Chart.defaults.global.defaultFontSize = 12;
  function createYearChart() {
    const yearCanvas = document.getElementById("yearChart");
    const yearChart = new Chart(yearCanvas.getContext("2d"), {
      type: "bar",
      data: {
        labels: config.yearClasses.map(function (element) { return element.label }),
        datasets: [
          {
            label: "Buildings built",
            backgroundColor: config.yearClasses.map(function (element) { return element.color }),
            stack: "Stack 0",
            data: [0, 0, 0, 0, 0, 0]
          }
        ]
      },
      options: {
        responsive: false,
        legend: {
          display: false
        },
        title: {
          display: true,
          text: "Number of buildings by construction year"
        },
        scales: {
          xAxes: [
            {
              stacked: true
            }
          ],
          yAxes: [
            {
              stacked: true,
              ticks: {
                beginAtZero: true,
                precision: 0
              }
            }
          ]
        }
      }
    });
    return yearChart;
  }
  function createHeightChart() {
    const heightCanvas = document.getElementById("heightChart");
    const heightBins = appUtils.heightBins;
    return new Chart(heightCanvas.getContext("2d"), {
      type: "horizontalBar",
      data: {
        labels: heightBins.map(function (element) { return element.label }),
        datasets: [
          {
            label: "Buildings with this height",
            backgroundColor: heightBins.map(function (element) { return element.color }),
            data: [0, 0, 0, 0, 0, 0, 0, 0]
          }
        ]
      },
      options: {
        responsive: false,
        legend: {
          display: false
        },
        title: {
          display: true,
          text: "Number of buildings by height"
        },
        scales: {
          xAxes: [
            {
              stacked: true,
              ticks: {
                beginAtZero: true,
                precision: 0
              }
            }
          ],
          yAxes: [
            {
              stacked: true
            }
          ]
        }
      }
    });
  }

  function createUsageChart() {

    const labels = config.usageValues.map(function (element) {
      return element.label;
    })
    labels.push("Other");

    const backgroundColor = config.usageValues.map(function (element) {
      return element.color;
    });
    backgroundColor.push(config.otherColor);

    const usageCanvas = document.getElementById("usageChart");
    const usageChart = new Chart(usageCanvas.getContext("2d"), {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            backgroundColor: backgroundColor,
            borderWidth: 0,
            data: [0, 0, 0, 0, 0]
          }
        ]
      },
      options: {
        events: ['onClick'],
        responsive: true,
        cutoutPercentage: 35,
        title: {
          display: true,
          text: "Building usage"
        },
        legend:{
          display:false,
          position:'bottom',
          align: 'left',
          labels:{
          fontSize: 9
          }
        }
      },
    });
    usageCanvas.onclick = function(evt)
    {   
        console.log("click");
        var activePoints = usageChart.getElementsAtEvent(evt);


          //get the internal index of slice in pie chart
          var clickedElementindex = activePoints[0]["_index"];
          console.log(clickedElementindex);
          //get specific label by index 
          var label = usageChart.data.labels[clickedElementindex];
          console.log(label);
          //get value by index      
          var value = usageChart.data.datasets[0].data[clickedElementindex];
          console.log(value);
          /* other stuff that requires slice's label and value */
          def_expression_usage = "AND Gebruiskoel LIKE '" + label + "'";
          main.defExpression(def_expression_date,def_expression_height,def_expression_usage);

         
     
  }
    return usageChart;
  }



  const yearChart = createYearChart();
  const heightChart = createHeightChart();
  const usageChart = createUsageChart();
  return {
    yearChart,
    heightChart,
    usageChart,
    updateCharts(result) {
      const allStats = result.features[0].attributes;

      const yearValues = statistics.yearStatDefinitions.map(function (element) {
        return allStats[element.outStatisticFieldName]
      });
      yearChart.data.datasets[0].data = yearValues;
      yearChart.update();

      const heightValues = statistics.heightStatDefinitions.map(function (element) {
        return allStats[element.outStatisticFieldName]
      });
      heightChart.data.datasets[0].data = heightValues;
      heightChart.update();

      const usageValues = statistics.usageStatDefinitions.map(function (element) {
        return allStats[element.outStatisticFieldName]
      });
      usageChart.data.datasets[0].data = usageValues;
      usageChart.update();
    }
  }



});
