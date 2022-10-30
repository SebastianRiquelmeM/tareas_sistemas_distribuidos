const express = require("express");
const mysql = require("mysql");
//const cors = require('cors');
const axios = require("axios");

const app = express();

//app.use(cors());
app.use(express.json());

const con = mysql.createConnection({
	//host: "172.30.3.3",
	host: "distribuidos-mariadb",
	// PONER PUERTO(?)
	user: "root",
	password: "rootpass",
	database: "distribuidos",
	connectTimeout: 99999999,
	acquireTimeout: 99999999,
	waitForConnections: true,
	queueLimit: 0,
});

//Trozo de codigo para realizar una query, /esta se mete a la funcion pa realizar la query

const generar_coordenadas = () => {
	try {
		let sql = `SELECT id_patente FROM registro_miembro`;
		con.query(sql, function (err, result) {
			if (err) {
				console.log(err);
			} else {
				//Si la query es correcta
				console.log(result[0]);
				var list_id_patente = result;

				//Este for itera todas las coordenadas
				for (let i = 0; i < list_id_patente.length; i++) {
					try {
						//Obtenemos la ultima posicion de cada carrito
						let sql = `SELECT coordenada_x, coordenada_y FROM coordenadas 
									WHERE id_patente="${list_id_patente[i].id_patente}" 
									ORDER BY id DESC LIMIT 1`;
						con.query(sql, function (err, result) {
							if (err) {
								console.log(err);
							} else {
								//Si la query es correcta
								console.log(result);
								//Las coordenadas actuales
								let coo_x = result[0].coordenada_x;
								let coo_y = result[0].coordenada_y;

								console.log(
									"Coordenadas actuales: [",
									coo_x,
									", ",
									coo_y,
									"]"
								);

								//Las nuevas coordenadas tendras 50% de
								//probabilidad de aumentar o disminuir en cada eje
								let new_coo_x = 0;
								let new_coo_y = 0;

								if (Math.random() < 0.5) {
									new_coo_x = coo_x + 1;
								} else {
									new_coo_x = coo_x - 1;
								}

								if (Math.random() < 0.5) {
									new_coo_y = coo_y + 1;
								} else {
									new_coo_y = coo_y - 1;
								}

								// caso borde en que se salga de la matriz 100x100

								if (new_coo_x < 0) {
									new_coo_x = 99;
								} else if (new_coo_x > 99) {
									new_coo_x = 0;
								}

								if (new_coo_y < 0) {
									new_coo_y = 99;
								} else if (new_coo_y > 99) {
									new_coo_y = 0;
								}

								console.log("\nNuevas coordenadas: ");
								console.log("new_coo_x: ", new_coo_x);
								console.log("new_coo_y: ", new_coo_y);
								//Enviamos las nuevas coordenadas al API de
								// producer coordenadas

								console.log(
									"\n list_id_patente[i].id_patente: ",
									list_id_patente[i].id_patente
								);
								/* 								let datos = {
									Patente: list_id_patente[i].id_patente,
									Ubicacion: [new_coo_x, new_coo_y],
								};
								axios
									.post(
										"http://producer_tarea:3000/ubicacion",
										JSON.stringify(datos)
									)
									.then(function (response) {
										console.log(response);
									})
									.catch(function (error) {
										console.log(error);
									}); */

								var data = JSON.stringify({
									Patente: list_id_patente[i].id_patente,
									Ubicacion: [new_coo_x, new_coo_y],
								});

								var config = {
									method: "post",
									url: "http://producer_tarea:3000/ubicacion",
									headers: {
										"Content-Type": "application/json",
									},
									data: data,
								};

								axios(config)
									.then(function (response) {
										console.log("Respuesta en axios: ");
										console.log(
											JSON.stringify(response.data)
										);
									})
									.catch(function (error) {
										console.log("ERROR en axios: ", error);
									});
							}
						});
					} catch (error) {
						callback(error, null);
					}
				}
				//callback(null, { Urls: result });
			}
		});
	} catch (error) {
		callback(error, null);
	}
};
setInterval(function () {
	setTimeout(() => {
		generar_coordenadas();
	}, 5000);
}, 30000);

app.listen(3007, () => {
	console.log("\nServer CONSUMER corriendo en puerto: 3007\n");
});
