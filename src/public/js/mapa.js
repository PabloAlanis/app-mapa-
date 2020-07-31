//iniciliazion del mapa
var map;
map = L.map('map',{ attributionControl: false,center: [-45.8209,-67.5378],zoom: 11.5,minZoom: 11, maxZoom: 22,zoomControl: true});//.setView([-45.8209,-67.5378],11,5);
var baseLayer = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',maxZoom: 22,maxNativeZoom:19});
//'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png'
//'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
baseLayer.addTo(map);
baseLayer.on('load',loadGeoJSon);
// Initialise the FeatureGroup to store editable layers
//L.control.locate().addTo(map);//boton para geolocalizacion
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
// Initialise the draw control and pass it the FeatureGroup of editable layers
var drawControl = new L.Control.Draw({
  edit: {
    featureGroup: drawnItems,
  }
});
//map.addControl(drawControl);
//

//evento de agregar algo al mapa
map.on(L.Draw.Event.CREATED, function (e) {
  var type = e.layerType;
  var layer = e.layer;
  if (type==='marker') {
    var datos=layer.getLatLng().toString();
    //var radius = 100;
    //L.circle(layer.getLatLng(), radius).addTo(map);
    //alert('Soy un Marcador en '+layer.getLatLng().toString());
    layer.bindTooltip(datos).openTooltip();
    //aca deberia AGREGAR datos a mongo mediante node
  }
  //var infoPuntoLL=layer.getLatLng().toString();
  // Do whatever else you need to. (save to db, add to map etc)
  map.addLayer(layer);
  drawnItems.addLayer(layer);
});

map.on('click', function(e) {
//$('#modalPunto').modal('show');
//$('.modalPunto-body').html(datos);
Swal.fire(
  'Good job!',
  'You clicked the button!',
  'success'
)
//$('.modal-body').html(layer.getLatLng().toString());
  //L.marker(e.latlng).addTo(map);
  //alert(e.latlng);
     // e is an event object (MouseEvent in this case)
})


/*esto permite geolocalizarse (apiREST)
map.on('click', function(e){
  map.locate({setView:true,zoom:4,enableHighAccuracy:true});
});
function onLocationFound(e) {
  var mkii = L.icon.mapkey({icon:"school",color:'#725139',background:'#f2c357',size:40});
  var radius = e.accuracy / 2;
  L.marker(e.latlng,{icon:mkii}).addTo(map).bindPopup("<h5>Si tu ubicación esta bien presiona sobre el circulo</h5>").openPopup();
  var radio=L.circle(e.latlng,radius);
  radio.addTo(map);
  radio.on('click',function(e){
    $('#modalCliente').modal('show');
  });
}

 function onLocationError(e) {
   alert("Debes autorizar la geolocalización");
  }
 map.on('locationfound',onLocationFound);
 map.on('locationerror',onLocationError);
 //esto permite geolocalizarse (apiREST)*/

//geoJSON y renderizado en el mapa
//datos desde mongo
//var mapaMongo=$('#datoMongoose').html();
//mapaMongo.JSON.stringify();
//simulacion de geojson



//aca cargo/renderizo el geoJSON simple o con un each para cargar las propiedades en popup
//L.geoJSON(punto).addTo(map);
/*var layerGroup = L.geoJSON(punto, {
  onEachFeature: function (feature, layer) {
    //layer.bindPopup('<h1>'+feature.properties.f1+'</h1><p>name: '+feature.properties.f2+'</p>');
  }
}).addTo(map);*/




//carga de geoJSON
function loadGeoJSon(){
  function onEachFeature(feature, layer) {
    layer.bindPopup(feature.properties.f1);  //titulo del pop-up
    //seteo de los iconos
    if (feature.properties.prioridad=="Baja") {
      layer.setIcon(iconoBajaPriori);
    }else if (feature.properties.prioridad=="Media") {
      layer.setIcon(iconoMediaPriori);
    }else if (feature.properties.prioridad=="Alta") {
      layer.setIcon(iconoAltaPriori);
    }
  }
  //configuracion de los iconos
  var iconoBajaPriori = L.icon.mapkey({icon:"volcano",color:'#720039',background:'#c9fa48',size:35,boxShadow:false,hoverScale:3});
  var iconoMediaPriori = L.icon.mapkey({icon:"volcano",color:'#720039',background:'#effa48',size:35,boxShadow:false,hoverScale:3});
  var iconoAltaPriori=L.icon.mapkey({icon:"volcano",color:'#720039',background:'#fa7b48',size:35,boxShadow:false,hoverScale:3});
  //configuracion de los iconos
  var mapaMongo=$('#datoMongoose').html();
  var layerGroup = L.geoJSON(JSON.parse(mapaMongo), {
    onEachFeature:onEachFeature
  }).addTo(map);
  //evento al pasar sobre un punto
  layerGroup.on("mouseover",function(e){
    var clickedMarker=e.layer;
    clickedMarker.openPopup();
    //$('#modalHover').modal('show');
  })
  layerGroup.on("mouseout",function(e){
    //$('#modalHover').modal('toggle');
  })
  //evento click sobre los marcadores
  layerGroup.on("click", function (e) {
    //ajax al Borrar
    $(document).ready(function(){
        $('#formBorrar').on('submit', function(e){
            e.preventDefault();
            //var data="dd";
            //var data = $('input[name=quote]').val();
            $.ajax({
                type: 'post',
                url:  '/borrar/'+id,
                //data: {id:1},
                //dataType: 'json',
                success: borrarIcono(),
            })

        });
    })
    //esta funcion borra el icono y cierra el modal - se la paso a ajax
    function borrarIcono(){
      map.removeLayer(clickedMarker);
      $('#modalMarcador').modal('toggle');
    }
    //ajax al Borrar
      var clickedMarker = e.layer;
      var id=clickedMarker.feature._id;//$('#datoMongoose').html();
      var datosA=clickedMarker.feature.properties.f1;
      var datosB=clickedMarker.feature.properties.f2;
      var datosPrioridad=clickedMarker.feature.properties.prioridad;
      $('#modalBodyId').html(id);
      //$('#formBorrar').attr('action', '/borrar/'+id);//le envio el id al formulario de express
      $('#modalBodyA').html(datosA);
      $('#modalBodyB').html(datosB);
      $('#modalPrioridad').html(datosPrioridad);
      $('#modalMarcador').modal('show');
  });
}
