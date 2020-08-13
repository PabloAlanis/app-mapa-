const express=require('express');
const engine=require('ejs-mate');
const path=require('path');
const bodyparser=require('body-parser');

//inicializaciones
const app=express();//inicializo express


//settings
app.use(express.static(path.join(__dirname,'public')));//enlaces a la carpeta public
var modeloPuntosBD=require('./conexion').puntosBD;//traigo el modelo de mongoose a la variable
app.engine('ejs',engine);//inicializo el motor de plantillas ejs-mate
app.set('view engine','ejs');//inicializo el motor de plantillas ejs-mate
app.set('views',path.join(__dirname,'views'));//le digo al server donde esta la carpeta views
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

//rutas

//traigo los puntos de mongo
app.get('/', function(req,res){//raiz de localhost
  modeloPuntosBD.find(function(err,datos){
  //var id=datos[0].id;
  var punto=datos;
  var stringPunto=JSON.stringify(punto);
  console.log('MONGO geoJSON: '+stringPunto);
  res.render('index.ejs',{dato:stringPunto});//renderizo la vista dentro de views y le paso data de models mongoose
  });
});

//formulario para agregar un punto
app.post('/agregar',(req,res,next) => {
  var punto=new modeloPuntosBD();
    punto.properties.email=req.body.email;
    punto.properties.nombre=req.body.nombre;
    punto.properties.descripcion=req.body.descripcion;
    punto.properties.prioridad=req.body.prioridad;
    punto.geometry.coordinates=[req.body.long,req.body.lat];
    //console.log(req.body);//muestra los datos del formulario mediante body-parser
    punto.save().then((data) => {
      //res.send(data);
      res.redirect('/');
      console.log(punto);
      //console.log(punto.prioridad);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
});

app.get('/acerca', function(req,res){
  res.send("acerca loco");
});

//formulario para borrar un punto
app.post('/borrar/:id', function(req,res){
  modeloPuntosBD.findByIdAndRemove(req.params.id , function (err) {
  if (err) return next(err);
   //res.send('Deleted successfully!');
   //res.redirect('/');
  })
});

//inicializar servidor
const puerto=3000;
app.listen(puerto,function(){
  console.log('NODEJS:Servidor iniciado en el puerto: '+puerto);
});
