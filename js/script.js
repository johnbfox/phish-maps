var regionsMode = '0',
    regionsYear = '1983';

$(document).ready(function(){
  init();
});

function init(){
  intializeGeoChart();
  $('#playButton').click(function(){
    $('#geoChart').hide();
    $('#geoChart').css('margin-top', 0);
    $('#geoChartOverlay').hide();
    $('#geoSection').hide();
    $('#heroSection').hide();
    $('#startButtons').hide();
    $('#playSection').show();
    $('#geoChart').css('z-index', 2);
    $('#geoChart').show();
    drawRegionsMap();
  });

  $('#githubButton').click(function(){
     window.location.href='https://github.com/johnbfox/phish-maps';
  })
  $('input[name=regionsRadios]').change(function(){
    resetMap();
  });

  $('#cumulative-checkbox').change(function(){
    resetMap();
  });

  $("#regions-year-select").change(function(){
    regionsYear = $("#regions-year-select").val();
    resetMap();
  });
}

function resetMap(){
  var value = $( 'input[name=regionsRadios]:checked' ).val();
  regionsMode = value;
  if(value === "1"){
    $("#regions-year-select").prop('disabled', false);
    $("#cumulative-checkbox").prop('disabled', false);
    if($("#cumulative-checkbox").prop('checked')){
      $("#chartTitle").html("Played between 1983 and " + regionsYear);
    }
    else{
      $("#chartTitle").html('Played in ' + regionsYear);
    }
  }else{
    $("#regions-year-select").prop('disabled', true);
    $("#cumulative-checkbox").prop('disabled', true);
    $("#chartTitle").html("Career shows");
  }
  drawRegionsMap();
}



function intializeGeoChart(){
  google.charts.load('current', {'packages':['geochart']});
  google.charts.setOnLoadCallback(drawRegionsMap);
}

function drawRegionsMap(mode) {
  var url = 'MASKED URL';
  if( $('#cumulative-checkbox').prop('checked') && regionsMode === "1"){
    url = 'MASKED URL';
  }

  if(regionsMode === '1'){
    url = url + '/' + regionsYear;
  }
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
}
