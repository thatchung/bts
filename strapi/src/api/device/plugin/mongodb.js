const { MongoClient } = require('mongodb')
const uri = "mongodb://develop:456468@103.116.104.166:27017/admin"
const client = new MongoClient(uri)

async function callAction (action) {
  	try {
	    await client.connect();
	    await action(client);
	} catch (e) {
	    console.error(e);
	}
}
exports.callAction = callAction;
