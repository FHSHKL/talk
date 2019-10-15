
const fs = require('fs');
const net = require('net');
const http = require('http');
const https = require('https');
var user_document;
let clientArr = [];

function get_file(file) {
    return fs.readFileSync(file, 'utf-8');
}

function check_message(user_id) {
    setTimeout(function () {
        var user_doc_id = clientArr[user_id].log;
        var message = user_document[user_doc_id].message;
        if (user_doc_id == -1 || message.length == 0) return;
        for (var i = 0; i < message.length; i++) {
            clientArr[user_id].write(message[i]);
        }
        user_document[user_doc_id].message = [];
    }, 500);
}

function work_command(a, user_id) {
    if (a.match(/\/logon [0-9|a-z]+ [0-9|a-z]+/ig)) {
        var res = a.match(/(\/logon)|([0-9|a-z]+)/ig);
        var now_user = {
            "user_name": res[1],
            "user_pasw": res[2]
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
    if (a.match(/\/login [0-9|a-z]+ [0-9|a-z]+/ig)) {
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
                    check_message(user_id);
                    return "login successful!";
                }
            }
        }
        return "wrong username or password!";
    }
    if (clientArr[user_id].log < 0) return "pleash login first!";
    if (a.match(/\/logout/ig)) {
        clientArr[user_id].log = -1;
        return "logout successful!";
    }
    if (a.match(/\/set/ig)) {
        var res = a.match(/(\/set|user_name|user_pasw|[0-9|a-z]+)/ig);
        var name = res[1];
        var value = res[2];
        user_document[clientArr[user_id].log][name] = value;
        return name + " set successful!";
    }
    if (a.match(/\/send [0-9|a-z]+ [\S]+/ig)) {
        var res = a.match(/(\/send|[0-9|a-z]+|[\S]+)/ig);
        var name = res[1];
        var value = user_document[clientArr[user_id].log].user_name + "-pri:" + res[2];
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
    if (user_document[clientArr[user_id].log].user_name != "admin") return "unknown command!";
    if (a.match(/\/server get [\S]+/ig)) {
        var res=a.match(/(\/server|get|[\S]+)/ig);
        var url=res[2];
        var html='';
        var dea=http;
        if(res[2].match(/https/i))dea=https;
        try {
            dea.get(url, function (res) {
                res.on('data', function (data) {
                    html += data;
                });
                res.on('end',function(){
                    fs.writeFile('./file/'+url.match(/[a-z]+\.js/ig)[0],html,function(err){
                        if (err) {
                            return console.log("FILE-ERROR:" + err);
                        }
                    });
                });
            });
        }
        catch (err){
            console.log(err);
        };
        return "got it";
    }
    if (a.match(/\/server save/ig)) {
        fs.writeFile('user-document.json', JSON.stringify(user_document), function (err) {
            if (err) {
                return console.log("FILE-ERROR:" + err);
            }
        });
        return "saved";
    }
    if (a.match(/\/server close/ig)) {
        fs.writeFile('user-document.json', JSON.stringify(user_document), function (err) {
            if (err) {
                return console.log("FILE-ERROR:" + err);
            }
            setTimeout(function () {
                process.exit();
            }, 1000);
        });
        return "close in 1 sec";
    }
    return "unknown command!";
}

function server_work() {
    console.log(user_document)
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

var data = fs.readFileSync('user-document.json', function (err) {
    if (err) {
        return console.log("FILE-ERROR:" + err);
    }
});
user_document = JSON.parse(data.toString());
server_work();
/*
fs.readFile('', function (err, data) {
    if (err) {
        return console.log("FILE-ERROR:" + err);
    }
    user_document = ;
    server_work();
})
*/
/*

---user

/login admin fhs
/server get https://huokulou.tk/static/js/effect.js

---user-document.json

[{
    "user_name":"admin",
    "user_pasw":"fhs",
    "message":[]
}]

[{
    "user_name":"admin",
    "user_pasw":"fhs",
    "message":[]
}]

*/