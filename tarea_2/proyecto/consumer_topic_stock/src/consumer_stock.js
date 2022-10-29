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

app.get("/", async (req, res) => {
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

	await consumer.subscribe({ topic: "test-topic", fromBeginning: true });
	console.log("Suscrito al topic!\n");
	console.log("Ejecutando consumer run...\n");
	await consumer.run({
		eachMessage: async ({ topic, partition, message }) => {
			//console.log("\n\nTOPIC: ", topic,"\n\n")
			//console.log("\n\nMESSAGE: ", message,"\n\n")
			console.log("\nMESSAGE:VALUE: ", message.value.toString(), "\n");
			//let data = JSON.parse(message.value)    ;
			//console.log(data)
		},
	});

	console.log("Consumer terminado!");

	res.send("Consumer terminado!", message.value.toString());
});

app.listen(3006, () => {
	console.log("\nServer CONSUMER corriendo en puerto: 3006\n");
});
