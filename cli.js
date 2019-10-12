function work(ip) {
    const net = require('net');
    const readline = require('readline');
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: ''
    })
    let client = new net.Socket();
    client.connect(ip[0]["port"], ip[0]["url"]);

    client.setEncoding('utf8');
    client.on('data', (chunk) => {
        var inputing=buf.toString();
        console.log(chunk);
    })
    client.on('error', (e) => {
        console.log(e.message);
    })
    rl.on('line', (mes) => {
        client.write(mes);
    })
}


const fs = require('fs');

fs.readFile('./config.json', function (err, data) {
    if (err) {
        return console.log("FILE-ERROR:" + err);
    }
    work(JSON.parse(data.toString()));
})