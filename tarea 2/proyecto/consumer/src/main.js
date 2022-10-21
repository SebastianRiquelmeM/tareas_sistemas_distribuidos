const express = require('express');

const app = express();


app.get('/', (req, res) => {

    console.log("\n\n\n-------bastiwell funciona--------\n\n\n")

});


app.listen(3000, () => {
	console.log("\nServer CONSUMER corriendo en puerto: 3000\n");
});