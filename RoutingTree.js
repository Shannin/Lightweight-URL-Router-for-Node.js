

var RoutingTreeNode = function (key, param) {
	if (!key)
		new Error('RoutingTreeNode needs key');

	this.key = key;
	if (param) {
		this.key = ':';
		this.param = param;
	}
		
	this.children = [];
	this.callbacks = {};
};


var RoutingTree = function () {
	this.root = new RoutingTreeNode ('root');
};

RoutingTree.prototype.define = function (method, path, callback)
{
	if (typeof path === 'function') {
		callback = path;
		path = method;
		method = "DEFAULT";
	}

	if (!path)
		new Error('define needs path');

	if (callback && typeof callback !== 'function')
		new Error('callback must be a function');

	if ((pathParts = this._definePathValidate(path))) {
		var root = this.root;
		this._recursiveInsert(root, pathParts,method, callback, path);
	}
};

RoutingTree.prototype._definePathValidate = function (path)
{
	var expression = /^()[a-zA-Z:]+[a-zA-Z0-9.\/_]*$/

	path = decodeURIComponent(path);
	if (path.substring(0, 1) == "/")
		path = path.substr(1);

	parts = path.split('/');
	if (parts[0] === '')		// TAKES CARE OF SPECIAL CASE ROOT "/"
		parts[0] = 'root';
	else
		parts.unshift('root');

	parts.forEach(function (p) {
		if (!expression.test(p)) {
			console.log("ERROR: Attepted to define invalid path: /" + path);
			return false;
		}
	});

	return parts;
}

RoutingTree.prototype._recursiveInsert = function (current, paths, method, callback, path)
{
	paths.shift();	// POP CURRENT NODE

	if (paths.length) {
		var key  = paths[0];
		var param;

		if (key.substring(0, 1) === ':') {
			param = key.substr(1);
			key = ':';
		}

		for (var i = 0; i < current.children.length; i++) {
			if (current.children[i].key === key) {
				this._recursiveInsert(current.children[i], paths, method, callback, path);
				return;
			}
		}

		var node = new RoutingTreeNode(key, param);
		current.children.push(node);
		this._recursiveInsert(node, paths, method, callback, path);
		return;
	}



	// SET CALLBACK AT CURRENT NODE
	if (!current.callbacks[method]) {
		current.callbacks[method] = callback;
	} else {
		if (method != "DEFAULT")
			console.log("ERROR: Callback for \"" + method + "\" already defined at path: " + path);
		else
			console.log("ERROR: Callback already defined for path: " + path);
	}
};


RoutingTree.prototype.perform = function (method, path)
{
	if (method && !path) {
		path = method;
		method = null;
	} else if (!method && !path)
		new Error("perform requires a defined path");

	var defined = this._traverse(method, path);
	if (defined) {
		var params = defined[1];
		var callback = null;
		if (method)
			callback = defined[0][method];
		else if (Object.keys(defined[0]).length === 1) {
			var k = Object.keys(defined[0])[0];
			callback = defined[0][k];
		}

		if (callback) {
			var args = [];
			var argNames = this._getFunctionParamNames(callback);

			argNames.forEach(function (arg) {
				params.forEach(function (param) {
					if (param[0] === arg)
						args.push(param[1]);
				});
			});

			callback.apply(this, args);
		} else {
			if (method)
				console.log("ERROR: Callback for method \"" + method + "\" not defined for path: " + path);
			else {
				if (Object.keys(defined[0]).length > 1)
					console.log("ERROR: Multiple callbacks defined for path with no specified method: " + path)
				else
					console.log("ERROR: Callback not defined for path: " + path);
			}
		}
	} else {
		console.log("Path not defined: " + path);
	}
};

RoutingTree.prototype.match = function (method, path)
{
	if (method && !path) {
		path = method;
		method = null;
	} else if (!method && !path)
		new Error("match requires a defined path");

	var defined = this._traverse(method, path);
	if (defined) {
		if (method)
			return defined[0][method] ? true : false;
		else
			return (Object.keys(defined[0]).length >= 1);
	}
		
	return false;
};

RoutingTree.prototype._traverse = function (method, path)
{
	pathParts = [];
	path.split('/').forEach(function (p) {
		if (p.length)
			pathParts.push(decodeURIComponent(p.trim()));
	});

	return this._traverseRecursive(this.root, pathParts, [], method);
};

RoutingTree.prototype._traverseRecursive = function (current, paths, params)
{
	var self = this;
	
	if (paths.length) {
		var key = paths.shift();

		var paramChild;
		for (var i = 0; i < current.children.length; i++) {
			var child = current.children[i];

			if (child.key === key)
				return self._traverseRecursive(child, paths, params);

			if (child.key === ':')
				paramChild = child;
		}

		if (paramChild) {
			params.push([paramChild.param, key]);
			return self._traverseRecursive(paramChild, paths, params);
		}

		return null;
	}	

	return [current.callbacks, params];
};

RoutingTree.prototype._getFunctionParamNames = function (func)
{
	var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;

	var fnStr = func.toString().replace(STRIP_COMMENTS, '')
	var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(/([^\s,]+)/g)

	if(result === null)
		result = [];

	return result;
};


exports.RoutingTree = RoutingTree;