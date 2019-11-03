
const fs = require('fs');
const net = require('net');
const http = require('http');
const https = require('https');
var user_document;
var app=[];
const app_type="server_init()";
let clientArr = [];

function get_file(file) {
    return fs.readFileSync(file, 'utf-8');
}

function check_message(user_id) {
    var user_doc_id = clientArr[user_id].log;
    var message = user_document[user_doc_id].message||[];
    if (user_doc_id == -1 || message.length == 0) return;
    for (var i = 0; i < message.length; i++) {
        clientArr[user_id].write(message[i]);
    }
    user_document[user_doc_id].message = [];
}

function logon(a, user_id) {
    var res = a.match(/(\/logon)|([0-9|a-z]+)/ig);
    var now_user = {
        "user_name": res[1],
        "user_pasw": res[2],
        "message":[]
    }
    for (var i = 0; i < user_document.length; i++) {
        var val = user_document[i];
        if (val.user_name == now_user.user_name) {
            return "have loged!";
        }
    }
    user_document.push(now_user);
    return "logon successful!";
}

function login(a, user_id) {
    if (clientArr[user_id].log > -1) {
        return "have already login!";
    }
    var res = a.match(/(\/i)|([0-9|a-z]+)/ig);
    var now_user = {
        "user_name": res[1],
        "user_pasw": res[2]
    }
    for (var i = 0; i < user_document.length; i++) {
        var val = user_document[i];
        if (val.user_name == now_user.user_name) {
            if (val.user_pasw == now_user.user_pasw) {
                if (clientArr[user_id].log > -1) return "user have log on another client!";
                clientArr[user_id].log = i;
                setTimeout(function(){check_message(user_id)},500);
                return "login successful!";
            }
        }
    }
    return "wrong username or password!";
}

function logout(a, user_id) {
    clientArr[user_id].log = -1;
    return "logout successful!";
}

function log_set(a, user_id) {
    var res = a.match(/(\/set|user_name|user_pasw|[0-9|a-z]+)/ig);
    var name = res[1];
    var value = res[2];
    if(name=="user_name")
    for(var i=0;i<user_document.length;i++)
    {
        if(user_document[i].user_name==value)
        {
            return "used name!";
        }
    }
    user_document[clientArr[user_id].log][name] = value;
    return name + " set successful!";
}

function send(a, user_id) {
    var name = a.match(/\/send [0-9|a-z]+/ig)[0].replace("\/send ","");
    var value = user_document[clientArr[user_id].log].user_name + "-pri:" + a.replace(/\/send [0-9|a-z]+ /ig,"");
    var flage = false;
    for (var i = 0; i < user_document.length; i++) {
        var val = user_document[i];
        if (val.user_name == name) {
            user_document[i].message.push(value);
            flage = true;
            break;
        }
    }
    for (var i = 0; i < clientArr.length; i++) {
        check_message(i);
    }
    if (flage) return "";
    return "unknown user!";
}

function save()
{
    fs.writeFile('user-document.json', JSON.stringify(user_document), function (err) {
        if (err) {
            return console.log("FILE-ERROR:" + err);
        }
    });
    fs.writeFile('app-document.json', JSON.stringify(app), function (err) {
        if (err) {
            return console.log("FILE-ERROR:" + err);
        }
    });
}

function get_app(value)
{
    for(var i=1;i<app.length;i++)
    {
        if(app[i].app_name==value)
        {
            app[i].data={};
            return i;
        }
    }
    return 0;
}

function work_command(a, user_id) {
    if (a.match(/\/logon [0-9|a-z]+ [0-9|a-z]+/ig)) {
        return logon(a, user_id);
    }
    if (a.match(/\/login [0-9|a-z]+ [0-9|a-z]+/ig)) {
        return login(a, user_id);
    }
    if (clientArr[user_id].log < 0) return "pleash login first!";
    if (a.match(/\/logout/ig)) {
        return logout(a, user_id);
    }
    if (a.match(/\/set (user_name|user_pasw) [0-9|a-z]+/ig)) {
        return log_set(a, user_id);
    }
    if (a.match(/\/send [0-9|a-z]+ [\S]+/ig)) {
        return send(a, user_id);
    }
    if(a.match(/\/app [a-z]+ [\S]+/ig))
    {
        var res=a.match(/(\/app|[a-z]+)/ig);
        app[0][res[1]]=app[0][res[1]]||get_app(res[1]);
        var apid=app[0][res[1]];
        var value=a.replace(/\/app [a-z]+ /ig,'');
        const type_of_data="data";
        if(app[apid].path!=undefined)
        {
            app[apid].recv=app[apid].recv||get_file(app[apid].path);
            eval(app[apid].recv);
        }
        return "";
    }
    if (user_document[clientArr[user_id].log].user_name != "admin") return "unknown command!";
    if(a.match(/\/file [\S]+/ig)){
        var res=a.match(/(\/file|[\S]+)/ig);
        var command=get_file(res[1]);
        eval(`setTimeout(function(){${command}},0)`);
        return "";
    }
    if (a.match(/\/server get [\S]+/ig)) {
        var res = a.match(/(\/server|get|[\S]+)/ig);
        var url = res[2];
        var html = '';
        var dea = http;
        if (res[2].match(/https/i)) dea = https;
        try {
            dea.get(url, function (res) {
                res.on('data', function (data) {
                    html += data;
                });
                res.on('end', function () {
                    fs.writeFile('./file/' + url.match(/[a-z]+\.js/ig)[0], html, function (err) {
                        if (err) {
                            return console.log("FILE-ERROR:" + err);
                        }
                    });
                });
            });
        }
        catch (err) {
            console.log(err);
        };
        return "got it";
    }
    if (a.match(/\/server save/ig)) {
        save();
        return "saved";
    }
    if (a.match(/\/server close/ig)) {
        save();
        setTimeout(function () {
            process.exit();
        }, 1000);
        return "close in 1 sec";
    }
    return "unknown command!";
}

function server_work() {
    console.log(user_document);
    console.log(app);
    const server = net.createServer();
    server.on('connection', (person) => {
        person.id = clientArr.length;
        person.setEncoding('utf8');
        person.log = -1;
        clientArr.push(person);
        person.on('data', (chunk) => {
            console.log("uid:" + person.id, "mes:" + chunk);
            if (chunk[0] == '/') {
                person.write(work_command(chunk, person.id));
            }
            else {
                if (person.log < 0) {
                    return;
                }
                clientArr.forEach((val) => {
                    if (val != person && val.log > -1) {
                        val.write(user_document[person.log].user_name + ':' + chunk);
                    }
                });
            }
        });
        person.on('close', (p1) => {
            clientArr.splice(p1.id, 1);
        });
        person.on('error', (p1) => {
            clientArr.splice(p1.id, 1);
        });
    });
    server.listen(6801);
}

user_document = JSON.parse(fs.readFileSync('user-document.json', function (err) {if (err) {return console.log("FILE-ERROR:" + err);}}).toString());
app=JSON.parse(fs.readFileSync('app-document.json', function (err) {if (err) {return console.log("FILE-ERROR:" + err);}}).toString());
server_work();