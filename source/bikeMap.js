(function() {
  "use strict";
var map;
// var directionsDisplay;
var directionsService;
var stepDisplay;

//TODO: Make a class for route objects
var routes = [];

//each route should have a set of lines
var lines = [];

// var markerArray = [];

//This seems a bit off, maybe I should subscribe to the event here
window.startAnimation = function() {
  var startPoint    = new google.maps.LatLng(40.73524276, -73.98758561);
  var endPoint      = new google.maps.LatLng(40.75044999, -73.99481051);
  var durInSeconds  = 1257;
  
  animateRoute(startPoint, endPoint, durInSeconds);
}

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

  // // Create a renderer for directions and bind it to the map.
  // var rendererOptions = {
  //   map: map
  // }
  // directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions)

  // Instantiate an info window to hold step text.
  stepDisplay = new google.maps.InfoWindow();
}

function animateRoute(start, end, duration) {

  // First, remove any existing markers from the map.
  // for (var i = 0; i < markerArray.length; i++) {
  //   markerArray[i].setMap(null);
  // }

  // Now, clear the array itself.
  // markerArray = [];

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
      showSteps(response, duration);
    }
  });
}

function showSteps(directionResult, duration) {
  // For each step, place a marker, and add the text to the marker's
  // info window. Also attach the marker to an array so we
  // can keep track of it and remove it when calculating new
  // routes.
  var myRoute = directionResult.routes[0].legs[0];
  
  //TODO: Route class
  var routeObj = { 
    lines : [],
    distance: 0,
    duration: duration
   };

  for (var i = 0; i < myRoute.steps.length; i++) {
    var step = myRoute.steps[i];
    var lineObj = {};
    lineObj.lineCoordinates = [
      step.start_location,
      step.end_location
    ];
    lineObj.distance = step.distance;
    routeObj.distance += step.distance;
    routeObj.lines.push(lineObj);
  };
  
  animateRouteObj(routeObj);
    
    // var marker = new google.maps.Marker({
    //   position: myRoute.steps[i].start_location,
    //   map: map
    // });
    // //attachInstructionText(marker, myRoute.steps[i].instructions);
    // markerArray[i] = marker;
}

function animateRouteObj(routeObj) {
  for (var i = 0; i < routeObj.lines.length; ++i) {
    // Define the symbol, using one of the predefined paths ('CIRCLE')
    // supplied by the Google Maps JavaScript API.
    var lineObj = routeObj.lines[i];
    
    
    var lineSymbol = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        strokeColor: '#393'
    };
    
    // Create the polyline and add the symbol to it via the 'icons' property.
    var line = new google.maps.Polyline({
      path: lineObj.lineCoordinates,
      icons: [{
        icon: lineSymbol,
        offset: '100%'
      }],
      map: map
    });
    
    animateCircle(line, lineObj.distance, routeObj.distance);
  }
}


// Use the DOM setInterval() function to change the offset of the symbol
// at fixed intervals.
function animateCircle(line) {
    var count = 0;
    window.setInterval(function() {
      count = (count + 1) % 200;

      var icons = line.get('icons');
      icons[0].offset = (count / 2) + '%';
      line.set('icons', icons);
  }, 20);
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