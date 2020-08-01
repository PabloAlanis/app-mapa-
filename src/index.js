const express=require('express');
const engine=require('ejs-mate');
const path=require('path');

//inicializaciones
const app=express();//inicializo express

//settings
app.use(express.static(path.join(__dirname,'public')));//enlaces a la carpeta public
var modeloPuntosBD=require('./conexion').puntosBD;//traigo el modelo de mongoose a la variable
app.engine('ejs',engine);//inicializo el motor de plantillas ejs-mate
app.set('view engine','ejs');//inicializo el motor de plantillas ejs-mate
app.set('views',path.join(__dirname,'views'));//le digo al server donde esta la carpeta views

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
app.post('/agregar',function(req,res){
    //console.log(req.body);
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
