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
        if(app[app[0][app_name]].data.value==undefined)
        {
            app[app[0][app_name]].data.value=0;
        }
        //console.log(`app ${app_name}:${value}`);
        try{
            eval("app[app[0][app_name]].data.value"+value);
            send_to_client(app[app[0][app_name]].data.value);
        }
        catch(err){
            send_to_client(`error:${err}`);
        }
    }
    function client_init()
    {
        if(value=="run")in_app=app_name;
        if(value=="exit")in_app=undefined;
        if(type_of_data=="read")
        {
            if(value.match(/[^0-9|\+|\-|\*|\/|\%| |\.|\^|\&|\|]/ig))return;
            send_to_server(value);
        }
        if(type_of_data=="data")
        {
            console.log(value);
        }
    }
    eval(app_type);
},0)