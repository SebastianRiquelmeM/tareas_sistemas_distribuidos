const express = require("express");
const { Kafka } = require("kafkajs");
const mysql = require("mysql");
//const cors = require('cors');
const app = express();

//app.use(cors());
app.use(express.json());

//Conexion a kafka
const kafka = new Kafka({
	brokers: ["kafka:9092"],
});

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
/* try {
    let sql = `SELECT * FROM urls LIMIT 10`;
    con.query(sql, function (err, result) {

        if (err){
            console.log(err);
        }
        else{ //Si la query es correcta
            console.log(result)
            callback(null, {Urls: result});
        }
    });
} catch (error) {
  callback(error, null);
} */

app.get("/consumer_registro_miembro", async (req, res) => {
	console.log("\n\n\n-------Mensaje consumer-------\n\n\n");

	console.log("Iniciando objeto consumer...\n");
	const consumer = kafka.consumer({
		groupId: "nuevos-miembros-consumer" /* , fromBeginning: true */,
	});
	console.log("Consumer iniciado!\n");
	console.log("Conectando a consumer...\n");

	await consumer.connect();
	console.log("Consumer conectado!\n");
	console.log("Suscribiendose al topic...\n");

	await consumer.subscribe({ topic: "nuevos-miembros", fromBeginning: true });
	console.log("Suscrito al topic!\n");
	console.log("Ejecutando consumer run...\n");
	await consumer.run({
		eachMessage: async ({ topic, partition, message }) => {
			console.log("\n\nTOPIC: ", topic, "\n\n");
			console.log("\n\npartition: ", partition, "\n\n");
			console.log("Voy a imprimir los datos: \n");
			let data = JSON.parse(message.value.toString());

			//if particion corresponde a la de premium y se mete a la db
			if (partition == 0) {
				try {
					let sql = `INSERT INTO registro_miembro (nombre,apellido,rut,correo,tipo_registro) VALUES ("${data.Nombre}","${data.Apellido}","${data.Rut}","${data.Correo}","${data.Patente}","${data.Registro}") `;
					con.query(sql, function (err, result) {
						if (err) {
							console.log(err);
						} else {
							//Si la query es correcta
							console.log(result);
							//callback(null, {Urls: result});
						}
					});
				} catch (error) {
					callback(error, null);
				}
			} else {
				try {
					let sql = `INSERT INTO registro_miembro (nombre,apellido,rut,correo,tipo_registro) VALUES ("${data.Nombre}","${data.Apellido}","${data.Rut}","${data.Correo}","${data.Patente}","${data.Registro}") `;
					con.query(sql, function (err, result) {
						if (err) {
							console.log(err);
						} else {
							//Si la query es correcta
							console.log(result);
							//callback(null, { Urls: result });
						}
					});
				} catch (error) {
					callback(error, null);
				}
			}

			//let data = JSON.parse(message.value.toString());
			console.log("\n\nMESSAGE:VALUE: ", data, "\n\n");

			//let data = JSON.parse(message.value)    ;
			//console.log(data)
		},
	});

	console.log("Consumer terminado!");

	res.send("Consumer terminado!");
});

app.listen(3001, () => {
	console.log("\nServer CONSUMER corriendo en puerto: 3001\n");
});
