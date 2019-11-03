var steve=true;
var maxface=16;
var titleTime,lastitle=document.title;
var a_idx = 0;
var rcshow=false;
var now_lo=location.origin;
var todo,toid;

var to_bcid,to_btid;

function show_bc()
{
	var hei=document.getElementById(to_bcid).scrollHeight;
	document.getElementById(to_bcid).style="max-height: "+hei+"px";
	document.getElementById(to_btid).innerHTML="关闭";
}

function hide_bc()
{
	document.getElementById(to_bcid).style="max-height: 0px";
	document.getElementById(to_btid).innerHTML="显示";
}

function hide_warn()
{
	var warn=document.getElementById("warn");
	warn.style.display="none";
	var black_top=document.getElementById("black_top");
	if(black_top==null)
	{
		return;
	}
	black_top.parentNode.removeChild(black_top);
}
function show_warn()
{
	var warn=document.getElementById("warn");
	warn.style.display="";
	var black_top=document.createElement("div");
	black_top.setAttribute("class","black_top");
	black_top.setAttribute("id","black_top");
	document.body.appendChild(black_top);
}
function warn_yes()
{
	todo();
	hide_warn();
}
function warn_no()
{
	hide_warn();
}

function showbc(sbc,bcid,btid)
{
	var flage=document.getElementById(bcid).style.maxHeight=="0px";
	to_bcid=bcid;
	to_btid=btid;
	if(flage)
	{
		if(sbc==true)
		{
			show_bc();
		}
		else
		{
			todo=show_bc;
			show_warn();
		}
	}
	else
	{
		hide_bc();
	}
}

function copy_bc_by_toid()
{
	cpyid(toid);
}

function copybc(sbc,id)
{
	toid=id;
	if(sbc==true)
	{
		cpyid(id);
	}
	else
	{
		todo=copy_bc_by_toid;
		show_warn();
	}
}
var codenumber=0;
function loadcode()
{
	var code=document.getElementsByName("code");
	if(code.length==0)return;
	while(code.length>0)
	{
		var tit=code[0].getElementsByTagName("tit");
		var totit="";
		for(var j=0;j<tit.length;j++)
		{
			totit+=tit[j].innerHTML;
			code[0].removeChild(tit[j]);
		}

		var innercode=code[0].innerHTML;
		var sbctp=(code[0].tagName.toLocaleUpperCase()=="BC")?(false):(true);

		code[0].innerHTML="";

		var box=document.createElement("div");

		var fon=document.createElement("font");
		fon.setAttribute("size","5");
		fon.innerHTML=totit;
		box.appendChild(fon);

		var btc=document.createElement("bcopereaator");
		btc.setAttribute("class","bcbtn");
		btc.setAttribute("onclick","showbc("+sbctp+",'bc"+codenumber+"','but"+codenumber+"')");
		btc.setAttribute("id","but"+codenumber);
		btc.innerHTML="显示";
		box.appendChild(btc);

		var btg=document.createElement("bcopereaator");
		btg.setAttribute("class","bcbtn");
		btg.setAttribute("onclick","copybc("+sbctp+",'bc"+codenumber+"')");
		btg.innerHTML="复制";
		box.appendChild(btg);

		code[0].appendChild(box);

		var bc=document.createElement("div");
		bc.setAttribute("id","bc"+codenumber);
		bc.setAttribute("class","ssbc");
		bc.setAttribute("style","max-height: 0px");
		bc.innerHTML=innercode;

		code[0].appendChild(bc);

		code[0].setAttribute("name","fnicode");
		code=document.getElementsByName("code");
		codenumber++;
	}
}

