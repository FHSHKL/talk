const drow_color=["white","red","yellow","blue","orange","purple","green","black"];
function client_main(){
    const drow_color=["white","red","yellow","blue","orange","purple","green","black"];
    var s=document.getElementById(`drow`);
    if(!s){
        var cls=document.createElement("style");
        cls.innerHTML=".drower{border-left:solid 1px #eee;border-top:solid 1px #eee;width:50px;height:50px;position:absolute;cursor:pointer;background:white;}";
        document.head.appendChild(cls);
        s=document.createElement("div");
        s.setAttribute("id",`drow`);
        s.setAttribute("class","mes");
        s.setAttribute("style",`width:487px;height:410px;position:relative;`);
        document.getElementById("content").appendChild(s);
        for(var i=0;i<8;i++){
            var line=drow_data[i]||{};
            for(var j=0;j<8;j++){
                var now=line[j]||0;
                now=drow_color[now];
                var k=document.createElement("div");
                k.setAttribute("id",`drower_${i}_${j}`);
                k.setAttribute("class",`drower`);
                k.setAttribute("style",`left:${j*51+5}px;top:${i*51+5}px;background:${now}`);
                k.setAttribute("onclick",`client.send("/app drow ${i} ${j}")`);
                s.appendChild(k);
            }
        }
        for(var i=0;i<8;i++){
            var k=document.createElement("div");
            k.setAttribute("id",`drow_color_${i}`);
            k.setAttribute("class",`drower`);
            k.setAttribute("style",`left:431px;top:${i*51+5}px;background:${drow_color[i]};border:${i==ncol?"solid 1px "+drow_color[7-i]:""}`);
            k.setAttribute("onclick",`client.send("/app drow ${i}")`);
            s.appendChild(k);
        }
    }
}
function init(){
    if(app_data[app_name]&&app_data[app_name][user_name].init)return;
    app_data[app_name]={
        "message":[]
    };
    app_data[app_name][user_name]={
        "init":true,
        "data":{},
        "color":1
    }
}
function main(){
    app_data[app_name].message.push(app_mes);
    if(app_data[app_name].lock){
        return;
    }
    app_data[app_name].lock=true;
    var data=app_data[app_name];
    while(data.message.length){
        var mess=data.message.pop();
        if(mess=="build"){
            init();
            save();
            continue;
        }
        if(mess=="init"){
            init();
            var messs=`/web command const drow_data=${JSON.stringify(data[user_name].data)};const ncol=${data[user_name].color};${client_main.toString()}client_main()`;
            client[user_id].fhs_send(messs.replace(/\n/ig,''));
            continue;
        }
        if(mess=="refresh"){
            app[app_name]=get_file(`./${app_name}/index.js`);
            continue;
        }
        mess=mess.match(/\d+/ig);
        if(mess.length==1){
            var ycol=data[user_name].color;
            var ncol=mess[0];
            client[user_id].fhs_send(
                `/web command document.getElementById("drow_color_${ycol}").style="left:431px;top:${ycol*50+5}px;background:${drow_color[ycol]};";\
                document.getElementById("drow_color_${ncol}").style="left:431px;top:${ncol*50+5}px;background:${drow_color[ncol]};border:solid 1px ${drow_color[7-ncol]}"`
            );
            data[user_name].color=ncol;
        }
        else if(mess.length==2){
            var x=mess[0];
            var y=mess[1];
            data[user_name].data[x]=data[user_name].data[x]||{};
            data[user_name].data[x][y]=data[user_name].color;
            client[user_id].fhs_send(
                `/web command document.getElementById("drower_${x}_${y}").style="left:${y*50+5}px;top:${x*50+5}px;background:${drow_color[data[user_name].color]}"`
            );
        }
    }
    delete data.lock;
    app_data[app_name]=data;
}
main();