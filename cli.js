function work()
{
    const net = require('net');
    const readline = require('readline');
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })
    let client = new net.Socket();
    client.connect(ip[0]["port"], ip[0]["url"]);

    client.setEncoding('utf8');
    client.on('data', (chunk) => {
        console.log(chunk);
    })
    client.on('error', (e) => {
        console.log(e.message);
    })
    rl.on('line', (mes) => {
        client.write(mes);
    })
}


var fs=require('fs');
var ip;

fs.readFile('./config.json',function(err,data){
    if(err){
        return console.log("FILE-ERROR:"+err);
    }
    ip=JSON.parse(data.toString());
    work();
})