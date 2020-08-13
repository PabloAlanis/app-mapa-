//este vuela de aca, debe ir en carpeta js
const mongoose=require('mongoose');

//inicializo la conexion
const db='mongodb://localhost/mapa';//mongo base de datos
mongoose.connect(db,function (err){
  if (err) throw err;
  console.log('MONGOOSE:Conectado correctamente a '+db+'.');
  console.log('MONGOOSE:Variable -puntosBD- enviada al server(sin schema moongoose)');
});

//esquemas
const Schema   = mongoose.Schema;
// Creates a GeoObject Schema.
var myGeo= new Schema({
                        type:{type:String,default:'Feature'},
                        properties:{
                                    nombre:String,
                                    descripcion:String,
                                    prioridad:String,
                                    email:String,
                                    fecha:{type: Date, default: Date.now} ,
                        },
                        geometry:{
                                type:{type: String , enum:["Point"], default:"Point"},
                                coordinates : [{type: Number},{type: Number}]
                     }
                     },
                     {versionKey:false}//deshabilita verion key __v:0 en mongo
 );

//2dsphere index on geo field to work with geoSpatial queries
myGeo.index({geometry : "2dsphere"});
//module.exports = mongoose.model('myGeos', myGeo);

//modelos
//var puntos=mongoose.model('mygeos',{});//aca iria el esquema
var puntos=mongoose.model('mygeos',myGeo)//(coleccion,schema)
module.exports.puntosBD=puntos; //exporto las variable puntosDB con el modelo adentro
