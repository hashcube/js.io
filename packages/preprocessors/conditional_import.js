var fs = require('fs');
var util = jsio.__jsio.__util;

var condRegx = /^(\s*\/\/\s*jsio\s*:\s*if\s*)^([^=]+?)^(\s*\/\/\s*jsio\s*:\s*fi)/gm;
var importRegx = /^(\s*import\s+)([^=+*"',\s\r\n;\/]+)(\s*[^'";=\n\r]*)/gm;

function checkExists(from, path) {
	var modules = util.resolveModulePath(from, path);
	var found = false;

	for (var j = 0; j < modules.length; j++) {
		if (fs.existsSync(util.buildPath(modules[j].directory, modules[j].filename))) {
			found = true;
			break;
		}
	}

	return found;
}

function replace(path, raw, p1, p2, p3) {
	var replaceStr = '';

	while(true) {
		var match = importRegx.exec(p2);
		if (!match) {
			break;
		}

		if (checkExists(match[2])) {
			replaceStr = match[0];
			break;
		}
	}

	return replaceStr;
};

exports = function (path, moduleDef, opts) {
	moduleDef.src = moduleDef.src.replace(condRegx, replace.bind(null, path));
};
