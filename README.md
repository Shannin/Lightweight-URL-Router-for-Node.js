# Lightweight URL Router for Node.js
---

This is a simple and lightweight URL router module for a Node.js based RESTful web service.  The module creates a routing tree from a set of defined URL paths that can be traversed by supplying a URL you want to match.  This module also allows you to define sections of the URL path as parameters to be passed to the callback function.  This module can be used in conjunction with a simple static file server to build small-scale RESTful APIs quickly.


##Usage
----

#### Include
```
var routingTree = require('RoutingTree');
var tree = new routingTree.RoutingTree();

```


#### Define: Basic
Defines a URL path to insert into the tree and callback method


```
tree.define("/hello/world", function () {
	console.log("Hello World!");
});

```


#### Define: With Parameters
Appending a colon ':' before a path segment will pass the value supplied in the call URL to the callback function

```
tree.define("/hello/:name", function (name) {
	console.log("Hello, " + name + "!");
});

```

You can pass multiple parameters to the callback function.  The order of the arguments can be arbitrary as the module uses introspection to set the value set in the call URL to the correct argument.

```
tree.define("/joke/:name/:response", function (name, response) {
	console.log("Knock Knock\nWho's There?\n" + name + "\n" + name + " who?\n" + response);
});
```


#### Find
Traverses the tree using the URL path passed to the function.  If there is a valid path in the tree, the callback function in the destination node is called.

```
tree.find("/hello/world");
```

#### Match
Traverses the tree using the URL path passed to the function.  If there is a valid path in the tree, the function returns `true`, else `false`.


```
if (tree.match("/hello/world")) {
	console.log("There was a match!");
} else {
	console.log("No match :(");
}
```

`match` also returns true if there is a valid path with parameters.

```
tree.match("/hello/world"); // TRUE
tree.match("/hello/Shannin"); // TRUE
tree.match("/joke/only_one_param"); // FALSE
```

## To Do
----
* Add more tests
* Add more error checking / reporting
* Specify request type (GET, POST, etc.) when defining path and callback
* Demos, specifically with a static file server