var myChart2, responseDataChart2, color;
try{
  color = colors;
} catch (e) {
  color = ["#b1063a", "#de6212", "#000000", "#ffffff", "#1b7700"];
}

function showChart2(onACanvas, withTitle) {
  showChart2(onACanvas, withTitle, null, null, false);
}
function showChart2(onACanvas, withTitle, start, end, fields) {
  var ctx = document.getElementById(onACanvas).getContext("2d");
  myChart2 = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Lade Daten"],
      datasets: [
        {
          data: [],
          backgroundColor: [
            color[0],
            color[1],
            color[0],
            color[1],
            color[0],
            color[1],
            color[0],
            color[1],
            color[0],
            color[1]
          ]
        }
      ]
    },
    options: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: withTitle,
        fontSize: 32
      },
      scales: {
        yAxes: [
          {
            ticks: {
              min: 0,
              max: 0,
              stepSize: 1
            },
            scaleLabel: {
              display: true,
              labelString: "Gesamtinteraktionen",
              fontSize: 24
            }
          }
        ],
        xAxes: [
          {
            gridLines: {
              offsetGridLines: true
            },
            ticks: {
              autoSkip: false
            },
            scaleLabel: {
              display: true,
              labelString: "Namen der Kurse",
              fontSize: 24
            }
          }
        ]
      },
      tooltips: {
        callbacks: {
          title: function(tooltipItem, data) {
            return data["labels"][tooltipItem[0]["index"]];
          },
          label: function(tooltipItem, data) {
            var respObj = responseDataChart2[tooltipItem["index"]];
            var labelArr = [];
            labelArr.push("Downloads: " + respObj.download);
            labelArr.push("Browse: " + respObj.browse);
            labelArr.push("Subscriptions: " + respObj.subscribe);
            labelArr.push("Streams: " + respObj.stream);
            labelArr.push("AutoDownloads: " + respObj.auto_download);
            return labelArr;
          }
        },
        displayColors: false
      }
    }
  });
  loadDataForChart2(myChart2, start, end, fields);
}

function loadDataForChart2(myChart2, start, end, fields) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      updateChart2(JSON.parse(this.responseText));
    }
  };

  if (!fields) {
    //load defaults
    fields = ["download", "browse", "subscribe", "stream", "auto_download"];
  }
  var url =
    "/maxInteractionsInInterval?fields=" + fields.join(",") + "&limit=10";
  if (start) url += "&startDate=" + start;
  if (end) url += "&endDate=" + end;
  xhttp.open("GET", url, true);
  xhttp.send();
}

function updateChart2(responseData) {
  responseDataChart2 = responseData;
  var labels = [];
  var data = [];
  var maximum = 0;

  if (responseData.length == 0) {
    myChart2.options.scales.yAxes[0].ticks.max = 0;
    myChart2.options.scales.yAxes[0].ticks.stepSize = 1;
    myChart2.data.labels = ["Keine Daten vorhanden!"];
    myChart2.data.datasets[0].data = [];
    myChart2.update();
    return;
  }

  responseData.forEach(function(item) {
    labels.push(item.title);
    data.push(item.sum);
    if (item.sum > maximum) maximum = item.sum;
  });
  var maxYAxe = Math.ceil(maximum / 100) * 100;
  var tickRate = Math.ceil(maxYAxe / 4000) * 200;
  maxYAxe = Math.ceil(maximum / tickRate) * tickRate;

  myChart2.options.scales.yAxes[0].ticks.max = maxYAxe;
  myChart2.options.scales.yAxes[0].ticks.stepSize = tickRate;

  myChart2.data.labels = labels;
  myChart2.data.datasets[0].data = data;
  myChart2.update();
}
