const express = require("express");
const { Kafka } = require("kafkajs");
//const cors = require('cors');

const mysql = require("mysql");

const con = mysql.createConnection({
	host: "mariadb",
	user: "root",
	port: 3306,
	password: "rootpass",
	database: "distribuidos",
	connectTimeout: 99999999,
	acquireTimeout: 99999999,
	waitForConnections: true,
	queueLimit: 0,
});

con.connect(function (err) {
	if (err) throw err;
	console.log("Connected to DB!");
});

const app = express();

//app.use(cors());
app.use(express.json());

//Conexion a kafka
const kafka = new Kafka({
	brokers: ["kafka:9092"],
});

const real_time_consumer = async () => {
	console.log("\n\n\n-------Mensaje consumer-------\n\n\n");

	console.log("Iniciando objeto consumer...\n");
	const consumer = kafka.consumer({
		groupId: "registro-venta-consumer" /* , fromBeginning: true */,
	});
	console.log("Consumer iniciado!\n");
	console.log("Conectando a consumer...\n");

	await consumer.connect();
	console.log("Consumer conectado!\n");
	console.log("Suscribiendose al topic...\n");

	await consumer.subscribe({
		topic: "registro-venta" /* , fromBeginning: true */,
	});
	console.log("Suscrito al topic!\n");
	console.log("Ejecutando consumer run...\n");

	await consumer.run({
		eachMessage: async ({ topic, partition, message }) => {
			//console.log("\n\nTOPIC: ", topic,"\n\n")
			//console.log("\n\nMESSAGE: ", message,"\n\n")
			console.log("\n Ahora imprimo el mensaje: \n");
			console.log(
				"\nMESSAGE.VALUE: ",
				JSON.parse(message.value.toString()),
				"\n"
			);

			//GUARDAR EN UNA DB LA VENTA
			let data = JSON.parse(message.value.toString());
			try {
				let sql = `INSERT INTO ventas 
							(id_patente,cliente,cantidad_sopaipillas,hora,stock_restante,coordenada_x,coordenada_y) 
							VALUES ("${data.Patente}","${data.Cliente}",
							"${data.CantSopaipillas}","${data.Hora}","${data.Stock}","${data.coordenada_x}","${data.coordenada_y}") `;

				con.query(sql, function (err, result) {
					if (err) {
						console.log("ERROR MYSQL: ", err);
					} else {
						//Si la query es correcta

						console.log("QUERY CORRECTA MYSQL: ", result);
					}
				});
			} catch (error) {
				console.log("ERROR: ", error);
			}
		},
	});

	console.log("Consumer terminado!");
};

real_time_consumer();

app.listen(3004, () => {
	console.log("\nServer CONSUMER corriendo en puerto: 3004\n");
});

/* let timer = setInterval(async () => {
	const data = await dummyGetData();
	console.log(data);
	clearInterval(timer);
}, 1000);
 */
