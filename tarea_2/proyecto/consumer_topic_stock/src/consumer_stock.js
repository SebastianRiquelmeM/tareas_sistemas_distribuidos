const express = require("express");
const { Kafka } = require("kafkajs");
//const cors = require('cors');
const app = express();

//app.use(cors());
app.use(express.json());

//Conexion a kafka
const kafka = new Kafka({
	brokers: ["kafka:9092"],
});

// Este script debe leer constantemente el ventas e ir sumando a una cola,
// para luego dar una notificacion

const real_time_stock = async () => {
	console.log("\n\n\n-------Mensaje consumer-------\n\n\n");

	console.log("Iniciando objeto consumer...\n");
	const consumer = kafka.consumer({
		groupId: "test-topic-consumer" /* , fromBeginning: true */,
	});
	console.log("Consumer iniciado!\n");
	console.log("Conectando a consumer...\n");

	await consumer.connect();
	console.log("Consumer conectado!\n");
	console.log("Suscribiendose al topic...\n");

	await consumer.subscribe({ topic: "registro-venta" });
	console.log("Suscrito al topic!\n");
	console.log("Ejecutando consumer run...\n");

	var cola = [];
	await consumer.run({
		eachMessage: async ({ topic, partition, message }) => {
			//console.log("\n\nTOPIC: ", topic,"\n\n")
			//console.log("\n\nMESSAGE: ", message,"\n\n")

			let data = message.value.toString();
			console.log("\nMESSAGE:VALUE: ", data, "\n");
			//let data = JSON.parse(message.value)    ;
			//console.log(data)
			cola.push(data);

			console.log("\n\n\n COLA: ", data, "\n\n\n");

			if (cola.length == 5) {
				console.log("\n\n Lote de entrega de tamanio 5 listo \n\n");
				cola = [];
			}
		},
	});
};

real_time_stock();

app.listen(3006, () => {
	console.log("\nServer CONSUMER corriendo en puerto: 3006\n");
});
