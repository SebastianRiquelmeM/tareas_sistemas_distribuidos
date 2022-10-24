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

// Usamos admin para crear topics
const admin = kafka.admin();

app.get('/', async (req, res) => {
    console.log("\n\n\n-------Mensaje producer--------\n\n\n")

    // remember to connect and disconnect when you are done
    //await admin.connect();

    
/*     await admin.createTopics({
        validateOnly: false,
        waitForLeaders: true,
        timeout: 5000,
        topics: [{
            topic: 'test-topic',
            numPartitions: 2 */ 
/*         }]
    }); */  

    //chantar timeout
    console.log("Producer conectando...")
    await producer.connect()
    console.log("Producer conectado!")

    //AQUI CAGA
    await producer.send({
        topic: "test-topic",
        //value: JSON.stringify(user)
        messages: [{ value: JSON.stringify(

            {
                mensaje: "Hola desde JS producer en docker"
            }

        ) }],
        
    })

    console.log("Producer send terminado!")
});


app.listen(6000, () => {
	console.log("\nServer PRODUCER corriendo en puerto: 6000\n");
});