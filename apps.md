```javascript
server://不要修改变量
    clientArr:client_list
    clientArr.log:{
        -1:not log
        else:user_document[<number>]
    }
    user_document:[{
        "user_name":"nick",
        "user_pasw":"password",
        "message":"messages"
    }]
    -clientArr[<number>].write(message)
client:
    in_app:app_name or undefined //get all read without send
    -client.write(message)
server and client:
    app:[
        {
            "app_name":"app_id"
        },
        {
            "path":"app_path",
            "recv":"app functions",
            "data":"data"
        }
    ]
    type_of_data:read or data
    app_name:name
    value:message
used://已使用变量
    clientArr
    client
    value
    app
```
## example
```javascript
setTimeout(function(){
    const app_name="add";
    function send_to_server(message)
    {
        client.write(`/app ${app_name} ${message}`);
    }
    function send_to_client(message)
    {
        clientArr[user_id].write(`/app ${app_name} ${message}`);
    }
    function server_init(){
        //console.log(`app ${app_name}:${value}`);
        send_to_client(eval(value));
    }
    function client_init()
    {
        if(value=="run")in_app=app_name;
        if(value=="exit")in_app=undefined;
        if(type_of_data=="read")
        {
            if(value.match(/[0-9]+[\+|\-|\*|\/|\%][0-9]+/i))send_to_server(value);
        }
        if(type_of_data=="data")
        {
            console.log(value);
        }
    }
    eval(app_type);
},0)
//input
"/app add run"
"5+6"
"8%3"
"exit"
```