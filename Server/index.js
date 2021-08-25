import {Low,JSONFile} from "lowdb";
import * as http from "http"
import path from "path";
import lodash from "lodash"

const dbFilePath = path.join('.', 'db.json');
const adapter = new JSONFile(dbFilePath)
const db = new Low(adapter)
await db.read();

db.data = Object.assign({
    storages: {tutorial: {item: ["name", 1], id: 0}}
}, db.data);


var port = 8081;

var s = http.createServer();
s.on('request', function(request, response) {
    response.writeHead(200);
    console.log(request.method);
    console.log(request.headers);
    console.log(request.url);


    try {
        if (request.headers["command"] == "init")
        {
            response.write('OK');
        } else if (request.headers["command"] == 'regcontainer' && request.headers["name"] != null){
            response.write('suc');
        } else if (request.headers["command"] == 'regitem' && request.headers["name"] != null){
            response.write('OK Item: ' + request.headers["name"]);
        } else if (request.headers["command"] == 'get'){
            response.write(JSON.stringify(db.data));
        } else if (request.headers["command"] == "write_item" && request.headers["name"] != null && request.headers["id"] != null && request.headers["storage"] != null){

            db.data.storages[request.headers["storage"]].push({key: request.headers["name"], value: [request.headers["name"], request.headers["id"]]})

            //db.data["storages"][request.headers["storage"]][request.headers["name"]][0] = request.headers["name"]
            //db.data["storages"][request.headers["storage"]][request.headers["name"]][1] = request.headers["id"]
            response.write("OK, writen");
        } else {
            response.write('error in name of req')
        }
    } catch (e) {
        response.write('error: '+ e)
    }
    response.end();

});

s.listen(port);
console.log('Browse to http://127.0.0.1:' + port);