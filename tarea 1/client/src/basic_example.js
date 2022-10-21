const axios = require('axios').default;
const mysql = require('mysql');


const prompt = require("prompt-sync")({ sigint: true });
//const age = prompt("How old are you? ");
//console.log(`You are ${age} years old.`);


console.log("Que keyword desea buscar?")
const keyword = prompt("Keyword: ");


axios.post('http://localhost:3000/keyword', 
{
    "keyword": keyword
},
{
    headers: { 'Content-Type': 'application/json' },
}
)
.then(function (response) {
    console.log(response.data)
})
.catch(function (error) {
    console.log(error);
});