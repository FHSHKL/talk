## server
- `/logon <username> <password>`
- `/login <username> <password>`
- `/logout`
- `/set <"user_name"|"user_pasw"> <username|password>`
- `/send <username> <message1> <message2> ...`
- `/app <app_name> <command>`
### server-admin
- `/file <file_dir>`
- `/server get <file_url>`
- `/server save`
- `/server close`
### user-document
```javascript
[
    {
        "user_name": "admin",
        "user_pasw": "6114a2fdd96b56c50815f0501291f955",
        "message": []
    }
]
```

## client
- `/cls`
- `/client get <file_url>`
- `/app <app_name> <command>`
### config.json
```javascript
[{
    "port":"6801",
    "url":"localhost",
    "auto_log":{
        "user_name":"admin",
        "user_pasw":"6114a2fdd96b56c50815f0501291f955"
    }
}]
```