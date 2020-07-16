const mongoose=require('mongoose');

//inicializo la conexion
const db='mongodb://localhost/mapa';//mongo base de datos
mongoose.connect(db,function (err){
  if (err) throw err;
  console.log('Conectado correctamente a '+db+'.');
});

//modelos
var puntos=mongoose.model('marcador',{});//aca iria el esquema
module.exports.puntosBD=puntos; //exporto la variable puntosDB con el modelo adentro
