// Módulos.
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var swig = require('swig');
var mongo = require('mongodb');
var fileUpload = require('express-fileupload');
var sharp = require('sharp');
var crypto = require('crypto');
var gestorBD = require('./modules/gestorBD.js')
gestorBD.init(app, mongo);

var expressSession = require('express-session');
app.use(expressSession({
    secret: 'abcdefg',
    resave: true,
    saveUninitialized: true
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

var routerUsuarioSession = express.Router();
routerUsuarioSession.use(function(req, res, next) {
    console.log('routerUsuarioSession');
    if (req.session.usuario) {
        next();
    } else {
        console.log('va a : ' + req.session.destino)
        res.redirect('/identificarse');
    }
});

// routerUsuarioAutor
var routerUsuarioAutor = express.Router();
routerUsuarioAutor.use(function(req, res, next) {
    console.log('routerUsuarioAutor');
    var path = require('path');
    var id = path.basename(req.originalUrl);

    gestorBD.obtenerProductos(
        { _id : mongo.ObjectID(id) }, function (productos) {
            console.log(canciones[0]);
            if(canciones[0].autor == req.session.usuario ){
                next();
            } else {
                res.redirect('/tienda');
            }
        })
});

// Aplicar routerUsuarioSession.
app.use('/productos/agregar', routerUsuarioSession);
app.use('/publicaciones', routerUsuarioSession);
app.use("/cancion/comprar",routerUsuarioSession);
app.use("/compras",routerUsuarioSession);

// Aplicar routerUsuarioAutor
app.use('/cancion/modificar', routerUsuarioAutor);
app.use('/cancion/eliminar', routerUsuarioAutor);

app.use(express.static('public'));
app.use(fileUpload());

app.get('/', function (req, res) {
    res.redirect('/tienda');
})

// Variables de entorno.
app.set('port', process.env.PORT || 8081);
app.set('db', 'mongodb://admin:ERUifkEQpPkdfjJW@mercacalle-shard-00-00-3lwrv.mongodb.net:27017,mercacalle-shard-00-01-3lwrv.mongodb.net:27017,mercacalle-shard-00-02-3lwrv.mongodb.net:27017/test?ssl=true&replicaSet=mercacalle-shard-0&authSource=admin&retryWrites=true&w=majority')
app.set('clave', 'abcdefg');
app.set('crypto', crypto);

// Rutas/controladores por lógica.
require('./routes/rusuarios.js')(app, swig, gestorBD);
require('./routes/rproductos.js')(app, swig, gestorBD, sharp);

app.use( function (err, req, res, next ) {
    console.log("Error producido: " + err); //we log the error in our db
    if (! res.headersSent) { 
        res.status(400);
        res.send("Recurso no disponible");
    }
});

app.listen(app.get('port'), function() {
    console.log('Servidor activo');
});