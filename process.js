
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

    var Stamen_Toner = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
	     attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
	      subdomains: 'abcd',
	       minZoom: 0,
	        maxZoom: 20,
	         ext: 'png'
});

    var baseLayers = {
        "Satellite": Esri_WorldImagery,
        "Grey ": Esri_DarkGreyCanvas,
        "Black" : Stamen_Toner
    };

    var map = L.map('map', {
        layers: [ Esri_WorldImagery ],
        minZoom : 3,
        worldCopyJump: true,
        inertia: false
    });

    var layerControl = L.control.layers(baseLayers);
    layerControl.addTo(map);
  map.setView([40, -20], 4);

    L.control.mousePosition().addTo(map);

    var credctrl = L.controlCredits({
        	image: "dist/lops.png",
        	link: "http://www.umr-lops.fr/",
        	text: "<center><b>Laboratoire<br>d'Oceanographie<br>Physique<br>et Spatiale<br>IFREMER 2017</b></center>",
          width: 96,
          height: 88
        }).addTo(map);

    return {
        map: map,
        layerControl: layerControl
    };
}

// map creation
var mapStuff = initDemoMap();
var map = mapStuff.map;
var layerControl = mapStuff.layerControl;

// AVISO
$.getJSON('data/aviso.json', function (data) {

	var velocityLayer1 = L.velocityLayer({
		displayValues: true,
		displayOptions: {
      velocityType : 'Aviso Surface currents',
			displayPosition: 'bottomleft',
			displayEmptyString: 'No current data'
		},
		data: data,
		maxVelocity: 1,
    velocityScale: 0.3
	});
	layerControl.addOverlay(velocityLayer1, 'Aviso '+WDate);
});

// AVISO MDT
$.getJSON('data/aviso_mdt.json', function (data) {

	var velocityLayer2 = L.velocityLayer({
		displayValues: true,
		displayOptions: {
      velocityType : 'Aviso Surface currents',
			displayPosition: 'bottomleft',
			displayEmptyString: 'No current data'
		},
		data: data,
		maxVelocity: 1,
    velocityScale: 0.3
	});
	layerControl.addOverlay(velocityLayer2, 'Aviso mdt2013');
});

//ARGO
ico1 = {iconShape: 'circle-dot', borderWidth: 4, borderColor: '#fdfe02'};
ico2 = {iconShape: 'circle-dot', borderWidth: 4, borderColor: '#ffffff'};

var mapdata=Data_ARGO;
var argomarkers = L.layerGroup();
for (var i = 0; i < mapdata.length; i++)
    {
    if(mapdata[i].Institution == 'IF') {
      var marker = L.marker([mapdata[i].latitude,mapdata[i].longitude],{title: mapdata[i].Platform,icon: L.BeautifyIcon.icon(ico1)});
      marker.bindPopup(mapdata[i].Platform + "<br><b>Type </b>: " + mapdata[i].mtype + "<br><b>Profile date </b>: " + mapdata[i].Time + "<br><b>DAC </b>: " + mapdata[i].Institution + "<br><a href=\"http://www.ifremer.fr/co-argoFloats/float?ptfCode=" + mapdata[i].Platform + "\" target=\"_blank\" > Argo Float Coriolis Page</a>");
    }
    else {
      var marker = L.marker([mapdata[i].latitude,mapdata[i].longitude],{title: mapdata[i].Platform,icon: L.BeautifyIcon.icon(ico2)});
      marker.bindPopup(mapdata[i].Platform + "<br><b>Type </b>: " + mapdata[i].mtype + "<br><b>Profile date </b>: " + mapdata[i].Time + "<br><b>DAC </b>: " + mapdata[i].Institution + "<br><a href=\"http://www.ifremer.fr/co-argoFloats/float?ptfCode=" + mapdata[i].Platform + "\" target=\"_blank\" > Argo Float Coriolis Page</a>");
         }
    marker.addTo(argomarkers);
    };

layerControl.addOverlay(argomarkers, 'Argo '+WDate);

//ARGO7
var mapdata2=Data_ARGO7;
var argomarkers2 = L.layerGroup();
for (var i = 0; i < mapdata2.length; i++)
    {
    if(mapdata2[i].Institution == 'IF') {
      var marker = L.marker([mapdata2[i].latitude,mapdata2[i].longitude],{title: mapdata2[i].Platform,icon: L.BeautifyIcon.icon(ico1)});
      marker.bindPopup(mapdata2[i].Platform + "<br><b>Type </b>: " + mapdata2[i].mtype + "<br><b>Profile date </b>: " + mapdata2[i].Time + "<br><b>DAC </b>: " + mapdata2[i].Institution + "<br><a href=\"http://www.ifremer.fr/co-argoFloats/float?ptfCode=" + mapdata2[i].Platform + "\" target=\"_blank\" > Argo Float Coriolis Page</a>");
    }
    else {
      var marker = L.marker([mapdata2[i].latitude,mapdata2[i].longitude],{title: mapdata2[i].Platform,icon: L.BeautifyIcon.icon(ico2)});
      marker.bindPopup(mapdata2[i].Platform + "<br><b>Type </b>: " + mapdata2[i].mtype + "<br><b>Profile date </b>: " + mapdata2[i].Time + "<br><b>DAC </b>: " + mapdata2[i].Institution + "<br><a href=\"http://www.ifremer.fr/co-argoFloats/float?ptfCode=" + mapdata2[i].Platform + "\" target=\"_blank\" > Argo Float Coriolis Page</a>");
         }
    marker.addTo(argomarkers2);
    };

layerControl.addOverlay(argomarkers2, 'Argo 7 last days');
map.addLayer(argomarkers2);

// ANDRO
$.getJSON('data/andro_gm.json', function (data) {

	var velocityLayer3 = L.velocityLayer({
		displayValues: true,
		displayOptions: {
      velocityType : 'Andro deep velocity',
			displayPosition: 'bottomleft',
			displayEmptyString: 'No velocity data'
		},
		data: data,
		maxVelocity: 1,
    velocityScale: 0.3
	});
	layerControl.addOverlay(velocityLayer3, 'Andro deep velocity');
  map.addLayer(velocityLayer3); //Default display when page loads
});

map.on({
    overlayadd: function(e) {
        a=map.getCenter();
        map.panTo([a.lat+0.01,a.lng+0.01]);
    }
});
