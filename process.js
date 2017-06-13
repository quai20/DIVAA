
function initDemoMap(){

    var Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, ' +
        'AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    var Esri_DarkGreyCanvas = L.tileLayer(
        "http://{s}.sm.mapstack.stamen.com/" +
        "(toner-lite,$fff[difference],$fff[@23],$fff[hsl-saturation@20])/" +
        "{z}/{x}/{y}.png",
        {
            attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, ' +
            'NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
        }
    );

    var baseLayers = {
        "Satellite": Esri_WorldImagery,
        "Grey Canvas": Esri_DarkGreyCanvas
    };

    var map = L.map('map', {
        layers: [ Esri_WorldImagery ]
    });

    var layerControl = L.control.layers(baseLayers);
    layerControl.addTo(map);
  map.setView([40, -20], 4);

    L.control.mousePosition().addTo(map);

    return {
        map: map,
        layerControl: layerControl
    };
}

// demo map
var mapStuff = initDemoMap();
var map = mapStuff.map;
var layerControl = mapStuff.layerControl;

// AVISO
$.getJSON('data/aviso.json', function (data) {

	var velocityLayer = L.velocityLayer({
		displayValues: true,
		displayOptions: {
      velocityType : 'Aviso Surface currents',
			displayPosition: 'bottomleft',
			displayEmptyString: 'No current data'
		},
		data: data,
		maxVelocity: 1,
    velocityScale: 0.2
	});
	layerControl.addOverlay(velocityLayer, 'Aviso surface currents');
});

//ARGO
var cssic0 = L.divIcon({className: 'mico0', iconsize: [5, 5]});
var cssic1 = L.divIcon({className: 'mico1', iconsize: [5, 5]});

var mapdata=Data_ARGO;
var argomarkers = L.layerGroup();
for (var i = 0; i < mapdata.length; i++)
    {
    if(mapdata[i].Institution == 'IF') {
      var marker = L.marker([mapdata[i].latitude,mapdata[i].longitude],{title: mapdata[i].Platform,icon: cssic1});
      marker.bindPopup(mapdata[i].Platform + "<br><b>Type </b>: " + mapdata[i].mtype + "<br><b>Profile date </b>: " + mapdata[i].Time + "<br><b>DAC </b>: " + mapdata[i].Institution + "<br><a href=\"http://www.ifremer.fr/co-argoFloats/float?ptfCode=" + mapdata[i].Platform + "\" target=\"_blank\" > Argo Float Coriolis Page</a>");
    }
    else {
      var marker = L.marker([mapdata[i].latitude,mapdata[i].longitude],{title: mapdata[i].Platform,icon: cssic0});
      marker.bindPopup(mapdata[i].Platform + "<br><b>Type </b>: " + mapdata[i].mtype + "<br><b>Profile date </b>: " + mapdata[i].Time + "<br><b>DAC </b>: " + mapdata[i].Institution + "<br><a href=\"http://www.ifremer.fr/co-argoFloats/float?ptfCode=" + mapdata[i].Platform + "\" target=\"_blank\" > Argo Float Coriolis Page</a>");
         }
    marker.addTo(argomarkers);
    };
layerControl.addOverlay(argomarkers, 'Argo profiles');

//ISAS
// var heat = L.heatLayer(isas_data,{
//       minOpacity : 0.1,
//       radius: 50,
//       blur: 60,
//       maxZoom: 10,
//       max: 60.0,
//
//       gradient: {
//           0.05 : 'blue',
//           0.1 : 'green',
//           0.15 : 'yellow',
//           0.20 : 'orange',
//           0.25 : 'red'
//
//       }
//   });
// layerControl.addOverlay(heat, 'ISAS Field');
