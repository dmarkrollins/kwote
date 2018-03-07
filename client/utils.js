if (!String.prototype.includes) {
    String.prototype.includes = function (search, start) {
        if (typeof start !== 'number') {
            start = 0;
        }

        if (start + search.length > this.length) {
            return false;
        }
        return this.indexOf(search, start) !== -1;
    };
}

if (!String.prototype.toProperCase) {
    String.prototype.toProperCase = function () {
        return this.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    };
}

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
    };
}

// sprintf
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args;
        args = arguments; // eslint-disable-line
        if (args.length === 1 && args[0] !== null && typeof args[0] === 'object') {
            args = args[0]; // eslint-disable-line
        }
        return this.replace(/{([^}]*)}/g, function (match, key) {
            return (typeof args[key] !== 'undefined' ? args[key] : match);
        });
    };
}
