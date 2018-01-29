var StartTime = Date.now();

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
//MINI MAP
  var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  var osmAttrib='Map data &copy; OpenStreetMap contributors';
  L.tileLayer(osmUrl, {attribution: osmAttrib, id: 'mapbox.streets'}).addTo(map);
  var osm2 = new L.TileLayer(osmUrl, {minZoom: 0, maxZoom: 1, attribution: osmAttrib });
  var miniMap = new L.Control.MiniMap(osm2, { toggleDisplay: true }).addTo(map);  
//MOUSE POSITION BOTTOM LEFT
  L.control.mousePosition().addTo(map);
//CREDIT FOR LOPS LOGO
  var credctrl = L.controlCredits({
  image: "dist/lops.png",
  link: "http://www.umr-lops.fr/",
  text: "<center><b>Laboratoire<br>d'Oceanographie<br>Physique<br>et Spatiale<br>IFREMER 2017</b></center>",
  width: 96,
  height: 96
  }).addTo(map);
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
ico0 = {iconShape: 'doughnut', iconSize: [16,16], iconAnchor: [8,8], borderWidth: 5, borderColor: '#f00', backgroundColor: '#f99'}
var curmarker = L.marker([0,0],{icon: L.BeautifyIcon.icon(ico0)});
//ICON FOR IFREMER FLOAT:
ico1 = {iconShape: 'doughnut', iconSize: [9,9], iconAnchor: [4,4], borderWidth: 1, borderColor: '#000', backgroundColor: '#fdfe02'}
//ICON FOR ANY OTHER FLOAT:
ico2 = {iconShape: 'doughnut', iconSize: [9,9], iconAnchor: [4,4], borderWidth: 1, borderColor: '#000', backgroundColor: '#eee'}
//ICON FOR FLOAT TRAJECTORY:
ico3 = {iconShape: 'doughnut', iconSize: [9,9], iconAnchor: [4,4], borderWidth: 1, borderColor: '#000', backgroundColor: '#7de0ba'}

//TRAJ LAYER, EMPTY AT START
var majaxLayer=L.layerGroup();
var majaxLayerLine=L.layerGroup(); 
map.addLayer(majaxLayer);
//CADDY LAYER, EMPTY AT START
var caddyLayer=L.layerGroup();
map.addLayer(caddyLayer);
//SIDE PANEL
var sidebar = L.control.sidebar('sidebar', {
  closeButton: true,
  position: 'left',
  autoPan: false
});
map.addControl(sidebar);

//DATA LAYERS

//ISAS CLIM
// var wmsLayer = L.tileLayer.wms('http://tds0.ifremer.fr/thredds/wms/LPO-GLOBAL-ISAS13-CLIM_TIME_SERIE?', {
//   layers: 'TEMP',
//   opacity: 0.55  
// });
// layerControl.addOverlay(wmsLayer,'<font color="green">Climatology ISAS13 </font> <a target="_blank" href="http://sextant.ifremer.fr/fr/geoportail/sextant#/search?fast=index&_content_type=json&from=1&to=20&sortBy=popularity&_groupPublished=OCEANO_PHYSIQUE_SPATIALE"><img src="dist/info.png" height="15" width="15"></a>');

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
  console.log("AVISO : " + (Date.now()-StartTime) + "ms");
  map.addLayer(velocityLayer1); //Default display when page loads
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
  console.log("AVISO MDT : " + (Date.now()-StartTime) + "ms");
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
  console.log("ANDRO : " + (Date.now()-StartTime) + "ms");
});

