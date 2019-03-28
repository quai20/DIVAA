
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
var Esri_OceanBasemap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri',
	maxZoom: 13
});

//BASE TILE GROUP LAYER
  var baseLayers = {
    "Satellite": Esri_WorldImagery,
    "Grey ": Esri_DarkGreyCanvas,    
    "Ocean" : Esri_OceanBasemap
  };
//MAP STRUCTURE
  var map = L.map('map', {
    layers: [ Esri_WorldImagery ],
    minZoom : 3,
    worldCopyJump: true,
    inertia: false
  });

//MENU CREATION
  var groupedOverlays = {
    "Argo data": {},
    "Current data": {},
    "Other": {}
  };
  var optionsGr = {    
    //exclusiveGroups: ["Current data"],
    groupCheckboxes: false
  };
  var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, optionsGr);

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
//ICON FOR NEAREST PROFILES:
ico4 = {iconShape: 'doughnut', iconSize: [7,7], iconAnchor: [4,4], borderWidth: 1, borderColor: '#000', backgroundColor: '#f69314'}

//TRAJ LAYER, EMPTY AT START
var majaxLayer=L.layerGroup();
var nearestLayer=L.layerGroup();
var majaxLayerLine=L.layerGroup(); 
map.addLayer(majaxLayer);
map.addLayer(nearestLayer);
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

//LOADING SPINNER
map.spin(true);

//DATA LAYERS

var today = new Date();
var dd = today.getDate() - 1;
if(dd<10){dd='0'+dd.toString();} else{dd=dd.toString();}
var mm = today.getMonth() + 1; //January is 0!
if(mm<10){mm='0'+mm.toString();} else{mm=mm.toString();}
var yyyy = today.getFullYear();
yyyy=yyyy.toString()

//SST VIA CMEMS WMS
var wmsLayer0 = L.tileLayer.wms('http://nrt.cmems-du.eu/thredds/wms/METOFFICE-GLO-SST-L4-NRT-OBS-SST-V2?', {
   layers: 'analysed_sst',
   opacity: 0.35,
   colorscalerange: '270.0,305.0',
   abovemaxcolor: "extend",
   belowmincolor: "extend",
   numcolorbands: 30,
   time: yyyy+'-'+mm+'-'+dd+'T12:00:00.000Z',
   styles: 'boxfill/rainbow'
});
htmlsst='<font color="magenta">SST '+yyyy+'-'+mm+'-'+dd+'</font> <a target="_blank" href="http://marine.copernicus.eu/services-portfolio/access-to-products/?option=com_csw&view=details&product_id=SST_GLO_SST_L4_NRT_OBSERVATIONS_010_014"><img src="dist/info.png" height="15" width="15"></a>';
Spansst="<span id='ssttag'>"+htmlsst+"</span>"
layerControl.addOverlay(wmsLayer0,Spansst,'SST <a onclick=plotSSTlegend()><img src="dist/legend.png" height="13" width="13"></a>');

