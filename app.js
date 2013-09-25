$(function () {
    var icons = ["octoliberty.png", "femalecodertocat.png", "daftpunktocat-thomas.gif", "daftpunktocat-guy.gif", "foundingfather_v2.png", "poptocat_v2.png", "Mardigrastocat.png", "kimonotocat.png", "Professortocat_v2.png", "goretocat.png", "FIRSTocat.png", "motherhubbertocat.png", "skitchtocat.png", "gangnamtocat.png", "droctocat.png", "spidertocat.png", "megacat-2.png", "dodgetocat_v2.png", "stormtroopocat.png", "pusheencat.png", "deckfailcat.png", "murakamicat.png", "homercat.png", "minion.png", "droidtocat.png", "octofez.png", "heisencat.png", "red-polo.png", "twenty-percent-cooler-octocat.png", "momtocat.png", "front-end-conftocat.png", "snowoctocat.png", "electrocat.png", "aidorucat.png", "codercat.jpg", "strongbadtocat.png", "adventure-cat.png", "doctocat-brown.jpg", "dojocat.jpg", "defunktocat.png", "herme-t-crabb.png", "saint-nicktocat.jpg", "orderedlistocat.png", "thanktocat.png", "megacat.jpg", "linktocat.jpg", "plumber.jpg", "octotron.jpg", "baracktocat.jpg", "octocat-de-los-muertos.jpg", "grim-repo.jpg", "father_timeout.jpg", "waldocat.png", "hipster-partycat.jpg", "riddlocat.png", "visionary.jpg", "oktobercat.png", "shoptocat.png", "nyantocat.gif", "octdrey-catburn.jpg", "spectrocat.png", "bear-cavalry.png", "andycat.jpg", "notocat.jpg", "dodgetocat.jpg", "cloud.jpg", "scarletteocat.jpg", "poptocat.png", "jenktocat.jpg", "xtocat.jpg", "chellocat.jpg", "cherryontop-o-cat.png", "supportcat.png", "constructocat2.jpg", "total-eclipse-of-the-octocat.jpg", "pacman-ghosts.jpg", "octoclark-kentocat.jpg", "agendacat.png", "ironcat.jpg", "jean-luc-picat.jpg", "spocktocat.png", "wilson.jpg", "drunktocat.jpg", "dolla-dolla-bill-yall.jpg", "hubot.jpg", "trekkie.png", "octonaut.jpg", "bouncercat.png", "pythocat.png", "drupalcat.jpg", "socialite.jpg", "repo.png", "forktocat.jpg"];

    function escapeHtml(string) {
        var entityMap = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': '&quot;',
            "'": '&#39;',
            "/": '&#x2F;'
        };
        return String(string).replace(/[&<>"'\/]/g, function (s) {
            return entityMap[s];
        });
    }

    //All possible hydna messages
    var Messages = {
        CONNECT: "connect",
        USER_JOIN: "user_join",
        USER_LEAVE: "user_leave",
        USER_MOVE: "user_move",
        USER_CHAT: "user_chat"
    };

    //Helps route messages from server
    var Router = (function() {
        'use strict';
    
        function Router() {
            //List of all users in server
            this.octocats = {};
        }
    
        Router.prototype.user_join = function (settings, id) {
            this.octocats[id] = new Octocat(settings);
            console.log("NEW USERS:", this.octocats);
        }

        Router.prototype.user_chat = function (msg, id) {
            this.octocats[id].user_chat(msg);
        }

        Router.prototype.user_move = function (loc, id) {
            console.log(this.octocats[id]);
            this.octocats[id][Messages.USER_MOVE](loc);
        }

        Router.prototype.user_leave = function (msg, id) {
            this.octocats[id].remove();
            delete octocats[id];
        }

        Router.prototype.connect = function (msg) {
            for (var key in msg) {
                this[Messages.USER_JOIN](msg[key], key);
            }
        }
    
        return Router;
    
    }());

    //One user in server
    var Octocat = (function() {
        'use strict';
    
        function Octocat(settings) {
            this.$bubble = null;
            this.$div = null
            settings = settings || {};
            this.settings = {
                x: settings.x || 100,
                y: settings.y || 100,
                width: 150,
                height: 150,
                text: null,
                image: settings.image || Math.floor(Math.random() * icons.length)
            };
            this.createElement("user");
        }

        Octocat.prototype.createElement = function (clazz) {
            console.log(this.settings);
            this.$div = $('<div></div>').addClass("kitten " + clazz).css({
                width: this.settings.width + "px",
                height: this.settings.width + "px",
                backgroundImage: "url('" + 'http://octodex.github.com/images/' + icons[this.settings.image] + "')",
                left: this.settings.x + "px",
                top: this.settings.y + "px",
                backgroundSize: this.settings.width + 'px ' + this.settings.height + 'px'
            });
            $('body').append(this.$div);
            
            this.$bubble = $('<div></div>').addClass("bubble");
            this.$div.append(this.$bubble);
            console.log(this.$div);
        }

        Octocat.prototype.user_chat = function (msg) {
            this.$bubble.html(escapeHtml(msg));
            if (msg.length > 0) {
                this.$bubble.show();
            } else {
                this.$bubble.hide();
            }
        }

        Octocat.prototype.user_move = function (loc) {
            this.$div.clearQueue().stop().animate({
                left: loc.x - this.$div.width() / 2 + "px",
                top: loc.y - this.$div.height() / 2 + "px"
            });
        }

        Octocat.prototype.remove = function (loc) {
            this.$div.remove();
        }

        return Octocat;
    
    }());

    var channel = new HydnaChannel('test123.hydna.net', 'rwe'),
        id,
        router = new Router();

    channel.onsignal = function(e) {
        var msg = JSON.parse(e.message);
        console.log(msg);
        if (msg.id === octocat.id) {
            console.log("return");
            return;
        }
        router[msg.type](msg.msg, msg.id);
        if (!octocat.id) {
            octocat.id = msg.id;
        }
    };

    channel.onopen = function() {
        octocat = new Octocat();
        emit(Messages.USER_JOIN, octocat.settings);
    };

    function emit(type, message) {
        channel.emit(JSON.stringify([type, message]));
    }

    // LISTENERS

    // SEND MESSAGE
    $('input[name=button]').click(function(){
        sendMessage();
    });
    
    // ENTER PRESS
    $(document).keypress(function(e) {
        if(e.which == 13) {
            sendMessage();
            return false;
        }
    });

    // USER MOVE CLICK
    window.addEventListener('click', function (e) {
        if (e.target.tagName.toUpperCase() !== "BODY") return;
        var loc = {x: e.pageX, y: e.pageY};
        octocat[Messages.USER_MOVE](loc, id);
        emit(Messages.USER_MOVE, loc);
    });

    function sendMessage() {
        var msg = $('input[name=msg]').val();
        $('input[name=msg]').val('');
        emit(Messages.USER_CHAT, msg);
        octocat[Messages.USER_CHAT](msg, id);
    }
});