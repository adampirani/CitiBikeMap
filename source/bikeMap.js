(function() {
  "use strict";
var map;
var directionsDisplay;
var directionsService;
var stepDisplay;
var markerArray = [];

function initialize() {
  // Instantiate a directions service.
  directionsService = new google.maps.DirectionsService();

  // Create a map and center it on the East River.
  var eastRiver = new google.maps.LatLng(40.7234205, -73.9730403);
  
  var mapOptions = {
    zoom: 13,
    center: eastRiver,
  }
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  // Create a renderer for directions and bind it to the map.
  var rendererOptions = {
    map: map
  }
  directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions)

  // Instantiate an info window to hold step text.
  stepDisplay = new google.maps.InfoWindow();
  
  var startPoint = new google.maps.LatLng(40.73524276, -73.98758561);
  var endPoint   = new google.maps.LatLng(40.75044999, -73.99481051);
  
  calcRoute(startPoint, endPoint);
}

function calcRoute(start, end) {

  // First, remove any existing markers from the map.
  for (var i = 0; i < markerArray.length; i++) {
    markerArray[i].setMap(null);
  }

  // Now, clear the array itself.
  markerArray = [];

  // Create a DirectionsRequest using BICYCLING directions.
  var request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.BICYCLING
  };

  // Route the directions and pass the response to a
  // function to create markers for each step.
  directionsService.route(request, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      var warnings = document.getElementById('warnings_panel');
      warnings.innerHTML = '<b>' + response.routes[0].warnings + '</b>';
      //directionsDisplay.setDirections(response);
      showSteps(response);
    }
  });
}

function showSteps(directionResult) {
  // For each step, place a marker, and add the text to the marker's
  // info window. Also attach the marker to an array so we
  // can keep track of it and remove it when calculating new
  // routes.
  var myRoute = directionResult.routes[0].legs[0];

  for (var i = 0; i < myRoute.steps.length; i++) {
    var marker = new google.maps.Marker({
      position: myRoute.steps[i].start_location,
      map: map
    });
    //attachInstructionText(marker, myRoute.steps[i].instructions);
    markerArray[i] = marker;
  }
}

// function attachInstructionText(marker, text) {
//   google.maps.event.addListener(marker, 'click', function() {
//     // Open an info window when the marker is clicked on,
//     // containing the text of the step.
//     stepDisplay.setContent(text);
//     stepDisplay.open(map, marker);
//   });
// }

google.maps.event.addDomListener(window, 'load', initialize);
})();