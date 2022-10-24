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

app.post('/', async (req, res) => {
    console.log("\n\n\n-------Mensaje producer--------\n\n\n")

    // remember to connect and disconnect when you are done
    await admin.connect();

    
/*     await admin.createTopics({
        validateOnly: false,
        waitForLeaders: true,
        timeout: 5000,
        topics: [{
            topic: 'test-topic',
            numPartitions: 2 */ /*,     // default: -1 (uses broker `num.partitions` configuration)
            replicationFactor: 2, // default: -1 (uses broker `default.replication.factor` configuration)
            replicaAssignment: <Array>,  // Example: [{ partition: 0, replicas: [0,1,2] }] - default: []
            configEntries: <Array>       // Example: [{ name: 'cleanup.policy', value: 'compact' }] - default: []
        */
/*         }]
    }); */  

    //chantar timeout

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