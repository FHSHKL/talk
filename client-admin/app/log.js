setTimeout(function(){
    //value->argvs
    //client->udp
    const app_name="log";
    const type_of_app="client";
    function server(){
        console.log(`app ${app_name}:${value}`);
        clientArr[user_id].write(`/app ${app_name} ${value}`);
    }
    function client()
    {
        console.log(`app ${app_name}: ${value}`);
    }
    eval(`${type_of_app}()`);
},0)