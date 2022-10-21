const express = require('express');

const app = express();


app.get('/', (req, res) => {

    console.log("\n\n\n-------bastiwell funciona--------\n\n\n")

});


app.listen(6000, () => {
	console.log("\nServer PRODUCER corriendo en puerto: 6000\n");
});