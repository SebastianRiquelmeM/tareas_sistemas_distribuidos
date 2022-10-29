const express = require('express');
const { Kafka } = require('kafkajs');
//const cors = require('cors');
const app = express();

//app.use(cors());
app.use(express.json());

const kafka = new Kafka({
    brokers: ["kafka:9092"]
});

const producer = kafka.producer();

app.get('/', async (req, res) => {
    console.log("\n\n\n-------Mensaje producer--------\n\n")

    //chantar timeout
    console.log("Producer conectando...\n")
    await producer.connect()
    console.log("Producer conectado!\n")    

    //AQUI CAGA
    await producer.send({
        topic: "test-topic",
        //value: JSON.stringify(user)
        messages: [{ value: "Hola desde JS" }]
    })

    console.log("Producer send terminado!")

    res.send("Producer send terminado!")
});


app.listen(3003, () => {
	console.log("\nServer PRODUCER corriendo en puerto: 3003\n");
});