//SEA ICE VIA CMEMS WMS
var wmsLayer1 = L.tileLayer.wms('http://nrt.cmems-du.eu/thredds/wms/METNO-GLO-SEAICE_CONC-NORTH-L4-NRT-OBS?', {
   layers: 'ice_conc',
   opacity: 0.35,   
   colorscalerange: '0.0,99.9',
   abovemaxcolor: "extend",
   belowmincolor: "extend",
   numcolorbands: 30,    
   time: yyyy+'-'+mm+'-'+dd+'T12:00:00.000Z',
   styles: 'boxfill/rainbow'
});
htmlSI1='<font color="green">Arctic '+yyyy+'-'+mm+'-'+dd+'</font> <a target="_blank" href="http://marine.copernicus.eu/services-portfolio/access-to-products/?option=com_csw&view=details&product_id=SEAICE_GLO_SEAICE_L4_NRT_OBSERVATIONS_011_001"><img src="dist/info.png" height="15" width="15"></a>';
SpanSI1="<span id='seaice1tag'>"+htmlSI1+"</span>"
layerControl.addOverlay(wmsLayer1,SpanSI1,'Sea Ice Concentration <a onclick=plotICElegend()><img src="dist/legend.png" height="13" width="13"></a>');
//
var wmsLayer2 = L.tileLayer.wms('http://nrt.cmems-du.eu/thredds/wms/METNO-GLO-SEAICE_CONC-SOUTH-L4-NRT-OBS?', {
    layers: 'ice_conc',
    opacity: 0.35,
    colorscalerange: '0.0,99.9',
    abovemaxcolor: "extend",
    belowmincolor: "extend",
    numcolorbands: 30,    
    time: yyyy+'-'+mm+'-'+dd+'T12:00:00.000Z',
    styles: 'boxfill/rainbow'    
});
htmlSI2='<font color="green">Antarctic '+yyyy+'-'+mm+'-'+dd+'</font> <a target="_blank" href="http://marine.copernicus.eu/services-portfolio/access-to-products/?option=com_csw&view=details&product_id=SEAICE_GLO_SEAICE_L4_NRT_OBSERVATIONS_011_001"><img src="dist/info.png" height="15" width="15"></a>';
SpanSI2="<span id='seaice2tag'>"+htmlSI2+"</span>"
layerControl.addOverlay(wmsLayer2,SpanSI2,'Sea Ice Concentration <a onclick=plotICElegend()><img src="dist/legend.png" height="13" width="13"></a>');

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
    velocityScale: 0.1
  });
  htmlName1='<font color="red">Aviso Currents: '+WDate+'</font>'
  layerControl.addOverlay(velocityLayer1, htmlName1,"Current data");
  console.log("AVISO : " + (Date.now()-StartTime) + "ms");       
  map.on('layeradd', function(){
    map.spin(false);
  });
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
    velocityScale: 0.1
  });
  htmlName2='<font color="red">Aviso mdt2013</font>'
  layerControl.addOverlay(velocityLayer2, htmlName2,"Current data");
  console.log("AVISO MDT : " + (Date.now()-StartTime) + "ms");
});

