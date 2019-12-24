'use strict';

const WebSocketServer=require('ws').Server;

const ws=new WebSocketServer({
    port:6802
})

var client=[];
var unusedid=[];

ws.on('connection',function(person){
    console.log('connect');
    person.id==unusedid.length?unusedid.pop():clientArr.length;
    client[person.id]=person;
    person.on('message',function(data){
        console.log(`data:${data}`);
        client.forEach((val)=>{
            val.send(data);
        })
    })
    person.on('close',function(err){
        if(person.id==clientArr.length-1){
            clientArr.pop();
            return;
        }
        clientArr[person.id]=null;
        unusedid.push(person.id);
    })
    person.on('error',function(err){
        if(person.id==clientArr.length-1){
            clientArr.pop();
            return;
        }
        clientArr[person.id]=null;
        unusedid.push(person.id);
    })
})