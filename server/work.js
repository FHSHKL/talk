const ws = require('./packges/ws');
const fs = require('fs');
const net = require('net');
const http = require('http');
const https = require('https');
const WebSocketServer = ws.Server;

var app={},log={},data={},app_data={};
var client=[];

app_data=JSON.parse((get_file("./app_data.json")||"{}").toString());
data=JSON.parse((get_file("./user_data.json")||"{}").toString());

function check_message(user,user_id){
    if(log[user]!=undefined){
        var message=data[user].message||[];
        for(var i=0;i<message.length;i++){
            client[log[user]].fhs_send(message[i]);
        }
        data[user].message=[];
    }
}

function get_user(a){
    var res=a.match(/[a-z|0-9]+/ig);
    var user={
        "name":res[0],
        "psw":res[1]
    };
    return user;
}

function logon(a,user_id){
    if(client[user_id].log){
        return `[ser-err]have loged`;
    }
    var user=get_user(a);
    if(data[user.name]){
        return `[ser-err]please choose an unused user name`;
    }
    data[user.name]={
        "psw":user.psw,
        "message":[]
    };
    return `[ser-mes]logon successful`;
}

function login(a,user_id){
    if(client[user_id].log){
        return `[ser-err]have loged`;
    }
    var user=get_user(a);
    if(log[user.name]>-1){
        return `[ser-err]user have loged on another client!`;
    }
    if(!data[user.name]||data[user.name].psw!=user.psw){
        return `[ser-eer]wrong username or password`;
    }
    log[user.name]=user_id;
    client[user_id].log=user.name;
    client.forEach((cli)=>{
        if(cli.send){
            cli.send(`/web add_user ${user.name}`);
        }
    })
    return `[ser-mes]login successful`;
}

function logout(user_id){
    var name=client[user_id].log;
    delete log[client[user_id].log];
    delete client[user_id].log;
    client.forEach((cli)=>{
        if(cli&&cli.send){
            cli.send(`/web remove_user ${name}`);
        }
    })
    return `[ser-mes]logout successful`;
}

function send(a,user_id){
    var user=get_user(a);
    var mes=a.replace(/[a-z|0-9]+ /i,'');
    if(data[user.name]){
        data[user.name].message.push(`${client[user_id].log}-pri:${mes}`);
        check_message(user.name);
        return `[ser-mes]send successful`;
    }
    else{
        return `[ser-err]unknown user`;
    }
}

function set(a,user_id){
    var user=get_user(a);
    if(user.name=="name_name"){
        if(data[user.psw]){
            return `[ser-err]please choose an unused user name`;
        }
        data[user.psw]=data[client[user_id].log];
        delete data[client[user_id].log];
        client[user_id].log=user.psw;
    }
    else{
        data[client[user_id].log].psw=user.psw;
    }
    return `${user.name} set successful!`;
}

function save(){
    console.log("[ser-sav]");
    fs.writeFile("./app_data.json",JSON.stringify(app_data),function(err){
        if(err){
            console.log(`[ser-err]:${err}`);
        }
    })
    fs.writeFile("./user_data.json",JSON.stringify(data),function(err){
        if(err){
            console.log(`[ser-err]:${err}`);
        }
    })
}

function get_file(file) {
    try {
        return fs.readFileSync(file,'utf-8');
    }
    catch (err){
        return undefined;
    }
}

function work_app(a,user_id){
    const app_name=a.match(/[0-9|a-z]+/i)[0];
    const app_mes=a.replace(/[0-9|a-z]+ /i,'');
    const user_name=client[user_id].log;
    app[app_name]=app[app_name]||get_file(`./app/${app_name}/index.js`);
    if(app[app_name]){
        try{
            eval(app[app_name]);
        }
        catch(err){
            return `[ser-app]error->${err}`;
        }
        return; 
    }
    return `[ser-app]${app_name}->err`;
}