document.addEventListener('visibilitychange',function ()
{
	if (document.hidden)
	{
		if(document.title!='（づ￣3￣）づ抱抱'&&document.title!='o(( >ω<))o mua~')
		lastitle=document.title;
		document.title='（づ￣3￣）づ抱抱';
		clearTimeout(titleTime);
	}
	else
	{
		document.title='o(( >ω<))o mua~';
		titleTime=setTimeout(function ()
		{
			if(document.title=='（づ￣3￣）づ抱抱'||document.title=='o(( >ω<))o mua~')
			document.title=lastitle;
		}, 2000);
	}
});
function xz()
{
	if(steve==false)
	return 0;
	e = window.event;
	var ay = -(window.screen.availWidth -e.clientX-48) /32;
	var ax =  (window.screen.availHeight-e.clientY-48) /18;
	document.getElementById("k").style.transform="rotateX("+ax+"deg) rotateY("+ay+"deg)";
}
var face=0;
function hz()
{
	face++;
	if(face>maxface)
	{
		face=0;
	}
	document.getElementById("h0").src=now_lo+"/static/img/mc/head/"+face+"/face.png";
	document.getElementById("h1").src=now_lo+"/static/img/mc/head/"+face+"/back.png";
	document.getElementById("h2").src=now_lo+"/static/img/mc/head/"+face+"/left.png";
	document.getElementById("h3").src=now_lo+"/static/img/mc/head/"+face+"/right.png";
	document.getElementById("h4").src=now_lo+"/static/img/mc/head/"+face+"/top.png";
	document.getElementById("h5").src=now_lo+"/static/img/mc/head/"+face+"/bottom.png";
}
function totop ()
{
	var tim=setInterval(
		function (){
			var sTop = document.documentElement.scrollTop + document.body.scrollTop;
			if (sTop === 0)
			{
				clearTimeout(tim);
				return;
			}
			window.scrollBy(0,-100);
		},
		10
	);
}
function lg()
{
	document.getElementById("tt").src=now_lo+"/static/img/mc/ico/lg.png";
}
function hg()
{
	document.getElementById("tt").src=now_lo+"/static/img/mc/ico/hg.png";
}
function load_img(url)
{
	var loadimg=new Image();
	loadimg.src=url;
}
function load_img_by_url()
{
	for (var i=1; i<maxface+1; i++)
	{
		load_img(now_lo+"/static/img/mc/head/"+i+"/face.png");
		load_img(now_lo+"/static/img/mc/head/"+i+"/back.png");
		load_img(now_lo+"/static/img/mc/head/"+i+"/left.png");
		load_img(now_lo+"/static/img/mc/head/"+i+"/right.png");
		load_img(now_lo+"/static/img/mc/head/"+i+"/top.png");
		load_img(now_lo+"/static/img/mc/head/"+i+"/bottom.png");
	}
	load_img(now_lo+"/static/img/mc/ico/lg.png");
	load_img(now_lo+"/static/img/mc/ico/login.png");
	load_img(now_lo+"/static/img/mc/ico/logout.png");
	load_img(now_lo+"/static/img/Minecraft.png");
}
function load()
{
	var domain = location.hostname;
	if(domain!="www.huokulou.tk")
	{
		if(domain!="localhost")
		{
			if(domain!="huokulou.tk")
			{
				window.location.href="https://huokulou.tk";
			}
		}
	}
	if(top.location != self.location)
	{
   		top.location = self.location;
	}
	load_img_by_url();
	var loadhtml = document.getElementById("loading_fhs");
    	loadhtml.parentNode.removeChild(loadhtml);
	document.getElementById("bodytxt").style.display="";
	setInterval("loadcode()",1000);
	console.clear();
	console.log("welcome to me Blog");
}
function copy(text)
{
	var textarea=document.createElement("textarea");
	textarea.value=text;
	document.body.appendChild(textarea);
	textarea.focus();
    if(textarea.setSelectionRange)
        textarea.setSelectionRange(0,textarea.value.length);
    else
        textarea.select();
    document.execCommand("copy");
	document.body.removeChild(textarea);
}
function cpyid(id)
{
	var toc=document.getElementById(id);
	var textarea=document.createElement("textarea");
	textarea.value=toc.innerText;
	toc.parentNode.appendChild(textarea);
	textarea.focus();
    if(textarea.setSelectionRange)
        textarea.setSelectionRange(0,textarea.value.length);
    else
        textarea.select();
    document.execCommand("copy");
	toc.parentNode.removeChild(textarea);

}
function sh()
{
	copy(window.location.href);
	alert("/≧▽≦/___复制成功\n欢迎加友链");
}
function changesteve()
{
	if(steve==true)
	{
		ul();
	}
	else
	{
		rl();
	}
}
function ul()
{
	steve=false;
	var node=document.getElementById("steve_button");
	document.getElementById("steve").style.display="none";
	node.innerHTML="显示Steve";
}
function rl()
{
	steve=true;
	var node=document.getElementById("steve_button");
	document.getElementById("steve").style.display="";
	node.innerHTML="隐藏Steve";
}
function sy()
{
	location.reload();
}

