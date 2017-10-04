
function initDemoMap(){
//BASE TILE LAYER 1
  var Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, ' +
    'AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  });
//BASE TILE LAYER 2
  var Esri_DarkGreyCanvas = L.tileLayer(
    "http://{s}.sm.mapstack.stamen.com/" +
    "(toner-lite,$fff[difference],$fff[@23],$fff[hsl-saturation@20])/" +
    "{z}/{x}/{y}.png",
    {
      attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, ' +
      'NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
    }
  );
//BASE TILE LAYER 3
  var Stamen_Toner = L.tileLayer('http://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.{ext}', {
    attribution: 'Map tiles by Stamen Design, CC BY 3.0 &mdash; Map data &copy; OpenStreetMap',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
  });
//BASE TILE GROUP LAYER
  var baseLayers = {
    "Satellite": Esri_WorldImagery,
    "Grey ": Esri_DarkGreyCanvas,
    "Black" : Stamen_Toner
  };
//MAP STRUCTURE
  var map = L.map('map', {
    layers: [ Esri_WorldImagery ],
    minZoom : 3,
    worldCopyJump: true,
    inertia: false
  });
//MENU CREATION
  var layerControl = L.control.layers(baseLayers);
  layerControl.addTo(map);
  map.setView([40, -42], 4);
//MOUSE POSITION BOTTOM LEFT
  L.control.mousePosition().addTo(map);
//CREDIT FOR LOPS LOGO
//INIT RETURN FUNCTION
  return {
    map: map,
    layerControl: layerControl
  };
}

// MAP CREATION
var mapStuff = initDemoMap();
var map = mapStuff.map;
// MENU
var layerControl = mapStuff.layerControl;
//ICON FOR SELECTED FLOAT
ico0 = {iconShape: 'doughnut', borderWidth: 6, borderColor: '#50f308'};
var curmarker = L.marker([0,0],{icon: L.BeautifyIcon.icon(ico0)});
//TRAJ LAYER, EMPTY AT START
var majaxLayer=L.layerGroup();
map.addLayer(majaxLayer);
//SIDE PANEL
var sidebar = L.control.sidebar('sidebar', {
  closeButton: true,
  position: 'left',
  autoPan: 'off'
});
map.addControl(sidebar);

//DATA LAYERS
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
  htmlName1='<font color="red">Aviso Currents: '+WDate+'</font>'
  layerControl.addOverlay(velocityLayer1, htmlName1);
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
  htmlName2='<font color="red">Aviso mdt2013</font>'
  layerControl.addOverlay(velocityLayer2, htmlName2);
});

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
  htmlName3='<font color="red">Andro deep velocity</font>'
  layerControl.addOverlay(velocityLayer3, htmlName3);
  map.addLayer(velocityLayer3); //Default display when page loads
});

//ARGO DAY
ico1 = {iconShape: 'circle-dot', borderWidth: 6, borderColor: '#fdfe02'};
ico2 = {iconShape: 'circle-dot', borderWidth: 6, borderColor: '#ffffff'};
ico3 = {iconShape: 'circle-dot', borderWidth: 6, borderColor: '#7de0ba'};

var mapdata=Data_ARGO;
var argomarkers = L.layerGroup();
for (var i = 0; i < mapdata.length; i++)
{
  if(mapdata[i].Institution == 'IF') {
    var marker = L.marker([mapdata[i].latitude,mapdata[i].longitude],{title: mapdata[i].Platform,icon: L.BeautifyIcon.icon(ico1)});
  }
  else {
    var marker = L.marker([mapdata[i].latitude,mapdata[i].longitude],{title: mapdata[i].Platform,icon: L.BeautifyIcon.icon(ico2)});
  }
  //ONCLIK, CALL SUBMARKERCLICK FUNCTION (SIDE PANEL + TRAJ)
  marker.on('click',L.bind(SubMarkerClick,null,mapdata[i]));
  marker.addTo(argomarkers);
};
htmlName4='<font color="blue">Argo floats : '+WDate+'</font>'
layerControl.addOverlay(argomarkers, htmlName4);

