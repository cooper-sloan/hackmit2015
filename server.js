// server.js

    // set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
    var port= process.env.PORT || 8080;
    var spotifyWebApi= require("spotify-web-api-node")
    var echojs= require('echojs')

    var parseDB= require('./parse_wrappers.js')
    // configuration =================


    app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
    
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());
    //init spotify connection
    var clientId="48fde8e7a241492d80498fa6238f9bba";
    var clientSecret="e7b5d4d1ddd2462d91d50d0bd82c1276";
    var redirect_uri = 'http://localhost:8080/callback';
    var accessToken="";
    

    app.get('/callback',function(req,res){
        res.sendfile("/public/index.html")
    })


    var spotifyApi = new spotifyWebApi({
      clientId : '48fde8e7a241492d80498fa6238f9bba',
      clientSecret : 'e7b5d4d1ddd2462d91d50d0bd82c1276',
      redirectUri : 'http://localhost:8080/callback'
    });

    spotifyApi.clientCredentialsGrant().then(function(data,err) {
        if (err) throw err;
        console.log('The access token is ' + data.body['access_token']);
        spotifyApi.setAccessToken(data.body['access_token']);
        var accessToken= data.body['access_token'];
        console.log("auth complete")
      });

    app.get('/categories', function(req,res){
        //Parse code to get list of all possible categories
        var cats= parseDB.getGenres();
        cats.then(function(result){
            console.log(result)
            res.send(result)
        });
        
    });
    app.post('/updateFeed',function(req,res){
        var category= req.body.genre;
        var songList= parseDB.getSongs(category).then(function(result){
            res.send(result)
        })
        
        //res.send([{title: "Hotline Bling", artist:"Drake", songID:"6nmz4imkDcmtwMjocAzFSx", genre: category}])
    })

    app.post('/addLike', function(req,res){
        console.log('endpoint called')
        var userId= req.body.userId;
        var songId= req.body.songId;
        parseDB.saveLike(userId,songId,true);
        res.send('liked')
    })
    app.post('/addDislike', function(req,res){
        var userId= req.body.userId;
        var songId= req.body.songId;
        parseDB.saveLike(userId,songId,false);
        res.send("disliked")
    })

    app.post('/getFriends',function(req,res){
        var userId= req.body.userId;
        parseDB.getFriends(userId).then(function(result){
            res.send(result);
        })
    })

    app.post('/shareSong', function(req,res){
        var sender= req.body.sender;
        var recipient= req.body.recipient;
        var songId= req.body.songId;
        parseDB.saveShare(sender,recipient,songId)
        console.log("shared song");
        res.send("shared song");
        
    })
    app.post('/getNotifications',function(req,res){
        var userId= req.body.userId;
        parseDB.getShares(userId).then(function(result){
            res.send(result)
        })
    })
    // listen (start app with node server.js) ======================================
    app.listen(port);
    console.log("App listening on port 8080");