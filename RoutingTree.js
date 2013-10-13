

var RoutingTreeNode = function (key, param) {
	if (!key)
		new Error('RoutingTreeNode needs key');

	this.key = key;
	if (param) {
		this.key = ':';
		this.param = param;
	}
		
	this.children = [];
	this.callback;
};


var RoutingTree = function () {
	this.root = new RoutingTreeNode ('/');
};

RoutingTree.prototype.define = function (url, callback)
{
	if (!url)
		new Error('define needs URL');

	if (callback && typeof callback !== 'function')
		new Error('callback must be a function');

	if ((urlParts = this._defineURLValidate(url))) {
		var root = this.root;
		this._recursiveInsert(root, urlParts, callback);
	}
};

RoutingTree.prototype._defineURLValidate = function (url)
{
	var expression = /^()[a-zA-Z:]+[a-zA-Z0-9.\/_]*$/

	url = decodeURIComponent(url);
	if (url.substring(0, 1) == "/")
		url = url.substr(1);

	parts = url.split('/');
	parts.forEach(function (p) {
		if (!expression.test(p)) {
			console.log("Cannot define URL path " + url +". '" + p + "' is invalid.");

			return false;
		}
	});

	return parts;
}

RoutingTree.prototype._recursiveInsert = function (curNode, paths, callback)
{
	var key  = paths.shift()
	var param;

	if (key.substring(0, 1) === ':') {
		param = key.substr(1);
		key = ':';
	}

	for (var i = 0; i < curNode.children.length; i++) {
		if (curNode.children[i].key === key) {
			if (paths.length) {
				this._recursiveInsert(curNode.children[i], paths, callback);
			} else {
				// PATH HAS ALREADY BEEN DEFINED, BUT COULD POSSIBLY STILL SET CALLBACK AT CURRENT NODE	

				if (!curNode.children[i].callback)
					curNode.children[i].callback = callback
				else
					console.log('ALREADY DEFINED');
			}

			return;
		}
	}

	var node = new RoutingTreeNode(key, param);
	curNode.children.push(node);

	if (paths.length) {
		this._recursiveInsert(node, paths, callback);
	} else {
		node.callback = callback;
	}
};


RoutingTree.prototype.find = function (url)
{
	if (!url)
		new Error("find requires a URL path");

	urlParts = [];
	url.split('/').forEach(function (p) {
		if (p.length)
			urlParts.push(decodeURIComponent(p.trim()));
	});

	if (urlParts.length) {
		var root = this.root;
		var found = this._traverse(root, urlParts, []);
		var callback = found[0];
		var params = found[1];

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
		}
	}
};

RoutingTree.prototype.match = function (url)
{
	if (!url)
		new Error("find requires a URL path");

	urlParts = [];
	url.split('/').forEach(function (p) {
		if (p.length)
			urlParts.push(decodeURIComponent(p.trim()));
	});

	if (urlParts.length) {
		var root = this.root;

		var found = this._traverse(root, urlParts, []);
		return found[0] ? true : false;
	}

	return false;
};

RoutingTree.prototype._traverse = function (curNode, paths, params)
{
	var self = this;
	var key = paths.shift();

	var paramNode;
	for (var i = 0; i < curNode.children.length; i++) {
		if (curNode.children[i].key === key) {
			return self._traverse(curNode.children[i], paths, params);
		} else if (curNode.children[i].key === ':') {
			paramNode = curNode.children[i];
		}
	}

	if (paramNode) {
		params.push([paramNode.param, key]);

		if (paths.length)
			return self._traverse(paramNode, paths, params);
		else
			return [paramNode.callback, params];
	} else {
		return [curNode.callback, params];
	}
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