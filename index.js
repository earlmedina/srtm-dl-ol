import 'ol/ol.css';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import Polygon from 'ol/geom/Polygon.js';
import Feature from 'ol/Feature.js';
import Draw, {createRegularPolygon, createBox} from 'ol/interaction/Draw.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';

var raster = new TileLayer({
  source: new OSM()
});

var source = new VectorSource({wrapX: false});

var vector = new VectorLayer({
  source: source
});

var map = new Map({
  layers: [raster, vector],
  target: 'map',
  view: new View({
    projection: 'EPSG:4326',
    center: [-98.583333,39.833333],
    //center: [-11000000, 4600000],
    zoom: 4
  })
});


var draw; // global so we can remove it later
function addInteraction() {
  var value = 'Circle';
  var geometryFunction = createBox();
  draw = new Draw({
    source: source,
    type: value,
    geometryFunction: geometryFunction
  });

  draw.on('drawend', function (event) {
      var feature = event.feature.getGeometry();
      var coords = feature.getCoordinates();
      console.log(coords[0]);


      $('body').addClass("loading"); 
      var jqXHR = $.ajax({
        url: "/background_process",
        type: "POST",
        data: JSON.stringify(coords),
        contentType: 'application/json;charset=UTF-8',
      }).done(function (response, status, jqXHR) {
        //window.location = response;
        console.log(response);
      }).fail(function (jqXHR, status, err) {
        // alert("Request Failed.");
         //map.removeInteraction(draw);
      }).always(function () {
        $('body').removeClass("loading");
      });


  });
  map.addInteraction(draw);
}

addInteraction();




$( "#target" ).click(function() {
  map.removeLayer(vector);
    // $.ajax({
    //     type: "POST",
    //     url : '/background_process',
    //     data: JSON.stringify(coords),
    //     contentType: 'application/json;charset=UTF-8',
    //     success: function(response){
    //       $('#main').text(response)
    //       window.location = response;
    //     } 
    // });
});
