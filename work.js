
const fs = require('fs');
const net = require('net');
var user_document;
let clientArr = [];

function check_message(user_id)
{
    var user_doc_id=clientArr[user_id].log;
    var message=user_document[user_doc_id].message;
    if (user_doc_id==-1||message.length==0)return;
    for(var i=0;i<message.length;i++)
    {
        clientArr[user_id].write(message[i]);
    }
    user_document[user_doc_id].message=[];
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
        if(clientArr[user_id].log>-1)
        {
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
                    if(clientArr[user_id].log>-1)return "user have log on another client!";
                    clientArr[user_id].log = i;
                    check_message(user_id);
                    return "login successful!";
                }
            }
        }
        return "wrong username or password!";
    }
    if (clientArr[user_id].log<0) return "pleash login first!";
    if (a.match(/\/logout/ig)) {
        clientArr[user_id].log = -1;
        return "logout successful!";
    }
    if(a.match(/\/set/ig))
    {
        var res=a.match(/(\/set|user_name|user_pasw|[0-9|a-z]+)/ig);
        var name=res[1];
        var value=res[2];
        user_document[clientArr[user_id].log][name]=value;
        return name+" set successful!";
    }
    if(a.match(/\/send [0-9|a-z]+ [\S]+/ig))
    {
        var res=a.match(/(\/send|[0-9|a-z]+|[\S]+)/ig);
        var name=res[1];
        var value=res[2];
        for (var i = 0; i < clientArr.length; i++) {
            var val = clientArr[i];
            if (user_document[val.log].user_name == name) {
                user_document[val.log].message.push(user_document[clientArr[user_id].log].user_name+"-pri:"+value);
                check_message(i);
                return "";
            }
        }
        return "unknown user!";
    }
    if (a.match(/\/server close/ig)) {
        if(user_document[clientArr[user_id].log].user_name!="admin")
        {
            return "please login as admin!";
        }
        fs.writeFile('user-document.json', JSON.stringify(user_document), function (err) {
            if (err) {
                return console.log("FILE-ERROR:" + err);
            }
            process.exit();
        })
    }
    return "unknown command!";
}


function server_work() {
    console.log(user_document)
    const server = net.createServer();
    server.on('connection', (person) => {
        person.id = clientArr.length;
        person.setEncoding('utf8');
        person.log=-1;
        clientArr.push(person);
        person.on('data', (chunk) => {
            console.log("uid:" + person.id);
            console.log("mes:" + chunk);
            if (chunk[0] == '/') {
                person.write(work_command(chunk, person.id));
            }
            else {
                if (person.log<0) {
                    return;
                }
                clientArr.forEach((val) => {
                    if (val != person&&val.log>-1) {
                        val.write(user_document[person.log].user_name+':'+chunk);
                    }
                })
            }
        })
        person.on('close', (p1) => {
            clientArr.splice(p1.id, 1);
        })
        person.on('error', (p1) => {
            clientArr.splice(p1.id, 1);
        })
    })
    server.listen(6801);
}


fs.readFile('user-document.json', function (err, data) {
    if (err) {
        return console.log("FILE-ERROR:" + err);
    }
    user_document = JSON.parse(data.toString());
    server_work();
})

/*

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