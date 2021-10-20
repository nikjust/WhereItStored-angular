import {Low,JSONFile} from "lowdb";
import * as http from "http"
import path from "path";
import lodash from "lodash"

const dbFilePath = path.join('.', 'db.json');
const adapter = new JSONFile(dbFilePath)
const db = new Low(adapter)
await db.read();

db.data = Object.assign({
    storages: [
        {
            key: "storage", name: "Congratulations!", icon:"bi-archive", items: [
                {id: 0, name: "You installed all programs successfully", icon: "bi-box"},
                {id: 1, name: "Server is working", icon: "bi-box-seam"},
                {id: 2, name: "Normally", icon: "bi-alarm"}
            ]
        },
        {
            key: "storage2", name: "Where it stored", icon: "bi-bag",  items: [
                {id: 3, name: "Server v0.0.5", icon: "bi-sd-card"}
            ]
        }
    ]}, db.data);


var port = 8081;

var s = http.createServer();
s.on('request', function(request, response) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "*");
    response.setHeader("Access-Control-Allow-Headers", "content-type, origin, accept, command, name, id, storage, icon");
    response.writeHead(200);
    console.log(request.method);
    console.log(request.headers);
    console.log(request.url);




    try {
        if (request.headers["command"] == "hi")
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

       /* switch (request.headers["command"]) {
            case "OK":
                response.write('OK');
            case ""
        }*/
    } catch (e) {
        response.write('error: '+ e)
    }


    if (response.method = 'OPTIONS') {
        response
    }
    response.end();

});

s.listen(port);
console.log('Browse to http://127.0.0.1:' + port);