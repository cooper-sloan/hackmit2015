
exports.createParse = function () {
    var masterKey = process.argv.length > 2 ? process.argv[2] : null;
    if (masterKey != null) {
        var Parse = require('parse').Parse;
        var appId = "VS1T5swhzUeOgWkGHLhwy3odwJptBkwqa5Mdj4JG";
        var jsKey = "8tNjhuNrxQ1LEhsJzjFMPjqVAWUEbXbOE1Fceqsu";
        Parse.initialize(appId, jsKey, masterKey);
        Parse.Cloud.useMasterKey();
        return Parse;
    } else {
        console.log("ARGS" + masterKey + " " + env);
        throw "You must provide both the enviroment name [dev/prod] and the master key as arguments";
    }
};