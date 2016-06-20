var fs = require('fs');
var JSIO = jsio.__jsio;

var conditionalImport = /(\s*import\s+)([^=+*"',\s\r\n;\/]+\|[^=+"',\s\r\n;\/]+)(\s*[^'";=]+)/gm;

function replace(path, raw, p1, p2, p3) {
	if (!/\/\//.test(p1)) {
		var opts = p2.split('|');

		for(var i = 0; i < opts.length; i++) {
			var modules = JSIO.__util.resolveModulePath(opts[i], path);
			var found = false;
			for (var j = 0; j < modules.length; j++) {
				if (fs.existsSync(modules[j].path)) {
					found = true;
					break;
				}
			}
			if (found) {
				p2 = opts[i];
				break;
			}
		}

                return p1 + p2 + p3;
        }
        return raw;
}

exports = function (path, moduleDef, opts) {
	moduleDef.src = moduleDef.src.replace(conditionalImport, replace.bind(null, path));
}
