setTimeout(function () {
    const app_name = "add";
    /*
    function updata() {
        app[app[0][app_name]].recv = undefined;
    }
    */
    function send_to_server(message) {
        client.write(`/app ${app_name} ${message}`);
    }
    function send_to_client(message) {
        clientArr[user_id].write(`/app ${app_name} ${message}`);
    }
    function server_init() {
        if (value.match(/\$/ig)) {
            eval(`${value.replace(/\$/ig, '')}()`);
            return;
        }
        if (app[app[0][app_name]].data.value == undefined) {
            app[app[0][app_name]].data.value = 0;
        }
        //console.log(`app ${app_name}:${value}`);
        eval("app[app[0][app_name]].data.value" + value);
        send_to_client(app[app[0][app_name]].data.value);
    }
    function client_init() {
        if (value.match(/\$/ig)) send_to_server(`${value}()`);
        if (value == "run") in_app = app_name;
        if (value == "exit") {
            in_app = undefined;
            send_to_server("$save");
            return;
        }
        if (type_of_data == "read") {
            if (value.match(/[^0-9|\+|\-|\*|\/|\%| |\.|\^|\&|\||=]/ig)) return;
            send_to_server(value);
        }
        if (type_of_data == "data") {
            console.log(value);
        }
    }
    eval(app_type);
}, 0)