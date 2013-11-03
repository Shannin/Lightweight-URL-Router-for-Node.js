var RoutingTree = require('./RoutingTree').RoutingTree;
var tree = new RoutingTree();


tree.define("/hello/:name", function (name) {
	console.log("Hello, " + name + "!");
});

tree.define("/hello/world", function () {
	console.log("Hello World.");
});

tree.define("/hello/world", function () {			// DUPLICATE
	console.log("Hello World.");
});

tree.define("/joke/:name/:response", function (response, name) {
	console.log("Knock Knock\nWho's There?\n" + name + "\n" + name + " who?\n" + response);
});

tree.define("GET", "/form", function () {
	console.log("Form: GET");
});

tree.define("POST", "/form", function () {
	console.log("Form: POST");
});

tree.define("GET", "/", function () {				
	console.log("You're at the root!");
});

tree.define("GET", "/", function () {				// DUPLICATE
	console.log("Defined again!");
});

tree.perform("/joke/Ken/Ken%20you%20tell%20me%20a%20decent%20joke");
tree.perform("/this/path/doesnt/exist");

tree.perform("GET", "/form");
tree.perform("POST", "/form");
tree.perform("NONE", "/form");
tree.perform("/form");
tree.perform("GET", "/");
tree.perform("/");

console.log(tree.match("/hello/Shannin"));
console.log(tree.match("/joke"));
console.log(tree.match("GET", "/form"));
console.log(tree.match("/form"));
console.log(tree.match("NONE", "/form"));








