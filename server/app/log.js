setTimeout(function(){
    //value->argvs
    //clientArr
    //user_document
    //user_id -> in clientArr
    const app_name="log";
    const type_of_app="server";
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