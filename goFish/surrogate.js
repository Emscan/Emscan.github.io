var extend = function(parent, child) {
	
	var Surrogate = function() {};
	Surrogate.prototype = parent.prototype;

	child.prototype = new Surrogate;
	child._parent = parent;

	child.prototype.super = function(method, args) {
		return child._parent.prototype[method].apply(this, args);
	}
}