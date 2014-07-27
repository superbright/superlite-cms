
/*
 * GET toggle stream on and off.
 */

exports.data = function(req, res){

	console.log("BOK YE  " +  req.query.streamname);
	
	var data = req.query.streamname; //req.query.streamname;
	var streamsforsave = storage.getItem('streams');
			
		for(var z=0; z < streamsforsave.length; z++) {
			
				if(streamsforsave[z]['name'] == data) {
						
						if(streamsforsave[z]['enabled'] == true) {
							console.log("change to false");
							streamsforsave[z]['enabled'] = false;
						} 
						else
						{
							console.log("change to true");
							streamsforsave[z]['enabled'] = true;
						}
						
				}
		
		}
		
	storage.setItem('streams',streamsforsave);

    res.send(data);
};