function changercplace(x,y)
{
	var rc=document.getElementById("rmenu");
	rc.style.left=x+"px";
	rc.style.top=y+"px";
}
window.oncontextmenu=function(e)
{
	e.preventDefault();
	var rmenu=document.getElementById("rmenu");
	var rwi=rmenu.clientWidth;
	var rhe=rmenu.clientHeight;
	var wid=window.innerWidth;
	var hei=window.innerHeight;
	var x=e.clientX;
	var y=e.clientY;
	if(x+rwi>wid-1)
	{
		x=x-rwi;
	}
	if(y+rhe>hei-1)
	{
		y=y-rhe;
	}
	changercplace(x,y);
	rmenu.style.display="";
}
window.onclick=function(e)
{
	if(e.srcElement.tagName.toLocaleUpperCase()!="BCOPEREAATOR")
	{
		hide_warn();
	}
	document.getElementById("rmenu").style.display="none";
}
window.onmousewheel=function(e)
{
	if(e.srcElement.tagName.toLocaleUpperCase()!="BCOPEREAATOR")
	{
		hide_warn();
	}
	document.getElementById("rmenu").style.display="none";
}

function jump(url)
{
	window.open(url);
}

window.onkeydown = window.onkeyup = window.onkeypress = function (event)
{
	if (event.keyCode === 123)
	{
        event.preventDefault();
        window.event.returnValue = false;
    }
}
$("#app").click
(
	function(e)
	{
		if(document.defaultView.getComputedStyle(window.event.srcElement, null).cursor=="pointer")
		return;
		if(document.defaultView.getComputedStyle(window.event.srcElement, null).cursor=="text")
		return;
		if(document.defaultView.getComputedStyle(window.event.srcElement, null).cursor=="move")
		return;
		if(document.defaultView.getComputedStyle(window.event.srcElement, null).cursor=="wait")
		return;
		if(document.defaultView.getComputedStyle(window.event.srcElement, null).cursor=="help")
		return;
		el = event.target;
		var a = new Array
		(
			"ZDF_akioi",
			"WSC_akioi",
			"Z F_akioi",
			"WZT_akioi",
			"TXZ_akioi",
			"HMY_akioi",
			"FCY_akioi",
			"ZXC_akioi",
			"ZHF_akioi"
		);
		var $i = $("<span></span>").text(a[a_idx]);
		a_idx = (a_idx + 1) % a.length;
		var splen=document.createElement('span');
		splen.innerHTML=a[a_idx];
		document.body.appendChild(splen);
		var width=splen.offsetWidth;
		document.body.removeChild(splen);
		var x = e.pageX-width/2, y = e.pageY;
		$i.css
		(
			{
				"z-index": 999999999999999999999999999999999999999999999999999999999999999999999,
				"top": y - 20,
				"left": x,
				"position": "absolute",
				"font-weight": "bold",
				"color": "rgb("+~~(255*Math.random())+","+~~(255*Math.random())+","+~~(255*Math.random())+")"
			}
		);
		$("#app").append($i);
		$i.animate
		(
			{
				"top": y - 180,
				"opacity": 0
			},
			1500,
			function()
			{
				$i.remove();
			}
		);
	}
);
