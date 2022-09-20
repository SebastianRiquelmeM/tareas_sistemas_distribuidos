const axios = require('axios').default;
const mysql = require('mysql');




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