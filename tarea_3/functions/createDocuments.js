//exports a function that creates a file,
//the function receives two strings, the name and the content
//of the file to be created

exports.createDocuments = (path, name, content) => {
	//import fs module
	const fs = require("fs");
	fs.writeFile(path + name, content, (err) => {
		if (err) throw err;
		console.log("The file has been saved!");
	});
};
