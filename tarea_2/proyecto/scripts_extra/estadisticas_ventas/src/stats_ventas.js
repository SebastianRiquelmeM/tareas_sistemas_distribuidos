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

const generar_estadisticas = () => {
	try {
		let sql = `SELECT id_patente FROM registro_miembro`;
		con.query(sql, function (err, result) {
			if (err) {
				console.log(err);
			} else {
				//Si la query es correcta
				/* console.log("Query id_patente miembros: ", result); */
				var list_id_patente = result;

				//Este for itera todas las coordenadas
				for (let i = 0; i < list_id_patente.length; i++) {
					try {
						//Obtenemos las ventas de un carrito en el dia
						let sql = `SELECT * FROM ventas where id_patente = "${list_id_patente[i].id_patente}" AND hora >= NOW() - INTERVAL 1 DAY`;
						con.query(sql, function (err, result) {
							if (err) {
								console.log(err);
							} else {
								//Si la query es correcta
								/* 								console.log(
									"Ventas para el id_patente ",
									list_id_patente[i].id_patente,
									": ",
									result
								);
 */
								//Calculo ventas totales

								let ventas_totales = result.length;

								// calculo cantidad de sopaipillas en promedio por venta
								let total = 0;
								for (let i = 0; i < result.length; i++) {
									total += result[i].cantidad_sopaipillas;
								}
								let promedio_cantidad_sopaipillas =
									total / ventas_totales;

								//Ahora para contar los clientes, los agregaré todos a un set c:
								let myset = new Set();

								for (let i = 0; i < result.length; i++) {
									myset.add(result[i].cliente);
								}

								let clientes_totales = myset.size;

								console.log(
									"\n\nRESULTADO PROCESAMIENTO VENTAS DIARIAS"
								);
								console.log("Ventas totales: ", ventas_totales);
								console.log(
									"Cantidad promedio de sopaipillas por venta: ",
									promedio_cantidad_sopaipillas
								);
								console.log(
									"Cantidad de clientes: ",
									clientes_totales
								);
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
	generar_estadisticas();
}, 1000 * 60 * 60 * 24);

app.listen(3008, () => {
	console.log("\nServer CONSUMER corriendo en puerto: 3008\n");
});
