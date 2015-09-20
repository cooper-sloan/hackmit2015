exports.createParse = function () {
    //var masterKey = process.argv.length > 2 ? process.argv[2] : null;
    var masterKey = "KXLpzX2RnvLvJw5jYrWCcG6RyDbkmrMB1l3rAYVy"
    if (masterKey != null) {
        var Parse = require('parse/node').Parse;
        var appId = "VS1T5swhzUeOgWkGHLhwy3odwJptBkwqa5Mdj4JG";
        var jsKey = "8tNjhuNrxQ1LEhsJzjFMPjqVAWUEbXbOE1Fceqsu";
        Parse.initialize(appId, jsKey, masterKey);
        Parse.Cloud.useMasterKey();
        return Parse;
    } else {
        throw "You must provide both the enviroment name [dev/prod] and the master key as arguments";
    }
};


