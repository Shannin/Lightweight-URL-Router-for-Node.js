# Lightweight Router for Node.js

This is a simple and lightweight path router module for a Node.js.  The module parses a resource path (e.g. /hello/world) and creates a routing tree that can be traversed at any time.  If there is a match on traversal, the assigned callback function at the destination node will be called.

Features include being able to define parameters and multiple callbacks for paths.  Parameters can be specified by prepending a colon ':' to the front of a path segment.  Parameters are passed to the defined callback function.  Callback methods are assigned when defining the path and callback.

This module was designed to be used in conjunction with static file servers to build small-scale web services (i.e. websites, RESTful APIs, etc.) quicky.




##Usage

#### Include
```
var routingTree = require('RoutingTree');
  , tree = new routingTree.RoutingTree();

```


#### Define: Basic
Defines a path to insert into the tree along with a corresponding callback method


```
tree.define("/hello/world", function () {
	console.log("Hello World!");
});

```

#### Define: With Parameters
Prepending a colon ':' before a path segment will pass the value supplied when calling 'match' to the callback function.

```
tree.define("/hello/:name", function (name) {
	console.log("Hello, " + name + "!");
});

```

You can pass multiple parameters to the callback function.  The order of the arguments can be arbitrary as the module uses introspection to set the value set in the path on traversal to the correct argument.

```
tree.define("/joke/:name/:response", function (name, response) {
	console.log("Knock Knock\nWho's There?\n" + name + "\n" + name + " who?\n" + response);
});
```

### Define: Methods
By providing a method when defining a path, you can assign multiple callbacks to one path.  This is especially useful when using the module for routing URL paths and need to specify actions for different HTTP requests (GET, POST, etc.).

```
tree.define("GET", "/login", function () {
	// display form
});

tree.define("POST", "/login", function () {
	// process user submitted form
});
```



#### Perform
Traverses the tree using the path passed to the function.  If there is a valid path in the tree, the callback function in the destination node is called.  If no method is provided and there is only one callback defined, said callback will be called.  Multiple callbacks and no matching method will result in error.

```
tree.perform("/hello/world"); // GOOD, will call callback
tree.perfrom("GET", "/login");	 // GOOD, will call callback
tree.perform("/login"); // ERROR
```

#### Match
Traverses the tree using the path passed to the function.  If there is a valid path in the tree, the function returns `true`, else `false`.


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

Specifying a method checks specifically for a callback for that method.  If no method provided, returns `true` on the existance of any callback.

```
tree.match("GET", "/login"); // TRUE
tree.match("/login"); // TRUE
tree.match("NONE", "/login"); // FALSE
```

## To Do
* Add wildcard paths
* Add ability to define default method
* Demos, specifically with a static file server