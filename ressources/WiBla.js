﻿// For any informations, go to: https://github.com/WiBla/Script

if(!$("#WiBla-CSS")[0]) {
	// ####### [Global variables] #######
	var old_chat, menu_css, purple_css, blue_css, notif, style, vol,
	wibla = API.getUser().id == 4613422,
	zurbo = API.getUser().id == 4506088,
	dano = API.getUser().id == 209178,
	isDev = wibla || zurbo || dano,
	hasPermBouncer = API.hasPermission(null, API.ROLE.BOUNCER) || isDev,
	vol=API.getVolume();
	json = {
	"V": "Beta 1.0.4",
	"showMenu": false,
	"autoW": false,
	"autoDJ": false,
	"showVideo": false,
	"CSS": 0,
	"oldChat": true,
	"durationAlert": false,
	"bg": "",
	"betterMeh": false,
	"security": false,
	"afk": false,
	"time": 435,
	"bot": "3455411",
	};
	
	// Alpha & Beta tester privilege
	var pseudo = API.getUser().username;
	var ID = API.getUser().id;

	// Running the specified version
	init();
}

// #################### [Functions] ####################
function init(v) {
	// Creating core elements
	if (v == "alpha") {
		old_chat ="https://rawgit.com/WiBla/Script/alpha/ressources/old-chat.css";
		purple_css = "https://rawgit.com/WiBla/Script/alpha/ressources/purple.css";
		menu_css = "https://rawgit.com/WiBla/Script/alpha/ressources/menu.css";
		blue_css = "https://rawgit.com/WiBla/Script/alpha/ressources/blue.css";
		notif = new Audio("https://raw.githubusercontent.com/WiBla/Script/alpha/ressources/notif.wav");
	} else {
		old_chat ="https://rawgit.com/WiBla/Script/master/ressources/old-chat.css";
		purple_css = "https://rawgit.com/WiBla/Script/master/ressources/purple.css";
		menu_css = "https://rawgit.com/WiBla/Script/master/ressources/menu.css";
		blue_css = "https://rawgit.com/WiBla/Script/master/ressources/blue.css";
		notif = new Audio("https://raw.githubusercontent.com/WiBla/Script/master/ressources/notif.wav");
	}
	var menu = "", moderateGUI = "", icon = "";
		menu += '<div id="Settings">';
		menu += '	<ul>';
		menu += '		<li id="ws-woot"     onclick="json.autoW = !json.autoW;autowoot();">Auto-woot</li>';
		menu += '		<li id="ws-join"     onclick="json.autoDJ = !json.autoDJ;autojoin();">Auto-join</li>';
		menu += '		<li id="ws-video"    onclick="hideStream();">Hide video</li>';
		menu += '		<li id="ws-css"      onclick="design();">Custom Style</li>';
		menu += '		<li id="ws-old-chat" onclick="oldChat();">Old chat</li>';
		menu += '		<li id="ws-bg"       onclick="askBG();">Custom Bg</li>';
		menu += '		<li id="ws-lengthA"  onclick="json.alertDuration = !json.alertDuration;alertDuration();">Song limit</li>';
		menu += '		<li id="ws-mutemeh"  onclick="muteMeh();">Mute on meh</li>';
		menu += '		<li id="ws-off"      onclick="WiBla_Script_Shutdown();">Shutdown</li>';
		menu += '		<li id="ws-V">'+ json.V +'</li>';
		menu += '	</ul>';
		menu += '</div>';
		moderateGUI += '<div id="ws-rmvDJ" onclick="removeDJ()">';
		moderateGUI += '	<img src="https://raw.githubusercontent.com/WiBla/Script/master/images/other/romveDJ.png" alt="button remove from wait-list" />';
		moderateGUI += '</div>';
		moderateGUI += '<div id="ws-skip" onclick="forceSkip();">';
		moderateGUI += '	<img src="https://raw.githubusercontent.com/WiBla/Script/master/images/other/skip.png" alt="button skip" />';
		moderateGUI += '</div>';
		icon += '<div id="del-chat-button" class="chat-header-button">';
		icon += '	<i class="icon ws-delChat" onclick="API.sendChat(\'/clear\')"></i>';
		icon += '</div>';

	// Displaying them
	var a = $("<div id='Box' onclick='slide()'><div id='icon'></div></div>");
	$("#app").append(a);// Menu icon
	var b = $(menu);
	$("#app").append(b);// Menu itself
	var c = $("<link id='WiBla-menu-CSS' rel='stylesheet' type='text/css' href='"+menu_css+"'>");
	$("head").append(c);// Menu css
	var d = $("<link id='WiBla-CSS' rel='stylesheet' type='text/css' href=''>");
	$("head").append(d);// General css
	var e = $("<link id='WiBla-Old-Chat-CSS' rel='stylesheet' type='text/css' href=''>");
	$("head").append(e);// Old chat css
	var f = $(icon);
	$("#chat-header").append(f);// DelChat icon
	
	// If at least bouncer (or developer)
	if (hasPermBouncer) {
		var g = $(moderateGUI);
		$("#playback-container").after(g);// Moderation tools
	}
	// Element that only are available after the script has loaded
	window.item = {
		//script
		"box": $("#Box")[0],
		"settings": $("#Settings")[0],
		"style": $("#WiBla-CSS")[0],
		"oldStyle": $("#WiBla-Old-Chat-CSS")[0],
		"skip": $("#ws-skip")[0],
		"rmvDJ": $("#ws-rmvDJ")[0],
		//script menu
		"woot": $("#ws-woot")[0],
		"join": $("#ws-join")[0],
		"video": $("#ws-video")[0],
		"css": $("#ws-css")[0],
		"oldChat": $("#ws-old-chat")[0],
		"bg": $("#ws-bg")[0],
		"lengthA": $("#ws-lengthA")[0],
		"betterMeh": $("#ws-mutemeh")[0],
		"off": $("#ws-off")[0],
		//plug in general
		"stream": $("#playback-container")[0],
		"head": $("head")[0],
	};

	firstRun();
}
function firstRun() {
	autowoot();
	autojoin();
	hideStream();
	design();
	oldChat();
	item.bg.className = "ws-off";
	alertDuration();
	json.betterMeh = true;muteMeh();
	
	
	// API initalization
	API.on(API.ADVANCE, autowoot);
	API.on(API.ADVANCE, autojoin);
	API.on(API.ADVANCE, alertDuration);
	API.on(API.ADVANCE, json.security = false);
	API.on(API.CHAT_COMMAND, chatCommand);

	// Keyboard shorcuts
	$(window).bind("keydown", function(k) {
		if (k.keyCode == 107 && !$($("#chat-input")).attr("class")) {
			var volume = API.getVolume();
			volume += 3;
			API.setVolume(volume);
		}
	});
	$(window).bind("keydown", function(k) {
		if (k.keyCode == 109 && !$($("#chat-input")).attr("class")) {
			var volume = API.getVolume();
			volume -= 3;
			API.setVolume(volume);
		}
	});

	// Fully loaded
	API.chatLog("WiBla Script " + json.V + " loaded !");
	API.chatLog("Type /list for commands list.");
}

