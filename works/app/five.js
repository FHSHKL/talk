setTimeout(function(){
    //.splice
    const app_name="five";

    function send_to_server(message) {
        client.write(`/app ${app_name} ${message}`);
    }

    var room=[];
    function get_room_status(){
        return room.length&&room[room.length-1].person<2;
    }

    function create_room(){
        var s={
            "person":0,
            "user":[]
        };
        room.push(s);
    }

    function server_init(){
    }

    function client_init(){
        if (value.match(/\$/ig)) send_to_server(`${value}()`);
        if (value == "run") in_app = app_name;
        if (value == "exit") {
            in_app = undefined;
            send_to_server("$save");
            return;
        }
    }
    eval(app_type);
},0)