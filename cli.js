const fs = require('fs');

function write_log(data)
{
    fs.appendFile('user.log', data+"\n", function (err) {
        if (err) {
            return console.log("FILE-ERROR:" + err);
        }
    })
}

function get_file(file)
{
    return fs.readFileSync(file,'utf-8');
}

function work_command(a)
{
    if(a=="/cls")
    {
        console.clear();
        return false;
    }
    return true;
}

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
        write_log(chunk);
        console.log(chunk);
    })
    client.on('error', (e) => {
        write_log(e);
        console.log(e.message);
    })
    rl.on('line', (mes) => {
        write_log(mes);
        if(mes[0]!='/'||work_command(mes))
        {
            client.write(mes);
        }
    })
}

fs.readFile('./config.json', function (err, data) {
    if (err) {
        return console.log("FILE-ERROR:" + err);
    }
    work(JSON.parse(data.toString()));
})