// #### [Menu] ####
function autowoot() {
	if (json.autoW === true) {
		$("#woot")[0].click();
		item.woot.className = "ws-on";
	} else {
		item.woot.className = "ws-off";
	}
}
function autojoin() {
	var dj = API.getDJ();
	if (json.autoDJ) {
		item.join.className = "ws-on";
		if (dj === null || dj.id !== API.getUser().id || API.getWaitListPosition() > -1) {
			switch (API.djJoin()) {
				case 1:
					API.chatLog("Cannot auto-join: Wait list is locked");
					break;
				case 2:
					API.chatLog("Cannot auto-join: Invalid active playlist");
					break;
				case 3:
					API.chatLog("Cannot auto-join: Wait List is full");
					break;
			}
		}
	} else {
		item.join.className = "ws-off";
	}
}
function hideStream() {
	json.showVideo = !json.showVideo;
	if (json.showVideo) {
		item.stream.style.visibility = "visible";
		item.stream.style.height = "281px";
		if (hasPermBouncer) {
			item.rmvDJ.style.top = item.skip.style.top = "283px";
		}
		$("#playback-controls")[0].style.visibility = "visible";
		$("#no-dj")[0].style.visibility = "visible";
		item.video.className = "ws-off";
	} else {
		item.stream.style.visibility = "hidden";
		item.stream.style.height = "0";
		if (hasPermBouncer) {
			item.rmvDJ.style.top = item.skip.style.top = "0";
		}
		$("#playback-controls")[0].style.visibility = "hidden";
		$("#no-dj")[0].style.visibility = "hidden";
		item.video.className = "ws-on";
	}
}
function design() {
	if (json.bg == "reset") askBG();
	if (json.CSS >= 3)json.CSS = 1; else json.CSS++;
	switch(json.CSS) {
		case 1:
			item.style.setAttribute("href", '');
			item.css.className = "ws-off";
			break;
		case 2:
			item.style.setAttribute("href", blue_css);
			json.bg = "reset"; askBG();
			item.css.className = "ws-on";
			break;
		case 3:
			item.style.setAttribute("href", purple_css);
			json.bg = "default"; askBG();
	}
}
function oldChat() {
	json.oldChat = !json.oldChat;
	if (json.oldChat) {
		item.oldChat.className = "ws-on";
		item.oldStyle.setAttribute("href", old_chat);
	} else {
		item.oldChat.className = "ws-off";
		item.oldStyle.setAttribute("href", "");
	}
}
function askBG() {
	switch (json.bg) {
		case "reset":
			json.bg = "https://raw.githubusercontent.com/WiBla/Script/master/images/background/default/FEDMC.jpg";
			style = $(".room-background")[0].getAttribute("style").split(" ");
			style[9] = "url(" + json.bg +")";
			style = style.join(" ");
			$(".room-background")[0].setAttribute("style", style);
			item.bg.className = "ws-on";
		break;
		case "default":
			json.bg = "https://raw.githubusercontent.com/WiBla/Script/master/images/background/default/Island.jpg";
			style = $(".room-background")[0].getAttribute("style").split(" ");
			style[9] = "url(" + json.bg +")";
			style = style.join(" ");
			$(".room-background")[0].setAttribute("style", style);
			item.bg.className = "ws-off";
		break;
		default:
			json.bg = prompt("Image URL:\nType:\n\"reset\" default script background\n\"default\" default plug background");
			if (json.bg !== null && json.bg.length > 0) {
				style = $(".room-background")[0].getAttribute("style").split(" ");
				style[9] = "url(" + json.bg +")";
				style = style.join(" ");
				$(".room-background")[0].setAttribute("style", style);
				item.bg.className = "ws-on";
			}
		break;
	}
}
function alertDuration() {
	if (json.alertDuration) {
		item.lengthA.className = "ws-on";
		if (API.getMedia().duration > json.time) {
			notif.play();
			API.chatLog("Music is too long ! 7:15 max !");
		}
	} else {
		item.lengthA.className = "ws-off";
	}
}
function muteMeh() {
	json.betterMeh = !json.betterMeh;
	if (json.betterMeh) {
		$("#meh")[0].setAttribute("onclick", "vol=API.getVolume();API.setVolume(0);");
		$("#woot")[0].setAttribute("onclick", "if(API.getVolume()===0){API.setVolume(vol)};");
		item.betterMeh.className = "ws-on";
	} else {
		$("#meh")[0].setAttribute("onclick", "");
		$("#woot")[0].setAttribute("onclick", "");
		item.betterMeh.className = "ws-off";
	}
}
function WiBla_Script_Shutdown() {
	API.stopListening(API.CHAT_COMMAND, chatCommand);
	API.stopListening(API.ADVANCE, alertDuration);
	API.stopListening(API.ADVANCE, autowoot);
	API.stopListening(API.ADVANCE, autojoin);
	$(window).unbind();
	// Preventing making the video definitly desapear
	if (json.showVideo === false) {
		hideStream();
		setTimeout(WiBla_Script_Shutdown,250);
	}
	item.box.remove();
	item.settings.remove();
	$("#WiBla-menu-CSS")[0].remove();
	item.style.remove();
	item.oldStyle.remove();
	$(".icon.ws-delChat")[0].remove();
	if (hasPermBouncer) {
		item.rmvDJ.remove();
		item.skip.remove();
	}
}
function slide() {
	var show = json.showMenu = !json.showMenu,
		menu = $("#Settings")[0];
	if (show === false) {
		menu.style.visibility = "hidden";
		menu.style.zIndex = "0";
		menu.style.right = "200px";
	} else if (show === true) {
		menu.style.visibility = "visible";
		menu.style.zIndex = "2";
		menu.style.right = "345px";
	}
}
function forceSkip() {
	if (json.security === false) {
		json.security = true;
		API.chatLog(":warning: Security: you need to click once more to skip.");
	} else {
		json.security = false;
		API.moderateForceSkip();
	}
}
function removeDJ() {
	API.chatLog("This button will kick of the DJ from the wait-list, but doesn't work atm");
}
function chatCommand(commande) {
	var args = commande.split(" ");
	switch (args[0]) {
		case "/like":
			API.sendChat(":heart_eyes::heartpulse::heart_eyes::heartpulse::heart_eyes:");
			break;
		case "/love":
			if (args[1] === undefined) {
				API.sendChat(":heart_eyes::heartpulse::heart_eyes::heartpulse::heart_eyes::heartpulse::heart_eyes::heartpulse::heart_eyes::heartpulse:");
			} else {
				API.sendChat(args[1] + " :heart_eyes::heartpulse::heart_eyes::heartpulse::heart_eyes::heartpulse::heart_eyes::heartpulse::heart_eyes::heartpulse:");
			}
			break;
		case "/eta":
			if (API.getUser().id == API.getDJ().id) {
				API.chatLog("You are the DJ !");
			} else if (API.getWaitListPosition() == -1) {
				API.chatLog("You are not in the Wait-List.");
			}	else {
				var eta = API.getWaitListPosition() + 1; //index 0
				eta = eta * 4; //we assume that everyone plays 4mins music
				eta = eta * 60; //transform in second
				eta = eta + API.getTimeRemaining(); //to add the time remaining
				eta = eta / 60; //then split in minutes
				eta = Math.round(eta, 1); //gives a rounded result
				if (eta >= 60) {
					var etaH = eta / 60;
					etaH = Math.round(etaH, 1); //gives hours
					var etaM = eta % 60; //gives minutes
					API.chatLog("There is " + etaH + "H" + etaM + "min(s) before you play.");
				} else {
					API.chatLog("There is " + eta + " min(s) before you play.");
				}
			}
			break;
		case "/vol":
			if (args[1] >= 0 && args[1] <= 100) {
				API.setVolume(args[1]);
			} else {
				API.chatLog("usage: /vol [0-100]");
			}
			break;
		case "/afk":
			json.afk = !json.afk;
			if (json.afk) {
				API.sendChat("/me is AFK.");
			} else {
				API.sendChat("/me is back.");
			}
			break;
		/* Experimental
		case "/bot":
			if (args[1] === undefined) {
				API.chatLog("Write either the pseudo or the id of the bot in your room after /bot");
			}
			break;*/
		case "/whoami":
			API.chatLog("Username: " + API.getUser().username);
			API.chatLog("ID: " + API.getUser().id);
			API.chatLog("Description: " + API.getUser().blurb);
			API.chatLog("Avatar: " + API.getUser().avatarID);
			API.chatLog("Badge: " + API.getUser().badge);
			API.chatLog("Lvl: " + API.getUser().level);
			API.chatLog("XP: " + API.getUser().xp);
			API.chatLog("PP: " + API.getUser().pp);
			break;
		/*case "/ban":
			break;*/
		case "/list":
			API.chatLog("/like <3 x 5");
			API.chatLog("/love [@user] <3 x 10 + user (optional)");
			API.chatLog("/eta the time before you DJ");
			API.chatLog("/vol [0-100]");
			API.chatLog("/afk say that you're afk or not");
			API.chatLog("/whoami display your own infos");
			API.chatLog("/list display this list");
	}
}