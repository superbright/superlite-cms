var http = require('http');
var parseString = require('xml2js').parseString;
/*
 * GET toggle stream on and off.
 */

exports.data = function(req, resx){
	var data = "";

	var username = 'wowza';
	var password = 'i-d10010a1';
	var auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');

	var options = {
	    host: 'ec2-174-129-174-173.compute-1.amazonaws.com',
	    port: 8086,
	    path: '/connectioncounts?flat',
		auth: 'wowza:i-d10010a1',
		method: 'GET',
		headers: {
		'User-Agent': 'Mozilla'
		}
	};
	
	var output = '';
	var jsonResult;
	var req = http.request(options, function(res) {
	 
	 console.log('STATUS: ' + res.statusCode);
	  console.log('HEADERS: ' + JSON.stringify(res.headers));
	  res.setEncoding('utf8');
	  	
	  res.on('data', function (chunk) {
		output += chunk;
	  });
	  
	  res.on('end', function () {
		
		parseString(output, function (err, result) {
		
			jsonResult = JSON.parse(JSON.stringify(result));
			console.log("HELLO1 " +jsonResult.length);
			var topgun = jsonResult['WowzaMediaServer']['Stream'];
		    var jsonObj = []; //declare object for view p
			
			var streamsforsave = storage.getItem('streams');
			
			for(var z=0; z < streamsforsave.length; z++) {

				if(streamsforsave[z]['type'] == "live") {
					console.log("ebeni skim");
					streamsforsave.splice(z,1);
				}
						
			}
		
				
			if(topgun) {
			
				for(var i=0; i < topgun.length; i++) {
				
					var exists = false;
					for(var z=0; z < streamsforsave.length; z++) {
						
						if(topgun[i]['$']['applicationName'] == 'live') {
						
							if(streamsforsave[z]['data'] ==  topgun[i]['$']['streamName']) {
								exists = true;
							}
						} else {
							console.log(streamsforsave[z]['data']  + " " + "mp4:"+topgun[i]['$']['streamName']);
							if(streamsforsave[z]['data'] ==  "mp4:"+ topgun[i]['$']['streamName']) {
								console.log("exists " + streamsforsave[z]['data'])
									exists = true;
							}
						
						}
					}
					
					if(!exists) {
							streamsforsave.push({'name':topgun[i]['$']['streamName'],'data':topgun[i]['$']['streamName'],'type':topgun[i]['$']['applicationName'],'live':topgun[i]['$']['sessionsFlash'],'enabled':true});
					}
				
					console.info(topgun[i]['$']['streamName']);
				
				} //for
			
			}
		
			for(var z=0; z < streamsforsave.length; z++) {
				
					if(streamsforsave[z]['live'] == 0 && streamsforsave[z]['enabled'] == true) {
						jsonObj.push(streamsforsave[z]);
					} 
					
			
			}
		
			storage.setItem('streams',streamsforsave);
			//console.info(" new object " +  JSON.stringify(jsonObj));
			
			//resx.render('index', { title: 'SXSW CMS', streams: jsonObj });
			resx.send(jsonObj);
		}); //parsestring
	  }); //res on
		
	}); //req

	req.on('error', function(e) {
	  console.log('problem with request: ' + e.message);
	});
	
	req.end();
	
	
	
   
};