// ANDRO
var deepal = palette('cb-BuGn', 8)
for (var i = 0; i < deepal.length; i+=1){deepal[i] = "#" + deepal[i]}
$.getJSON('data/andro_gm.json', function (data) {
  var velocityLayer3 = L.velocityLayer({
    displayValues: true,
    displayOptions: {
      velocityType : 'Andro deep velocity',
      displayPosition: 'bottomleft',
      displayEmptyString: 'No velocity data'
    },
    data: data,
    minvelocity: 0,
    maxVelocity: 0.075,
    velocityScale: 1,
    colorScale: deepal
  });
  htmlName3='<font color="red">Andro deep velocity (1000m depth)</font> <a target="_blank" href="https://wwz.ifremer.fr/lpo/Produits/ANDRO"><img src="dist/info.png" height="15" width="15"></a></font>'
  layerControl.addOverlay(velocityLayer3, htmlName3,"Current data");
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
layerControl.addOverlay(argomarkers, htmlName4,"Argo data");
//DEFAULT DISPLAY
map.addLayer(argomarkers);

//ARGO 10 DAYS
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
layerControl.addOverlay(argomarkers2, htmlName5,"Argo data");

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
layerControl.addOverlay(argomarkers3, htmlName6,"Argo data");

//TRAJ ALREADY PLOTTED, IF insTraj==1 AND CLICK ON TRAJ WE DON'T PLOT THE SAME TRAJECTORY
insTraj=0;
pl='0';

//SIDE PANEL MANAGEMENT
function SubMarkerClick(smarker) {
  //DOUGHNUT MARKER ON THE SELECTED FLOAT
  curmarker.setLatLng([smarker.latitude,smarker.longitude]);
  curmarker.addTo(map);
  nearestLayer.clearLayers();
  //CLEAR ANY EXISTING TRAJECTORIES IF CLICK OUTSIDE THE PLOTTED TRAJECTORY
  if(smarker.Platform!=pl){
  majaxLayer.clearLayers();
  majaxLayerLine.clearLayers();
  insTraj=0;
  }
  //ERDDAP URLs CONF
  ti=smarker.Time;
  pl=smarker.Platform;
  ula=smarker.latitude;
  ulo=smarker.longitude;
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

  //SET SIDEBAR
  sidebar.setContent("<b>Float : "+ pl +
  "<br>Profile date : " + ti.substr(0,4)+"."+ti.substr(4,2)+"."+ti.substr(6,2)+"  "+ti.substr(8,2)+":"+ti.substr(10,2)+":"+ti.substr(12,2)+
  "<br>DAC : " + inst +
  "<br><p id=\"ajproject\"></p>" +
  "<br><p id=\"ajpi\"></p>" +
  "<br><p id=\"ajmodel\"></p>" +
  "<br><a href='" + graphurl + "' target='blank'>Access profile data (erddap Ifremer)</a></b><br>" +
  "<a onclick=\"plotSectionT("+pl+")\"><b>Temperature section</b></a>  / <a onclick=\"plotSectionS("+pl+")\"><b>Salinity section</b></a><br>" +
  "<a onclick=\"NearestProfiles("+pl+","+ti+","+ula+","+ulo+")\"><img src=\"dist/nearme.png\" height=\"18\" width=\"18\" style=\"position:relative; top:-2px;\">  <b>Nearest profiles</b></a>"+
  //HIGHCHARTS
  "<br><div id=\"containerT\" style=\"min-width: 310px; height: 450px; max-width: 400px; margin: 0 auto\"></div><br>" +
  "<br><div id=\"containerS\" style=\"min-width: 310px; height: 450px; max-width: 400px; margin: 0 auto\"></div><br>"
   );

  //AJAX REQUEST FOR TEMPERATURE PROFILE
  var Tchart = new Highcharts.Chart(optionsT);        
  $.ajax({
    //url:"http://www.ifremer.fr/erddap/tabledap/ArgoFloats.json?pres%2Ctemp&platform_number=%22"+pl+"%22&time="+ti.substr(0,4)+"-"+ti.substr(4,2)+"-"+ti.substr(6,2)+"T"+ti.substr(8,2)+"%3A"+ti.substr(10,2)+"%3A"+ti.substr(12,2)+"Z",    
    url:"http://www.ifremer.fr/erddap/tabledap/ArgoFloats.json?pres%2Ctemp%2Ctime&platform_number=%22"+pl+"%22",        
    dataType: 'jsonp',
    jsonp: '.jsonp',
    cache: 'true',
    success: function (data) {      
        mymatrix=data.table.rows;
        outmatrix=[];
        pointTime=ti.substr(0,4)+"-"+ti.substr(4,2)+"-"+ti.substr(6,2)+"T"+ti.substr(8,2)+":"+ti.substr(10,2)+":"+ti.substr(12,2)+"Z";        
        for(var i=0; i<mymatrix.length; i++){
          if(mymatrix[i][2].localeCompare(pointTime)==0){
            //console.log(mymatrix[i][2]);
             outmatrix.push([mymatrix[i][0],mymatrix[i][1]]);             
           }             
       }         
        Tchart.addSeries({
            name: "Temperature",
            lineWidth: 4,
            lineColor: "#1f4b93",
            zIndex: 100,
            data: outmatrix});
        Tchart.redraw();        
  },
  type: 'GET'
  });

    //AJAX DISPLAY FOR SALINITY DISPLAY
  var Schart = new Highcharts.Chart(optionsS);          
  $.ajax({
  //url:"http://www.ifremer.fr/erddap/tabledap/ArgoFloats.json?pres%2Cpsal&platform_number=%22"+pl+"%22&time="+ti.substr(0,4)+"-"+ti.substr(4,2)+"-"+ti.substr(6,2)+"T"+ti.substr(8,2)+"%3A"+ti.substr(10,2)+"%3A"+ti.substr(12,2)+"Z",
  url:"http://www.ifremer.fr/erddap/tabledap/ArgoFloats.json?pres%2Cpsal%2Ctime&platform_number=%22"+pl+"%22",        
  dataType: 'jsonp',
  jsonp: '.jsonp',
  cache: 'true',
  success: function (data) {
    mymatrix=data.table.rows;
    outmatrix=[];
    pointTime=ti.substr(0,4)+"-"+ti.substr(4,2)+"-"+ti.substr(6,2)+"T"+ti.substr(8,2)+":"+ti.substr(10,2)+":"+ti.substr(12,2)+"Z";        
    for(var i=0; i<mymatrix.length; i++){
      if(mymatrix[i][2].localeCompare(pointTime)==0){
        //console.log(mymatrix[i][2]);
         outmatrix.push([mymatrix[i][0],mymatrix[i][1]]);             
       }             
   }        
   Schart.addSeries({
      name: "Salinity",
      lineWidth: 4,
      lineColor: "#1f4b93",
      zIndex: 100,
      data: outmatrix});
  Schart.redraw(); 
  },
  type: 'GET'
});  
  // SHOW SIDEBAR
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
                    mpoly = L.polyline(mlatlon, {color: '#8efcff', weight:3, smoothFactor: 2, opacity: 0.8}).addTo(majaxLayerLine);
                    mpoly = L.polyline(mlatlon, {color: '#45f442', weight:3, smoothFactor: 2, opacity: 0.8}).addTo(majaxLayer);
                    mpoly.on('click',function(e){                      
                      console.log(e)                                                       
                      });
                              
                  },
      type: 'GET'
    });
}}

