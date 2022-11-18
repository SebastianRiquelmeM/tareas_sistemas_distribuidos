// Load Wikiapi module
const Wikiapi = require("wikiapi");

// OPEN ASYNC DOMAIN:
(async () => {
	// LOGIN IN: In any wiki, any language
	const wiki = new Wikiapi("https://es.wikipedia.org/w/api.php"); // or new Wikiapi('https://zh.wikipedia.org/w/api.php')
	await wiki.login("Udpdistribuidos", "JDW@z@Mur%Z7j.A"); // get your own account and password on your target wiki.

	/* ***************************************************** */
	/* READ ONLY ******************************************* */
	// load page
	let page_data = await wiki.page("Universo", {});
	console.log("page_data: ", page_data);
	console.log("page_data.text: ", page_data.wikitext);
     

	// CLOSE ASYNC DOMAIN:
})();

