module.exports = function (app, swig, gestorBD, sharp) {

    // Ver los productos que he puesto a la venta. Se necesita estar logueado.
    app.get('/productos', function(req, res) {
        var criterio = { vendedor : req.session.usuario };

        gestorBD.obtenerProductos(criterio, function(productos) {
            if (productos == null) {
                res.send('Error al listar ');
            } else {
                var respuesta = swig.renderFile('views/bpublicaciones.html',
                {
                    productos : productos
                });
                res.send(respuesta);
            }
        });
    });

    app.get('/paginavacia', function(req, res) {
        var respuesta = swig.renderFile('views/paginavacia.html');
        res.send(respuesta);
    })

    app.get('/inversion', function(req, res) {
        var respuesta = swig.renderFile('views/inversion.html');
        res.send(respuesta);
    });

    app.get('/contacto', function(req, res) {
        var respuesta = swig.renderFile('views/contacto.html');
        res.send(respuesta);
    })

    app.get('/productos/agregar', function (req, res) {

        var respuesta = swig.renderFile('views/bagregar.html', {

        });
        res.send(respuesta);
    });

    app.get('/suma', function (req, res) {
        var respuesta = parseInt(req.query.num1) + parseInt(req.query.num2);

        res.send(String(respuesta));
    });

    app.get('/producto/:id', function (req, res) {
        var criterio = { '_id' : gestorBD.mongo.ObjectID(req.params.id) };

        gestorBD.obtenerProductos(criterio, function(productos) {
            if (productos==null){
                res.send(respuesta)
            } else {
                var respuesta = swig.renderFile('views/bproducto.html', {
                    producto : productos[0]
                });
                res.send(respuesta);
            }
        });
    });

    app.get('/productos/:genero/:id', function (req, res) {
        var respuesta = 'id: ' + req.params.id + '<br>'
            + 'Genero: ' + req.params.genero;

        res.send(respuesta);
    })

    app.post('/producto', function (req, res) {

        // Instanciamos el objeto producto.
        var producto = {
            nombre: req.body.nombre,
            categoria: req.body.categoria,
            precio: req.body.precio,
            vendedor: req.session.usuario
        }

        // Conectarse
        gestorBD.insertarProducto(producto, function (id) {
            if (id == null) {
                res.send('Error al insertar ');
            } else {
                if (req.files.principal != null) {
                    var imagen = req.files.principal;
                    imagen.mv('public/principales/' + id + 'original' + '.png', function (err) {
                        if (err) {
                            res.send('Error al subir la portada');
                        } else {
                            sharp('public/principales/' + id + 'original' + '.png')
                            .resize(200, 200).toFile('public/principales/' + id + '.png', function (err) {
                                if(err) {
                                    throw err;
                                }
                            })
                            res.redirect('/productos');
                        }
                    });
                }
            }
        })
    });

    app.get('/producto/eliminar/:id', function (req, res) {
        var criterio = { '_id' : gestorBD.mongo.ObjectID(req.params.id) };

        gestorBD.eliminarProducto(criterio, function(productos) {
            if ( productos == null ) {
                res.send(respuesta);
            } else {
                res.redirect('/publicaciones');
            }
        })
    });

    app.get('/tienda', function (req, res) {
        var criterio = {};

        if (req.query.busqueda != null) {
            criterio = { 'nombre': 
                {
                    $regex : ".*" + req.query.busqueda + ".*"
                }
          };
        }

        var pg = parseInt(req.query.pg); // Es String !!!
        if ( req.query.pg == null){ // Puede no venir el param
            pg = 1;
        }
    
        gestorBD.obtenerProductosPg(criterio, pg , function(productos, total ) {
            if (productos == null) {
                res.send("Error al listar ");
            } else {
                
                var pgUltima = total/4;
                if (total % 4 > 0 ){ // Sobran decimales
                    pgUltima = pgUltima+1;
                }
                
                var respuesta = swig.renderFile('views/btienda.html', 
                {
                    productos : productos,
                    pgActual : pg,
                    pgUltima : pgUltima
                });
                res.send(respuesta);
            }
        });

    });

    app.get('/producto/modificar/:id', function (req, res) {

        var criterio = { '_id' : gestorBD.mongo.ObjectID(req.params.id) };

        gestorBD.obtenerProductos(criterio, function(productos) {
            if (productos == null) {
                res.send(respuesta);
            } else {
                var respuesta = swig.renderFile('views/bproductoModificar.html',
                {
                    producto : productos[0]
                });
                res.send(respuesta);
            }
        });
    });

    app.post('/producto/modificar/:id', function (req, res) {
        var id = req.params.id;
        var criterio = { '_id' : gestorBD.mongo.ObjectID(id) };

        var producto = {
            nombre : req.body.nombre,
            categoria : req.body.categoria,
            precio : req.body.precio
        }

        gestorBD.modificarProducto(criterio, producto, function(result) {
            if (result == null) {
                res.send('Error al modificar ');
            } else {
                modificarPrincipal(req.files, id, function (result) {
                    if (result == null) {
                        res.send('Error en la modificación');
                    } else {
                        res.redirect('/publicaciones');
                    }
                });
            }
        });
    });

    function modificarPrincipal(files, id, callback) {

        if (files.principal != null) {
            var imagen = files.principal;
            imagen.mv('public/principales' + id + 'original' + '.png', function(err) {
                if (err) {
                    callback(null); //ERROR
                } else {
                    sharp('public/principales' + id + 'original' + '.png')
                    .resize(200, 200).toFile('public/principales/' + id + '.png', function (err) {
                        if(err) {
                            console.log(err)
                            throw err;
                        } else {
                            callback(true); //FIN
                        }
                    });
                }
            });
        }
    };

    app.get('/producto/eliminar/:id', function(req, res) {

        var criterio = { '_id' : gestorBD.mongo.ObjectID(req.params.id) };

        gestorBD.eliminarProducto(cirterio, function(productos) {
            if (productos == null) {
                res.send(respuesta);
            } else {
                res.redirect('/productos');
            }
        });
    });

    app.get('/producto/comprar/:id', function (req, res) {
        var productoId = gestorBD.mongo.ObjectID(req.params.id);
        var compra = {
            usuario : req.session.usuario,	
            productoId : productoId
        }
        
        gestorBD.insertarCompra(compra ,function(idCompra){
            if ( idCompra == null ){
                res.send(respuesta);
            } else {
                res.redirect("/compras");
            }
        });
    });

    app.get('/compras', function (req, res) {
        var criterio = { "usuario" : req.session.usuario };
    
        gestorBD.obtenerCompras(criterio ,function(compras){
            if (compras == null) {
                res.send("Error al listar ");
            } else {
                
                var productosCompradosIds = [];
                for(i=0; i <  compras.length; i++){
                    productosCompradosIds.push( compras[i].productoId );
                }
                
                var criterio = { "_id" : { $in: productosCompradosIds } }
                gestorBD.obtenerProductos(criterio ,function(productos){
                    var respuesta = swig.renderFile('views/bcompras.html', 
                    {
                        productos : productos 
                    });
                    res.send(respuesta);
                });
            }
        });
    })

};