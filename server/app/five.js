setTimeout(function(){
    /*
    #define data app_data[app_name]
    #define lock data.lock
    #define room data.room
    #define message data.message
    */

    function init(){
        app_data[app_name].message=app_data[app_name].message||[];
        app_data[app_name].room=app_data[app_name].room||[];
    }
    function main(){
        if(app_data[app_name].lock)return;
        app_data[app_name].lock=true;
        var data=app_data[app_name];
        while(data.message.length){
            var mess=data.message[0];
            data.message=data.message.slice(1);
        }
        delete app_data[app_name].lock;
    }
},0);