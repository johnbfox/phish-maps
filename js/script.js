var cumulativeEnabled = true,
    regionsYear = '2016',
    chartDiv = '<div id="geoChart"></div>';

$(document).ready(function(){
  init();
});

function init(){
  intializeGeoChart();
  $('#playButton').click(function(){
    $('#geoChart').hide();
    $('#geoChart').addClass('pull-up');
    $('#geoChartOverlay').hide();
    $('#geoSection').hide();
    $('#heroSection').hide();
    $('#startButtons').hide();
    $('#playSection').show();
    $('#geoChart').css('z-index', 2);
    $('#playContainer').html(chartDiv);
    $('#geoChart').show();
    resetMap();
  });

  $('#slider').on('change', function(){
    regionsYear = $('#slider').val();
    resetMap();
  });

  $('#slider').on('input', function(){
    $('#year').html($('#slider').val());
  });

  $('#cumulativeCheckbox').change(function(){
    cumulativeEnabled = !cumulativeEnabled;
    resetMap();
  });


  $("#githubButton").click(function(){
    window.location.href = "https://github.com/johnbfox/phish-maps";
  });

  $(window).resize(function(){
    resetMap();
  });
}

function resetMap(){
  mapForYear(regionsYear)();
}



function intializeGeoChart(){
  google.charts.load('current', {'packages':['geochart']});
  google.charts.setOnLoadCallback(mapForYear(regionsYear));
}

function mapForYear(year){
  var drawRegionsMap = function() {
    var url= '/phish-api/showStateCountCum'

    if(!cumulativeEnabled){
      url = '/phish-api/showStateCount';
    }

    url = url + '/' + year;

    $.ajax({
      url: url,
      context: document.body
    }).done(function(response) {
      let results = response.data.results,
                    parsedResults = [],
                    headerItem = [];
      headerItem[0] = 'State';
      headerItem[1] = 'Shows';

      let max = -1;
      let min = 500000000;
      let total = 0;

      parsedResults.push(headerItem);

      for(var i = 0; i < results.length; i++){
        if(results[i].state.length > 0){
          let arrObj = [];
          arrObj[0] = "US-" + results[i].state;
          arrObj[1] = results[i].count;
          if(arrObj[1] < min){
            min = arrObj[1];
          }

          if(arrObj[1] > max){
            max = arrObj[1];
          }
          total += arrObj[1];
          if(results[i].state.length > 0){
            parsedResults.push(arrObj);
          }
        }
      }
      const avg = total/parsedResults.length;
      let colorVals = null;
      if(avg > min && avg < max){
        colorVals = [min, avg, max];
      }


      var data = google.visualization.arrayToDataTable(parsedResults);

      var options = {
        region: 'US',
        colorAxis: {
          colors: [ '#ffffbc', "#FFA500", "#e60000"],
          values: colorVals
        },
        resolution: "provinces"
      };

      var chart = new google.visualization.GeoChart(document.getElementById('geoChart'));

      chart.draw(data, options);
    });
  };

  return drawRegionsMap;
}
