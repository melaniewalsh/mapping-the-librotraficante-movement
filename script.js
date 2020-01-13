var imageContainerMargin = 80;  // Margin + padding

// This watches for the scrollable container
var scrollPosition = 0;
$('div#contents').scroll(function() {
  scrollPosition = $(this).scrollTop();
});

function initMap() {

  // This creates the Leaflet map with a generic start point, because code at bottom automatically fits bounds to all markers
  var map = L.map('map', {
    center: [0, 0],
    zoom: 4,
    scrollWheelZoom: true,
    zoomControl: false
  });
  
  L.control.zoom({
       position:'bottomleft'
  }).addTo(map);

  // This displays a base layer map (other options available)
 /*  var lightAll = new L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
  }).addTo(map);
   */
 /*  var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    */
    
    L.esri.basemapLayer('Streets').addTo(map);


  // This customizes link to view source code; add your own GitHub repository
  map.attributionControl
  .setPrefix('View <a href="http://github.com/jackdougherty/leaflet-storymap" target="_blank">code on GitHub</a>, created with <a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>');

  // This loads the GeoJSON map data file from a local folder
  $.getJSON('map.geojson', function(data) {
    var geojson = L.geoJson(data, {
      onEachFeature: function (feature, layer) {
        (function(layer, properties) {
          // This creates numerical icons to match the ID numbers
          // OR remove the next 6 lines for default blue Leaflet markers
          var numericMarker = L.ExtraMarkers.icon({
            icon: 'fa-number',
            number: feature.properties['id'],
            markerColor: 'blue'
          });
          layer.setIcon(numericMarker);

          // This creates the contents of each chapter from the GeoJSON data. Unwanted items can be removed, and new ones can be added
          
          var number = $('<p></p>', {
            text: feature.properties['number'],
            class: 'number'
          });
          
          var date = $('<p></p>', {
            text: feature.properties['date'],
            class: 'date'
          });
          
          var chapter = $('<p></p>', {
            text: feature.properties['chapter'],
            class: 'chapter-header'
          });
          
          var city = $('<p></p>', {
            text: feature.properties['city'],
            class: 'city'
          });
          
          var place = $('<p></p>', {
            text: feature.properties['place'],
            class: 'place'
          });

          var image = $('<img>', {
            alt: feature.properties['alt'],
            src: feature.properties['image']
          });

          var source = $('<a>', {
            text: feature.properties['source-credit'],
            href: feature.properties['source-link'],
            target: "_blank",
            class: 'source'
          });

          var description = $('<p></p>', {
            text: feature.properties['description'],
            class: 'description'
          });

          var container = $('<div></div>', {
            id: 'container' + feature.properties['id'],
            class: 'image-container'
          });
          
    /*      var video2 = $('<div></div>', {
            id: 'player',
          });*/
          
          var video =  $('<iframe></iframe>', {
            src: feature.properties['video'],
            width: "100%",
            height: "315",
            frameborder: "0",
          });
          
          var tweet = $('<div></div>', {
            id: 'container',
          });
              
          var imgHolder = $('<div></div', {
            class: 'img-holder'
          });
          
          imgHolder.append(image);
          

          
        //  if (feature.properties['isImage'] == 'True') {
          //    container.append(number).append(chapter).append(date).append(imgHolder).append(source).append(description)
          //  } else if (feature.properties['isVideo'] == 'True') {
          //    container.append(number).append(chapter).append(date).append(video2).append(source).append(description)
          //  }
            //
            if (feature.properties['isVideo'] == 'True') {
              container.append(number).append(chapter).append(city).append(place).append(date).append(tweet).append(video).append(description)
              
            } else  {  container.append(number).append(chapter).append(city).append(place).append(date).append(imgHolder).append(source).append(description)
              }      
                
        //  container.append(number).append(chapter).append(date).append(video2).append(imgHolder).append(source).append(description);
          $('#contents').append(container);
          


          var i;
          var areaTop = -100;
          if( /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
          var areaTop = 0;
          }
          
          var areaBottom = 0;

          // Calculating total height of blocks above active
          for (i = 1; i < feature.properties['id']; i++) {
            areaTop += $('div#container' + i).height() + imageContainerMargin;
          }

          areaBottom = areaTop + $('div#container' + feature.properties['id']).height();

          $('div#contents').scroll(function() {
            if ($(this).scrollTop() >= areaTop && $(this).scrollTop() < areaBottom) {
              $('.image-container').removeClass("inFocus").addClass("outFocus");
              $('div#container' + feature.properties['id']).addClass("inFocus").removeClass("outFocus");

              map.flyTo([feature.geometry.coordinates[1], feature.geometry.coordinates[0] ], feature.properties['zoom']);
            }
          });

          // Make markers clickable
          layer.on('click', function() {
            $("div#contents").animate({scrollTop: areaTop + 50 + "px"});
          });

        })(layer, feature.properties);
      }
    });

    $('div#container1').addClass("inFocus");
    $('#contents').append("<div class='space-at-the-bottom'><a href='#space-at-the-top'><i class='fa fa-chevron-up'></i></br>Top</a></div>");
    map.fitBounds(geojson.getBounds());
    geojson.addTo(map);
    map.setZoom(map.getZoom() - 0);
  });
}

initMap();


