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
        var result;
        try{
            result=eval(value);
        }
        catch(err){
            result=`error:${err}`;
        }
        send_to_client(result);
    }
    function client_init()
    {
        if(value=="run")in_app=app_name;
        if(value=="exit")in_app=undefined;
        if(type_of_data=="read")
        {
            send_to_server(value);
        }
        if(type_of_data=="data")
        {
            console.log(value);
        }
    }
    eval(app_type);
},0)