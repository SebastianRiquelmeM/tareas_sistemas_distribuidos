class ClassComp {
    init(params){
        this.eGui = document.createElement('div');
    }  

    getGui() {
        return this.eGui;
    }

    refresh() {
        return false
    }

    destroy() {}
}

function deselect(){
    gridOptions.api.deselectAll()
}

// Grid Options are properties passed to the grid
const gridOptions = {

     // each entry here represents one column
     columnDefs: [
       { field: "id" },
       { field: "title" },
       { field: "description" },
       { field: "URL" }
     ],

     // default col def properties get applied to all columns
     defaultColDef: {sortable: true, filter: true},

     rowSelection: 'multiple', // allow rows to be selected
     animateRows: true, // have rows animate to new positions when sorted

     // example event handler
     /*
     onCellClicked: params => {
       console.log('Celda clickeada!', params.data)
     }*/
};

// get div to host the grid
const eGridDiv = document.getElementById("tabla_comunas");
// new grid instance, passing in the hosting DIV and Grid Options
new agGrid.Grid(eGridDiv, gridOptions);

// Fetch data from server

axios.post('http://localhost:3000/keyword', 
{
    "keyword": "ghost"
},

{
    headers: { 'Content-Type': 'application/json' },
}
)
.then(function (response) {
    gridOptions.api.setRowData(response.data);
    console.log(response.data)
})
.catch(function (error) {
console.log(error);
});
