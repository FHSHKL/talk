```javascript
server:
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
    in_app:app_name or undefined
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