//ARGO 7 DAYS
var mapdata2=Data_ARGO7;
var argomarkers2 = L.layerGroup();
for (var i = 0; i < mapdata2.length; i++)
{
  if(mapdata2[i].Institution == 'IF') {
    var marker = L.marker([mapdata2[i].latitude,mapdata2[i].longitude],{title: mapdata2[i].Platform,icon: L.BeautifyIcon.icon(ico1)});
  }
  else {
    var marker = L.marker([mapdata2[i].latitude,mapdata2[i].longitude],{title: mapdata2[i].Platform,icon: L.BeautifyIcon.icon(ico2)});
  }
  //ONCLIK, CALL SUBMARKERCLICK FUNCTION (SIDE PANEL + TRAJ)
  marker.on('click',L.bind(SubMarkerClick,null,mapdata2[i]));
  marker.addTo(argomarkers2);
};
htmlName5='<font color="blue">Argo floats : 7 days</font>'
layerControl.addOverlay(argomarkers2, htmlName5);
map.addLayer(argomarkers2);

//ARGO 30 DAYS DEEP
var mapdata3=Data_ARGO30DEEP;
var argomarkers3 = L.layerGroup();
for (var i = 0; i < mapdata3.length; i++)
{
  if(mapdata3[i].Institution == 'IF') {
    var marker = L.marker([mapdata3[i].latitude,mapdata3[i].longitude],{title: mapdata3[i].Platform,icon: L.BeautifyIcon.icon(ico1)});
  }
  else {
    var marker = L.marker([mapdata3[i].latitude,mapdata3[i].longitude],{title: mapdata3[i].Platform,icon: L.BeautifyIcon.icon(ico2)});
  }
  //ONCLIK, CALL SUBMARKERCLICK FUNCTION (SIDE PANEL + TRAJ)
  marker.on('click',L.bind(SubMarkerClick,null,mapdata3[i]));
  marker.addTo(argomarkers3);
};
htmlName6='<font color="blue">Argo Deep floats : 30 days</font>'
layerControl.addOverlay(argomarkers3, htmlName6);

//TRAJ ALREADY PLOTTED, IF insTraj==1 AND CLICK ON TRAJ WE DON'T PLOT THE SAME TRAJECTORY
insTraj=0;
pl='0';

