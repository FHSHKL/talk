const ws = require('/usr/local/lib/node_modules/ws');
const fs = require('fs');
const net = require('net');
const http = require('http');
const https = require('https');
const WebSocketServer = ws.Server;

var app={},log={},data={}
var client=[];

app=JSON.parse(get_file("./app_data.json").toString());
data=JSON.parse(get_file("./user_data.json").toString());

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
    var user=get_user(a);
    if(data[user.name]){
        return "have loged!";
    }
    data[user.name]={
        "psw":user.psw,
        "message":[]
    };
    return "logon successful!";
}

function login(a,user_id){
    var user=get_user(a);
    if(log[user.name]>-1){
        return "user have log on another client!";
    }
    if(!data[user.name]||data[user.name].psw!=user.psw){
        return "wrong username or password!";
    }
    log[user.name]=user_id;
    client[user_id].log=user.name;
    return "login successful!";
}

function logout(a,user_id){
    delete log[client[user_id].log];
    client[user_id].log=-1;
    return "logout successful!";
}

function send(a,user_id){
    var user=get_user(a);
    var mes=a.replace(/[a-z|0-9]+ /i,'');
    if(data[user.name]){
        data[user.name].message.push(`${client[user_id].log}-pri:${mes}`);;
        check_message(user.name);
        return "send successful!";
    }
    else{
        return "unknown user!";
    }
}

function set(a,user_id){
    var user=get_user(a);
    if(user.name=="name_name"){
        if(data[user.psw]){
            return "used name!";
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
    console.log("[server-save]");
    fs.writeFile("./app_data.json",JSON.stringify(app),function(err){
        if(err){
            console.log(`[server-error]:${err}`);
        }
    })
    fs.writeFile("./user_data.json",JSON.stringify(data),function(err){
        if(err){
            console.log(`[server-error]:${err}`);
        }
    })
}

function get_file(file) {
    return fs.readFileSync(file, 'utf-8');
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
        return "please login first!";
    }
    if(a.match(/\/logout/i)){
        return logout("",user_id);
    }
    if(a.match(/\/send [0-9|a-z]+ \S/i)){
        a=a.replace(/\/send /i,'');
        return send(a,user_id);
    }
    if(a.match(/\/set (user_name|user_pasw) [0-9|a-z]+/i)){
        a=a.replace(/\/set /i,'');
        return set(a,user_id);
    }
    if(client[user_id].log!="admin"){
        return "unknown command!";
    }
    if(a.match(/\/server save/i)){
        save();
        return "saved~";
    }
    if(a.match(/\/server close/i)){
        save();
        setTimeout(function () {
            process.exit();
        }, 1000);
        return "close in 1 sec~";
    }
    return "unknown command~";
}

function work_message(a,user_id){
    console.log(`uid:${user_id} mes:${a}`);
    if(a[0]=='/'){
        var res=work_command(a,user_id);
        client[user_id].fhs_send(res);
    }
    else{
        if(!client[user_id].log){
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
    var trash_point=[];

    console.log(data);

    function get_point(){
        return trash_point.length?trash_point.pop():client.length;
    }

    function remove_point(user_id){
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

    ter_server.listen(6801);
}

server_run();