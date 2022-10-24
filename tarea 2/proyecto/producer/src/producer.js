const express = require('express');
const { Kafka } = require('kafkajs');
//const cors = require('cors');
const app = express();

//app.use(cors());
app.use(express.json());

const kafka = new Kafka({
    brokers: [process.env.kafkaHost]
});

const producer = kafka.producer();



app.post('/', async (req, res) => {
    console.log("\n\n\n-------Mensaje producer--------\n\n\n")
    await producer.connect()
    await producer.send({
        topic: 'test-topic',
        messages: [
          JSON.stringify({ value: 'Hello KafkaJS user!' }),
        ],
    })
});


app.listen(6000, () => {
	console.log("\nServer PRODUCER corriendo en puerto: 6000\n");
});