
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , toggleStream = require('./routes/toggleStream')
  , getStreams = require('./routes/getStreams')
  , http = require('http')
  , path = require('path');

storage = require('./persist');

var app = express();
database = express();

storage.initSync();

if(!storage.getItem('streams')){
	storage.setItem('streams',[]);
}
console.log("streams: " + storage.getItem('streams'));

var bokye = storage.getItem('streams');

	for(var i=0; i < bokye.length; i++) {
	
		console.info("AA" + bokye[i]['name'] + " " + bokye[i]['enabled'])
			
	}


app.configure(function(){
  app.set('port', process.env.PORT || 80);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hjs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/toggleStream', toggleStream.data);
app.get('/getStreams', getStreams.data);
app.get('/getStreams.json', function(req,res){
   	var streamsforsave = storage.getItem('streams');	
    res.send(streamsforsave);
});
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