function work_command(a,user_id){
    if(a.match(/\/logon [0-9|a-z]+ [0-9|a-z]+/i)){
        a=a.replace(/\/logon /i,'');
        return logon(a,user_id);
    }
    if(a.match(/\/login [0-9|a-z]+ [0-9|a-z]+/i)){
        a=a.replace(/\/login /i,'');
        return login(a,user_id);
    }
    if(!client[user_id].log){
        return `[ser-err]please login first`;
    }
    if(a.match(/\/logout/i)){
        return logout(user_id);
    }
    if(a.match(/\/send [0-9|a-z]+ \S/i)){
        a=a.replace(/\/send /i,'');
        return send(a,user_id);
    }
    if(a.match(/\/set (user_name|user_pasw) [0-9|a-z]+/i)){
        a=a.replace(/\/set /i,'');
        return set(a,user_id);
    }
    if(a.match(/\/app [0-9|a-z]+/i)){
        a=a.replace(/\/app /i,'');
        return work_app(a,user_id);
    }
    if(client[user_id].log!="admin"){
        return `[ser-err]unknown command`;
    }
    if(a.match(/\/server command/i)){
        a=a.replace(/\/server command/i,'');
        var res;
        try{
            res=eval(command);
        }
        catch(err){
            res=err;
        }
        return res;
    }
    if(a.match(/\/server save/i)){
        save();
        return `[ser-mes]saved`;
    }
    if(a.match(/\/server close/i)){
        save();
        setTimeout(function () {
            process.exit();
        }, 1000);
        return "close in 1 sec~";
    }
    return `[ser-err]unknown command`;
}

const matchList  = {
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&#34;': '"',
    '&quot;': '"',
    '&#39;': "'",
}
const HtmlFilter = (text) => {
    let regStr = '(' + Object.keys(matchList).toString() + ')';
    regStr = regStr.replace(/,/g, ')|(');
    const regExp = new RegExp(regStr, 'g');
    return text.replace(regExp, match => matchList[match]);
}

function work_message(a,user_id){
    a=HtmlFilter(a);
    console.log(`uid:${user_id} mes:${a}`);
    if(a[0]=='/'){
        var res=work_command(a,user_id);
        if(res){
            client[user_id].fhs_send(res);
        }
    }
    else{
        if(!client[user_id].log){
            client[user_id].fhs_send("please login first!");
            return;
        }
        client.forEach((cli)=>{
            if(!cli||!cli.log){
                return;
            }
            cli.fhs_send(`${client[user_id].log}:${a}`);
        })
    }
}

function server_run(){
    const ter_server=net.createServer();
    const web_server=new WebSocketServer({
        port:6802
    })
    const htm_server=http.createServer();
    var trash_point=[];

    console.log(data);
    console.log(app_data);

    function get_user_list(){
        var usl=[];
        for(var i=0;i<client.length;i++){
            if(client[i].log){
                usl.push(client[i].log);
            }
        }
        return usl;
    }

    function get_point(){
        return trash_point.length?trash_point.pop():client.length;
    }

    function remove_point(user_id){
        if(client[user_id].log){
            delete log[client[user_id].log];
        }
        if(user_id==client.length-1){
            client.pop();
            return;
        }
        if(client[user_id].log){
            delete log[client[user_id].log];
        }
        client[user_id]=null;
        trash_point.push(user_id);
    }

    ter_server.on('connection',(cli)=>{
        cli.setEncoding('utf8');
        cli.id=get_point();
        cli.fhs_send=cli.write;
        client[cli.id]=cli;
        cli.on('data',(mes)=>{
            work_message(mes,cli.id);
        })
        cli.on('close',(err)=>{
            remove_point(cli.id);
        })
        cli.on('error',(err)=>{
            remove_point(cli.id);
        })
    })
    web_server.on('connection',(cli)=>{
        cli.id=get_point();
        var too=`/web user ${get_user_list()}`;
        cli.send(too);
        cli.fhs_send=cli.send;
        client[cli.id]=cli;
        cli.on('message',(mes)=>{
            work_message(mes,cli.id);
        })
        cli.on('close',(err)=>{
            remove_point(cli.id);
        })
        cli.on('error',(err)=>{
            remove_point(cli.id);
        })
    })

    const web_cli=get_file("./cli.html").replace(/\t|\n/ig,'');

    htm_server.on("request",function(req,res){
        console.log(req.connection.remoteAddress);
        if(req.headers.referer&&req.headers.referer!="103.45.251.70:6803/"){
            res.writeHead(404);
            res.end();
            return;
        }
        res.writeHead(200,{
            "content-type":"text/html"
        });
        res.write(web_cli);
        res.end();
    })

    ter_server.listen(6801);
    htm_server.listen(6803);
}

server_run();