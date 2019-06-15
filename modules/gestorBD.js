module.exports = {
	mongo : null,
	app : null,
	init : function(app, mongo) {
		this.mongo = mongo;
		this.app = app;
	},

	insertarProducto : function(producto, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				var collection = db.collection('productos');
				collection.insert(producto, function(err, result) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(result.ops[0]._id);
					}
					db.close();
				});
			}
		});
	},

	obtenerProductos : function(criterio, functionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				functionCallback(null);
			} else {
				var collection = db.collection('productos');
				collection.find(criterio).toArray(function(err, productos) {
					if (err) {
						functionCallback(productos);
					} else {
						functionCallback(productos);
					}
					db.close();
				});
			}
		});
	},

	eliminarProducto : function(criterio, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				var collection = db.collection('productos');
				collection.remove(criterio, function(err, result) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(result);
					}
					db.close();
				})
			}
		})
	},

	insertarUsuario : function(usuario, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				var collection = db.collection('usuarios');
				collection.insert(usuario, function(err, result) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(result.ops[0]._id);
					}
					db.close();
				});
			}
		});
	},

	obtenerUsuarios : function(criterio, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				var collection = db.collection('usuarios');
				collection.find(criterio).toArray(function(err, usuarios) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(usuarios);
					}
					db.close()
				});
			}
		});
	},

	modificarProducto : function(criterio, producto, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				var collection = db.collection('productos');
				collection.update(criterio, {$set: producto}, function(err, result) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(result);
					}
					db.close()
				});
			}
		});
	},

	eliminarProducto : function(criterio , funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				var collection = db.collection('productos');
				collection.remove(criterio, function(err, result) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(result);
					}
					db.close();
				});
			}
		});
	},

	insertarCompra: function(compra, funcionCallback) {
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				var collection = db.collection('compras');
				collection.insert(compra, function(err, result) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(result.ops[0]._id);
					}
					db.close();
				});
			}
		});
	},

	obtenerCompras : function(criterio,funcionCallback){
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				
				var collection = db.collection('compras');
				collection.find(criterio).toArray(function(err, usuarios) {
					if (err) {
						funcionCallback(null);
					} else {
						funcionCallback(usuarios);
					}
					db.close();
				});
			}
		});
	},
	
	obtenerProductosPg : function(criterio, pg, funcionCallback){
		this.mongo.MongoClient.connect(this.app.get('db'), function(err, db) {
			if (err) {
				funcionCallback(null);
			} else {
				
				var collection = db.collection('productos');
				collection.count(function(err, count){
	
					collection.find(criterio).skip( (pg-1)*4 ).limit( 4 )
						.toArray(function(err, productos) {
							
						if (err) {
							funcionCallback(null);
						} else {
							funcionCallback(productos, count);
						}
						db.close();
					});
					
				});
			}
		});
	},

};