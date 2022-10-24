const express = require('express');
const { Kafka } = require('kafkajs');
//const cors = require('cors');
const app = express();

//app.use(cors());
app.use(express.json());

const kafka = new Kafka({
    brokers: [process.env.kafkaHost]
});




const consumidor = async () => {
    const consumer = kafka.consumer({ groupId: 'test-topic-consumer', fromBeginning: true });
    await consumer.connect();
    await consumer.subscribe({ topic: 'test-topic' });
    await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                let data = JSON.parse(message.value.toString());
                console.log(data)
            }
    })
}


app.listen(3000, () => {
	console.log("\nServer CONSUMER corriendo en puerto: 3000\n");
});