//REMOVE MARKER AND TRAJ WHEN CLOSING PANEL
sidebar.on('hide', function () {
     map.removeLayer(curmarker);
     majaxLayer.clearLayers();
     nearestLayer.clearLayers();
     majaxLayerLine.clearLayers();
     insTraj=0;
 });

 //DEFAUT SEARCH BAR
 var controlSearch  = new L.Control.Search({layer: argomarkers, initial: false, position:'topleft'});
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
      //console.log(cloned)
      cloned.options.color = getRandomColor();
      cloned.addTo(caddyLayer);
        });
}).addTo(map);

//CLEAR CADDYLAYER
L.easyButton('fa-trash', function(){
    caddyLayer.clearLayers();
    controlSearch.circleLocation = false;
}).addTo(map);

function plotSectionT(float) {
  URLT="http://www.ifremer.fr/erddap/tabledap/ArgoFloats.png?cycle_number,pres,temp&platform_number=%22"+float+"%22&orderBy(%22cycle_number%2Cpres%22)&.draw=markers&.marker=4%7C5&.color=0xFFFFFF&.colorBar=Rainbow2%7C%7C%7C%7C%7C&.bgColor=0xffccccff&.yRange=%7C%7Cfalse";  
  var winc = L.control.window(map, {position: 'top', title: float, content: '<img src="'+URLT+'">' });  
  winc.show()    
}
function plotSectionS(float) {
  URLS="http://www.ifremer.fr/erddap/tabledap/ArgoFloats.png?cycle_number,pres,psal&platform_number=%22"+float+"%22&orderBy(%22cycle_number%2Cpres%22)&.draw=markers&.marker=4%7C5&.color=0xFFFFFF&.colorBar=Rainbow2%7C%7C%7C%7C%7C&.bgColor=0xffccccff&.yRange=%7C%7Cfalse";
  var winc = L.control.window(map, {position: 'top', title: float, content: '<img src="'+URLS+'">' });  
  winc.show()    
}
function plotSSTlegend() {
  URLL="http://nrt.cmems-du.eu/thredds/wms/METOFFICE-GLO-SST-L4-NRT-OBS-SST-V2?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=analysed_sst&COLORSCALERANGE=207,305";  
  var winc = L.control.window(map, {position: 'left', title: false, content: '<img src="'+URLL+'">' });  
  winc.show()    
}
function plotICElegend() {
  URLI="http://nrt.cmems-du.eu/thredds/wms/METNO-GLO-SEAICE_CONC-NORTH-L4-NRT-OBS?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=ice_conc&COLORSCALERANGE=0,99.9";  
  var winc = L.control.window(map, {position: 'left', title: false, content: '<img src="'+URLI+'">' });  
  winc.show()    
}
function getRandomColor() {  
  var colorl= ['#0084ff','#44bec7','#ffc300','#fa3c4c','#d696bb','#966842','#f44747','#eedc31','#7fdb6a','#0e68ce']
  rind=Math.floor(Math.random()*colorl.length-2);
  return colorl[rind];;
}
function NearestProfiles(pl,ti,ula,ulo) {

  map.spin(true);

  ti=String(ti) 
  pl=String(pl)
  // AJAX REQUEST FOR NEAREST TEMPERATURE PROFILE (+-0.1°lat, +-0.2°lon, +-365jours)
  zt1=ti.substr(0,4)-1+"-"+ti.substr(4,2)+"-"+ti.substr(6,2)+"T"+ti.substr(8,2)+"%3A"+ti.substr(10,2)+"%3A"+ti.substr(12,2)+"Z";       
  zt2=ti.substr(0,4)-(-1)+"-"+ti.substr(4,2)+"-"+ti.substr(6,2)+"T"+ti.substr(8,2)+"%3A"+ti.substr(10,2)+"%3A"+ti.substr(12,2)+"Z";        
  zla1=ula-0.1;
  zla2=ula+0.1;
  zlo1=ulo-0.2;
  zlo2=ulo+0.2;

  $.ajax({    
    url:"http://www.ifremer.fr/erddap/tabledap/ArgoFloats.json?platform_number%2Ccycle_number%2Ctime%2Cpres%2Ctemp&time%3E="+zt1+"&time%3C="+zt2+"&latitude%3E="+zla1+"&latitude%3C="+zla2+"&longitude%3E="+zlo1+"&longitude%3C="+zlo2+"&platform_number!=%22"+pl+"%22&orderBy(%22platform_number%2Ccycle_number%2Ctime%2Cpres%2Ctemp%22)",            
    dataType: 'jsonp',
    jsonp: '.jsonp',
    cache: 'true',
    success: function (data) {      
        Tchart=$("#containerT").highcharts();
        mymatrix=data.table.rows;
        outmatrix=[];                
        for(var i=0; i<mymatrix.length-1; i++){                          
          outmatrix.push([mymatrix[i][3],mymatrix[i][4]]);        
          if((mymatrix[i][0]!=mymatrix[i+1][0]) || (mymatrix[i][1]!=mymatrix[i+1][1]) || (mymatrix[i][2]!=mymatrix[i+1][2]) || (i==mymatrix.length-2)){
            Tchart.addSeries({
              name: "Nearest Profile",
              lineWidth: 2,
              lineColor: "#f69314",
              zIndex: 0,
              enableMouseTracking: false,
              showInLegend: false,
              data: outmatrix});
             outmatrix=[];           
          }
        }                   
        Tchart.redraw();
        map.spin(false);
      },
    error: function () {map.spin(false);},  
  type: 'GET'
  });

  // AJAX REQUEST FOR NEAREST SALINITY PROFILE (+-0.1°lat, +-0.2°lon, +-365jours)
  $.ajax({    
    url:"http://www.ifremer.fr/erddap/tabledap/ArgoFloats.json?platform_number%2Ccycle_number%2Ctime%2Cpres%2Cpsal&time%3E="+zt1+"&time%3C="+zt2+"&latitude%3E="+zla1+"&latitude%3C="+zla2+"&longitude%3E="+zlo1+"&longitude%3C="+zlo2+"&platform_number!=%22"+pl+"%22&orderBy(%22platform_number%2Ccycle_number%2Ctime%2Cpres%2Cpsal%22)",        
    dataType: 'jsonp',
    jsonp: '.jsonp',
    cache: 'true',
    success: function (data) {      
        Schart=$("#containerS").highcharts();
        mymatrix=data.table.rows;
        outmatrix=[];        
        for(var i=0; i<mymatrix.length-1; i++){                
          outmatrix.push([mymatrix[i][3],mymatrix[i][4]]);                     
          if((mymatrix[i][0]!=mymatrix[i+1][0]) || (mymatrix[i][1]!=mymatrix[i+1][1]) || (mymatrix[i][2]!=mymatrix[i+1][2]) || (i==mymatrix.length-2)){
            Schart.addSeries({
              name: "Nearest Profile",
              lineWidth: 2,
              lineColor: "#f69314",
              zIndex: 0,
              enableMouseTracking: false,
              showInLegend: false,
              data: outmatrix});
             outmatrix=[];           
          }
        } 
        Schart.redraw();               
        map.spin(false); 
      },
    error: function () {map.spin(false);},         
  type: 'GET'
  });

  //NEAREST POINTS
  $.ajax({
    url:"http://www.ifremer.fr/erddap/tabledap/ArgoFloats.json?time%2Clatitude%2Clongitude%2Cplatform_number%2Ccycle_number&time%3E="+zt1+"&time%3C="+zt2+"&latitude%3E="+zla1+"&latitude%3C="+zla2+"&longitude%3E="+zlo1+"&longitude%3C="+zlo2+"&platform_number!=%22"+pl+"%22",
    dataType: 'jsonp',
    jsonp: '.jsonp',
    cache: 'true',
    success: function (data) {                                  
              for (var i = 0; i < data.table.rows.length; i++)
                {
                  ajTime=data.table.rows[i][0];                      
                  ajPlatf=data.table.rows[i][3];
                  ajCycle=data.table.rows[i][4];                                            
                  var markaj = L.marker([data.table.rows[i][1],data.table.rows[i][2]],{icon: L.BeautifyIcon.icon(ico4)});                                            
                  markaj.bindPopup('<center><b>'+ajPlatf+'</b> -'+ajCycle+'<br>'+ajTime+'</center>')
                  markaj.addTo(nearestLayer);                  
                };
              map.spin(false);                                                  
              },
    error: function () {map.spin(false);},             
  type: 'GET'
  });      
}

//CHART OPTIONS
var optionsT={
    chart: {
        renderTo: 'containerT',
        type: 'spline',
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
    credits: {
      enabled: false
    }  
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
    credits: {
      enabled: false
     }    
}