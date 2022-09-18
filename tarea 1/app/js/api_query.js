document.getElementById('botonCat').onclick = function(event) {
    console.log("click!!!")
    axios.post('http://localhost:3000/keyword', 
        {
            "keyword": "ghost"
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
}



