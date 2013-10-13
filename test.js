var RoutingTree = require('./RoutingTree').RoutingTree;
var tree = new RoutingTree();



tree.define("/hello/:name", function (name) {
	console.log("Hello, " + name + "!");
});

tree.define("/hello/world", function () {
	console.log("Hello World.");
});

tree.define("/hello/world", function () {
	console.log("Hello World.");
});

tree.define("/joke/:name/:response", function (response, name) {
	console.log("Knock Knock\nWho's There?\n" + name + "\n" + name + " who?\n" + response);
});

tree.find("/joke/Ken/Ken%20you%20tell%20me%20a%20decent%20joke?");
tree.find("/this/path/doesnt/exist");


console.log(tree.match("/hello/Shannin"));
console.log(tree.match("/joke"));