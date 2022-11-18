exports.generateArticles = () => {
	const createDocuments = require("./createDocuments");
	const articles = [
		"Universo",
		"Macrodatos",
		"Universidad Diego Portales",
		"Informática",
		"Programación",
		"Ciencias de la computación",
		"Teoría de la complejidad computacional",
		"Análisis de algoritmos",
		"Algoritmo",
		"Matemáticas",
	];

	// for que itera articles y para cada elemento del arreglo
	// ejecuta la funcion readWikipedia.js
	// la funcion readWikipedia.js recibe un string que es el nombre
	// de un articulo en wikipedia y retorna el contenido del articulo
	// en formato string, luego crea un documento con el nombre del
	// articulo y el contenido del articulo
	for (let i = 0; i < articles.length; i++) {
		const readWikipedia = require("./readWikipedia");
		readWikipedia.readWikipedia(articles[i]).then((data) => {
			if (i + 1 <= 5) {
				createDocuments.createDocuments(
					"./documents/1/",
					String(i + 1) + articles[i],
					data
				);
			} else {
				createDocuments.createDocuments(
					"./documents/2/",
					String(i + 1) + articles[i],
					data
				);
			}
		});
	}
};
