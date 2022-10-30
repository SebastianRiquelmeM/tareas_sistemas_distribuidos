const express = require("express");
const { Kafka } = require("kafkajs");
//const cors = require('cors');
const mysql = require("mysql");

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

const real_time_coordenadas = async () => {
	console.log("\n\n\n-------Mensaje consumer-------\n\n\n");

	console.log("Iniciando objeto consumer...\n");
	const consumer = kafka.consumer({
		groupId: "coordenadas-consumer" /* , fromBeginning: true */,
	});
	console.log("Consumer iniciado!\n");
	console.log("Conectando a consumer...\n");

	await consumer.connect();
	console.log("Consumer conectado!\n");
	console.log("Suscribiendose al topic...\n");

	await consumer.subscribe({ topic: "coordenadas" });
	console.log("Suscrito al topic!\n");
	console.log("Ejecutando consumer run...\n");
	await consumer.run({
		eachMessage: async ({ topic, partition, message }) => {
			console.log("\n\nTOPIC: ", topic, "\n\n");
			console.log("\n\nPARTITION: ", partition, "\n\n");
			console.log(
				"\nMESSAGE.VALUE: ",
				JSON.parse(message.value.toString()),
				"\n"
			);
			//FALTA GUARDAR EN LA DB

			let data = JSON.parse(message.value.toString());

			console.log("data.Ubicacion: ", data.Ubicacion);

			console.log("data.ubicacion[0]: ", data.Ubicacion[0]);

			try {
				let sql = `INSERT INTO coordenadas (id_patente, coordenada_x, coordenada_y, agente_extranio) 
						VALUES ("${data.Patente}","${data.Ubicacion[0]}","${data.Ubicacion[1]}",
								"${0}") `;
				con.query(sql, function (err, result) {
					if (err) {
						console.log(err);
					} else {
						//Si la query es correcta
						console.log("Query correcta: ", result);
						//callback(null, {Urls: result});
					}
				});
			} catch (error) {
				callback(error, null);
			}
		},
	});

	console.log("Consumer terminado!");
};

real_time_coordenadas();

app.listen(3005, () => {
	console.log("\nServer CONSUMER corriendo en puerto: 3005\n");
});