//ARGO DAY
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
htmlName5='<font color="blue">Argo floats : 10 days</font> <a target="_blank" href="http://www.umr-lops.fr/SO-Argo/Home"><img src="dist/info.png" height="15" width="15"></a>'
layerControl.addOverlay(argomarkers2, htmlName5);
//DEFAULT DISPLAY
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
htmlName6='<font color="blue">Argo Deep floats : 30 days</font> <a target="_blank" href="http://www.umr-lops.fr/SO-Argo/Home"><img src="dist/info.png" height="15" width="15"></a>'
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
  majaxLayerLine.clearLayers();
  insTraj=0;
  }
  //ERDDAP URLs
  ti=smarker.Time;
  pl=smarker.Platform;
  inst=smarker.Institution;  
  graphurl="http://www.ifremer.fr/erddap/tabledap/ArgoFloats.graph?temp,pres,psal&time="+ti.substr(0,4)+"-"+ti.substr(4,2)+"-"+ti.substr(6,2)+"T"+ti.substr(8,2)+"%3A"+ti.substr(10,2)+"%3A"+ti.substr(12,2)+"Z&platform_number=%22"+pl+"%22&.draw=linesAndMarkers&.yRange=%7C%7Cfalse";
  
  //AJAX REQUEST FOR PROJECT, PI AND MODEL 
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
  //AJAX REQUEST FOR TEMPERATURE PROFILE
  $.ajax({
    //url:"http://www.ifremer.fr/erddap/tabledap/ArgoFloats.json?pres%2Ctemp&platform_number=%22"+pl+"%22&time="+ti.substr(0,4)+"-"+ti.substr(4,2)+"-"+ti.substr(6,2)+"T"+ti.substr(8,2)+"%3A"+ti.substr(10,2)+"%3A"+ti.substr(12,2)+"Z",    
    url:"http://www.ifremer.fr/erddap/tabledap/ArgoFloats.json?pres%2Ctemp%2Ccycle_number&platform_number=%22"+pl+"%22&time>="+ti.substr(0,4)+"-01-01T00%3A00%3A00Z",        
    dataType: 'jsonp',
    jsonp: '.jsonp',
    cache: 'true',
    success: function (data) {      
        mymatrix=data.table.rows;
        uniqCycle=getUniq(mymatrix,2); //GET UNIQUE(cycle_number) to avoid erdapp bug
        outmatrix=[];

        for(var i=0; i<mymatrix.length; i++){
          if(mymatrix[i][2] == uniqCycle[uniqCycle.length-1]){
             outmatrix.push([mymatrix[i][0],mymatrix[i][1]]);             
           }             
       }        
        optionsT.series[0].data = outmatrix;
        var chart = new Highcharts.Chart(optionsT);        
  },
  type: 'GET'
  });
  //AJAX DISPLAY FOR SALINITY DISPLAY
  $.ajax({
  //url:"http://www.ifremer.fr/erddap/tabledap/ArgoFloats.json?pres%2Cpsal&platform_number=%22"+pl+"%22&time="+ti.substr(0,4)+"-"+ti.substr(4,2)+"-"+ti.substr(6,2)+"T"+ti.substr(8,2)+"%3A"+ti.substr(10,2)+"%3A"+ti.substr(12,2)+"Z",
  url:"http://www.ifremer.fr/erddap/tabledap/ArgoFloats.json?pres%2Cpsal%2Ccycle_number&platform_number=%22"+pl+"%22&time>="+ti.substr(0,4)+"-01-01T00%3A00%3A00Z",        
  dataType: 'jsonp',
  jsonp: '.jsonp',
  cache: 'true',
  success: function (data) {
    mymatrix=data.table.rows;
    uniqCycle=getUniq(mymatrix,2); //GET UNIQUE(cycle_number) to avoid erdapp bug
    outmatrix=[];

    for(var i=0; i<mymatrix.length; i++){
      if(mymatrix[i][2] == uniqCycle[uniqCycle.length-1]){
         outmatrix.push([mymatrix[i][0],mymatrix[i][1]]);             
       }             
   }        
    optionsS.series[0].data = outmatrix;
    var chart = new Highcharts.Chart(optionsS);        
  },
  type: 'GET'
});  

  //
  sidebar.setContent("<b>Float : "+ pl +
  "<br>Profile date : " + ti.substr(0,4)+"."+ti.substr(4,2)+"."+ti.substr(6,2)+"  "+ti.substr(8,2)+":"+ti.substr(10,2)+":"+ti.substr(12,2)+
  "<br>DAC : " + inst +
  "<br><p id=\"ajproject\"></p>" +
  "<br><p id=\"ajpi\"></p>" +
  "<br><p id=\"ajmodel\"></p>" +
  "<br><a href='" + graphurl + "' target='blank'>Access profile data (erddap Ifremer)</a></b> " +
  //HIGHCHARTS
  "<br><div id=\"containerT\" style=\"min-width: 310px; height: 450px; max-width: 400px; margin: 0 auto\"></div><br>" +
  "<br><div id=\"containerS\" style=\"min-width: 310px; height: 450px; max-width: 400px; margin: 0 auto\"></div><br>"
   );

  sidebar.show();

  //ACCES ERDAPP VIA AJAX FOR TRAJECTORIES AND PROFILES HISTORICAL
  if(insTraj==0){
      $.ajax({
        url:'http://www.ifremer.fr/erddap/tabledap/ArgoFloats.json?time%2Clatitude%2Clongitude&platform_number=%22'+pl+'%22&latitude>=-99.999&latitude<=89.784&longitude>=-179.999&longitude<=180&orderBy(%22time%22)',
        dataType: 'jsonp',
        jsonp: '.jsonp',
        cache: 'true',
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
                    var mpoly = L.polyline(mlatlon, {color: '#8efcff', weight:3, smoothFactor: 2}).addTo(majaxLayerLine);
                    var mpoly = L.polyline(mlatlon, {color: '#45f442', weight:3, smoothFactor: 2}).addTo(majaxLayer);
                  },
      type: 'GET'
    });
}}

