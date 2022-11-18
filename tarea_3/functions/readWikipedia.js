//funcion que recibe un string que es el nombre de un articulo
//en wikipedia y retorna el contenido del articulo en formato
//string
exports.readWikipedia = async (articleName) => {
	const Wikiapi = require("wikiapi");
	const wiki = new Wikiapi("https://es.wikipedia.org/w/api.php");
	let page_data = await wiki.page(articleName, {});
	return page_data.wikitext;
};
