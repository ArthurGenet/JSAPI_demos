define(["app/config", "app/utils", "app/statistics", "app/main"], function (config, appUtils, statistics,main) {
  Chart.defaults.global.defaultFontFamily = `"Avenir Next W00","Helvetica Neue",Helvetica,Arial,sans-serif`;
  Chart.defaults.global.defaultFontSize = 12;

  var def_expression_date = "1=1 ";
  var def_expression_height = "AND 1=1 ";
  var def_expression_usage = "AND 1=1";

  var click_year = false;
  var click_height = false;
  var click_usage = false;
   
  const yearCanvas = document.getElementById("yearChart");
  const usageCanvas = document.getElementById("usageChart");
  const heightCanvas = document.getElementById("heightChart");

  function createYearChart() {
    const yearChart = new Chart(yearCanvas.getContext("2d"), {
      type: "bar",
      data: {
        labels: config.yearClasses.map(function (element) { return element.label }),
        datasets: [
          {
            label: "Gebouwde gebouwen",
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
          text: "Aantal gebouwen per bouwjaar"
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
      yearCanvas.onclick = function(evt)

    {   
      if (click_year == false){

        click_year = true;
        var activePoints = yearChart.getElementsAtEvent(evt);
        var clickedElementindex = activePoints[0]["_index"];
        var label = yearChart.data.labels[clickedElementindex];
        var dates = label.split(" ");
        
        
        if (dates[2] != null) {
          var start_date = dates[0];
          var end_date = dates[2];
          def_expression_date = "Bouwjaar >= " + start_date + " AND Bouwjaar < " + end_date + " ";
        }
        else {
          var date = dates[0].substring(dates[0].lastIndexOf("<") + 1, dates[0].length);
          def_expression_date = "Bouwjaar < " + date + " ";
        }
      }
        
      else{
        click_year = false;
        def_expression_date = "1=1 ";
      }
      

      defExpression(def_expression_date,def_expression_height,def_expression_usage);  
    }
  
    return yearChart;
  }
  function createHeightChart() {
    
    const heightBins = appUtils.heightBins;
    const heightChart =  new Chart(heightCanvas.getContext("2d"), {
      type: "horizontalBar",
      data: {
        labels: heightBins.map(function (element) { return element.label }),
        datasets: [
          {
            label: "Gebouwen met deze hoogte",
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
          text: "Aantal gebouwen op basis van hoogte"
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

    heightCanvas.onclick = function(evt)

    {   
      if (click_height == false){

        click_height = true;
        var activePoints = heightChart.getElementsAtEvent(evt);
        var clickedElementindex = activePoints[0]["_index"];
        var label = heightChart.data.labels[clickedElementindex];
        var heights = label.split(" ");
        
        
        if (heights[2] != null) {
          var start_height = heights[0];
          var end_height = heights[2].substring(0, heights[2].lastIndexOf("m"));

          def_expression_height = "AND Pandhoogte >= " + start_height + " AND Pandhoogte < " + end_height + " ";
        }

        else {
          var height = heights[1].substring(0, heights[1].lastIndexOf("m"));
          def_expression_height = "AND Pandhoogte " + heights[0] + " " + height + " ";
        }
          
        
      }
        
      else{
        click_height = false;
        def_expression_height = "AND 1=1 ";
      }
      

      defExpression(def_expression_date,def_expression_height,def_expression_usage);  
    }
    return heightChart;
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
        responsive: false,
        cutoutPercentage: 35,
        legend: {
          display: false,
          position: "bottom"
        },
        title: {
          display: true,
          text: "Gebruiksfunctie gebouw"
        }
      }
    });

    usageCanvas.onclick = function(evt)

    {   
      if (click_usage == false){

        click_usage = true;
        var activePoints = usageChart.getElementsAtEvent(evt);
        var clickedElementindex = activePoints[0]["_index"];
        var label = usageChart.data.labels[clickedElementindex];

        if (label == "Other"){
          def_expression_usage = "AND Gebruiksfunctie IS NULL ";
        }
        else{
          def_expression_usage = "AND Gebruiksfunctie LIKE '" + label.toLowerCase() + "'";
        }
      }

      else {
        click_usage = false;
        def_expression_usage = "AND 1=1";
      }
      

      defExpression(def_expression_date,def_expression_height,def_expression_usage);  
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
    yearCanvas,
    heightCanvas,
    usageCanvas,
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