//REMOVE MARKER AND TRAJ WHEN CLOSING PANEL
sidebar.on('hide', function () {
     map.removeLayer(curmarker);
     majaxLayer.clearLayers();
     majaxLayerLine.clearLayers();
     insTraj=0;
 });

 //DEFAUT SEARCH BAR
 var controlSearch  = new L.Control.Search({layer: argomarkers2, initial: false, position:'topleft'});
 map.addControl(controlSearch);
//CHANGE SEARCH LAYER
map.on('overlayadd', function(eo) {
    if (eo.name === htmlName4){controlSearch.setLayer(argomarkers);}
    else if (eo.name === htmlName5){controlSearch.setLayer(argomarkers2);}
    else if (eo.name === htmlName6){controlSearch.setLayer(argomarkers3);}
});

//SAVE CADDYLAYER BUTTONS
var caddybutton = L.easyButton('fa-plus', function(){
    majaxLayerLine.eachLayer(function (layer) {
      var cloned = cloneLayer(layer);
      cloned.addTo(caddyLayer);
        });
}).addTo(map);

//CLEAR CADDYLAYER
L.easyButton('fa-trash', function(){
    caddyLayer.clearLayers();
    controlSearch.circleLocation = false;
}).addTo(map);

//CHART OPTIONS
var optionsT={
    chart: {
        renderTo: 'containerT',
        //type: 'spline',
        inverted: true,
        zoomType: "xy"
    },
    title: {
        text: 'Temperature profile'
    },
    xAxis: {
        reversed: true,
        title: {
            enabled: true,
            text: 'Pressure'
        },
        gridLineDashStyle: 'dash',
        gridLineColor : 'gray',
        gridLineWidth : 1
    },
    yAxis: {
    		opposite: true,
        title: {
            enabled: true,
            text: 'Temperature'
        },
        lineWidth: 2,
        gridLineDashStyle: 'dash',
        gridLineColor : 'gray',
        gridLineWidth : 1
    },
    tooltip: {
        headerFormat: '',
        pointFormat: '{point.x} dbar : {point.y}°C'
    },
    plotOptions: {
        spline: {
            marker: {
                enable: false
            }
        }
    },
    series: [{
      name: "Temperature",
      lineWidth: 4,
      lineColor: "#1f4b93"
    }]
};

var optionsS={
    chart: {
        renderTo: 'containerS',
        //type: 'spline',
        inverted: true,
        zoomType: "xy"
    },
    title: {
        text: 'Salinity profile'
    },
    xAxis: {
        reversed: true,
        title: {
            enabled: true,
            text: 'Pressure'
        },
        gridLineDashStyle: 'dash',
        gridLineColor : 'gray',
        gridLineWidth : 1
    },
    yAxis: {
    		opposite: true,
        title: {
            enabled: true,
            text: 'Salinity'
        },
        lineWidth: 2,
        gridLineDashStyle: 'dash',
        gridLineColor : 'gray',
        gridLineWidth : 1
    },
    tooltip: {
        headerFormat: '',
        pointFormat: '{point.x} dbar : {point.y}'
    },
    plotOptions: {
        spline: {
            marker: {
                enable: false
            }
        }
    },
    series: [{
      name: "Salinity",
      lineWidth: 4,
      lineColor: "#1f4b93"
    }]
}

function getUniq(matrix, col){
  var column = [];
  var valin = matrix[0][col]
  for(var i=0; i<matrix.length; i++){
     if(matrix[i][col] != valin){
        column.push(matrix[i][col]);
        valin=matrix[i][col];
      }             
  }
  return column;
}