//SIDE PANEL MANAGEMENT
function SubMarkerClick(smarker) {
  //DOUGHNUT MARKER ON THE SELECTED FLOAT
  curmarker.setLatLng([smarker.latitude,smarker.longitude]);
  curmarker.addTo(map);
  //CLEAR ANY EXISTING TRAJECTORIES IF CLICK OUTSIDE THE PLOTTED TRAJECTORY
  if(smarker.Platform!=pl){
  majaxLayer.clearLayers();
  insTraj=0;
  }
  //ERDDAP URLs
  ti=smarker.Time;
  pl=smarker.Platform;
  inst=smarker.Institution;
  tempurl="http://www.ifremer.fr/erddap/tabledap/ArgoFloats.png?temp,pres,psal&time="+ti.substr(0,4)+"-"+ti.substr(4,2)+"-"+ti.substr(6,2)+"T"+ti.substr(8,2)+"%3A"+ti.substr(10,2)+"%3A"+ti.substr(12,2)+"Z&platform_number=%22"+pl+"%22&.draw=linesAndMarkers&.yRange=%7C%7Cfalse";
  psalurl="http://www.ifremer.fr/erddap/tabledap/ArgoFloats.png?psal,pres,temp&time="+ti.substr(0,4)+"-"+ti.substr(4,2)+"-"+ti.substr(6,2)+"T"+ti.substr(8,2)+"%3A"+ti.substr(10,2)+"%3A"+ti.substr(12,2)+"Z&platform_number=%22"+pl+"%22&.draw=linesAndMarkers&.yRange=%7C%7Cfalse";
  trajurl="http://www.ifremer.fr/erddap/tabledap/ArgoFloats.png?longitude,latitude,time&platform_number=%22"+pl+"%22&.draw=linesAndMarkers";

  //Project PI Model ajax
    $.ajax({
    url:"http://www.ifremer.fr/erddap/tabledap/ArgoFloats.json?project_name%2Cpi_name%2Cplatform_type&platform_number=%22"+pl+"%22&distinct()",
    dataType: 'jsonp',
    jsonp: '.jsonp',
    cache: 'true',
    success: function (data) {
          document.getElementById("ajproject").textContent = ("PROJECT : " + data.table.rows[0][0]);
          document.getElementById("ajpi").textContent = ("PI : " + data.table.rows[0][1]);
          document.getElementById("ajmodel").textContent = ("MODEL : " + data.table.rows[0][2]);
    },
    type: 'GET'
    });

  sidebar.setContent("<b>Float : "+ pl +
  "<br>Profile date : " + ti.substr(0,4)+"."+ti.substr(4,2)+"."+ti.substr(6,2)+"  "+ti.substr(8,2)+":"+ti.substr(10,2)+":"+ti.substr(12,2)+
  "<br>DAC : " + inst +
  "<br><p id=\"ajproject\"></p>" +
  "<br><p id=\"ajpi\"></p>" +
  "<br><p id=\"ajmodel\"></p>" +
  "<br><b>TEMPERATURE PROFILE</b>" +
  "<br><img src=\""+tempurl+"\" alt=\"not available\"><br>" +
  "<br><b>PRACTICAL SALINITY PROFILE</b>" +
  "<br><img src=\""+psalurl+"\" alt=\"not available\"><br>" +
  "<br><b>FLOAT TRAJECTORY</b>" +
  "<br><img src=\""+trajurl+"\" alt=\"not available\"><br>");
  sidebar.show();
  //ACCES ERDAPP VIA AJAX FOR TRAJECTORIES AND PROFILES HISTORICAL
  if(insTraj==0){

      $.ajax({
        url:'http://www.ifremer.fr/erddap/tabledap/ArgoFloats.json?time%2Clatitude%2Clongitude&platform_number=%22'+pl+'%22&orderBy(%22time%22)',
        dataType: 'jsonp',
        jsonp: '.jsonp',
        cache: 'true',
        jsonpCallback: 'functionname',
        success: function (data) {
                  insTraj=1;
                  var mlatlon=[];
                  for (var i = 0; i < data.table.rows.length; i++)
                    {
                      ajTime=data.table.rows[i][0];
                      mlatlon.push([data.table.rows[i][1],data.table.rows[i][2]]);
                      var markaj = L.marker([data.table.rows[i][1],data.table.rows[i][2]],{title: ajTime,icon: L.BeautifyIcon.icon(ico3)});
                      var markstruct={};
                      markstruct.Time=ajTime.substr(0,4)+ajTime.substr(5,2)+ajTime.substr(8,2)+ajTime.substr(11,2)+ajTime.substr(14,2)+ajTime.substr(17,2);
                      markstruct.Platform=pl;
                      markstruct.Institution=inst;
                      markstruct.latitude=data.table.rows[i][1];
                      markstruct.longitude=data.table.rows[i][2];
                      markaj.on('click',L.bind(SubMarkerClick,null,markstruct));
                      markaj.addTo(majaxLayer);
                    };
                    var mpoly = L.polyline(mlatlon, {color: '#45f442', smoothFactor: 2}).addTo(majaxLayer);
                  },
      type: 'GET'
    });
}}

//REMOVE MARKER AND TRAJ WHEN CLOSING PANEL
sidebar.on('hide', function () {
     map.removeLayer(curmarker);
     majaxLayer.clearLayers();
     insTraj=0;
 });
