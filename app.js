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
    
        function Router() {}
    
        Router.prototype.user_join = function (settings, id) {
            Octocat.octocats[id] = new Octocat(settings);
        }

        Router.prototype.user_chat = function (msg, id, img) {
            if (Octocat.octocats[id]) {
                Octocat.octocats[id].user_chat(msg);
            } else {
                history.add(null, msg, img);
            }
        }

        Router.prototype.user_move = function (loc, id) {
            Octocat.octocats[id][Messages.USER_MOVE](loc);
        }

        Router.prototype.user_leave = function (msg, id) {
            Octocat.octocats[id].remove();
            delete Octocat.octocats[id];
        }

        Router.prototype.connect = function (msg) {
            console.log(msg);
            for (var key in msg.users) {
                this[Messages.USER_JOIN](msg.users[key], key);
            }
            for (key in msg.chat) {
                this[Messages.USER_CHAT](msg.chat[key][0], msg.chat[key][1], msg.chat[key][2]);
            }
        }
    
        return Router;
    
    }());

    var ChatHistory = (function() {
        'use strict';
    
        function ChatHistory() {
            var p = {},
                messages = [],
                self = this,
                bool = false;
                
            
            p.add = function (octocat, msg, img) {
                if (msg.length === 0) return;
                messages.push(self.createMessageElement(octocat, msg, bool, img));
                bool = !bool;
            }
            return p;
        }
        
        ChatHistory.prototype.createMessageElement = function (octocat, msg, isColor, img) {
            var color = isColor ? '#E5ECFF' : '#FFF';
            var $div = $('<div></div>').addClass('history-row').css({
                backgroundColor: color
            });
            var $avatar;
            if (octocat) {
                $avatar = $('<div></div>').addClass('avatar').css({
                    backgroundImage: "url('" + 'http://octodex.github.com/images/' + icons[octocat.settings.image] + "')",
                });
            } else {
                $avatar = $('<div></div>').addClass('avatar').css({
                    backgroundImage: "url('" + 'http://octodex.github.com/images/' + icons[img] + "')",
                });
            }
            
            var $content = $('<div></div>').addClass('content').html(escapeHtml(msg));
            $div.append($avatar);
            $div.append($content);
            $('.history').append($div).clearQueue().stop().animate({
                scrollTop: $('.history').prop("scrollHeight")
            }); 
            return $div;
        } 
    
        return ChatHistory;
    
    }());

    //One user in server
    var Octocat = (function() {
        'use strict';
        
        Octocat.octocats = {};
            
        function Octocat(settings, isSelf) {
            if (isSelf) {
                Octocat.self = this;
            }
            this.$bubble = null;
            this.$div = null
            settings = settings || {};
            this.settings = {
                x: settings.x || 100,
                y: settings.y || 100,
                width: 150,
                height: 150,
                image: settings.image || Math.floor(Math.random() * icons.length)
            };
            if (isSelf) {
                this.createElement("user");
            } else {
                this.createElement("");
            }
            
        }

        Octocat.prototype.createElement = function (clazz) {
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
            this.$bubble.hide();
            this.$div.append(this.$bubble);
        }

        Octocat.prototype.user_chat = function (msg) {
            this.$bubble.html(escapeHtml(msg));
            if (msg.length > 0) {
                this.$bubble.show();
                history.add(this, msg);
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
        router = new Router(),
        history = new ChatHistory();
    new Octocat(null, true);

    channel.onsignal = function(e) {
        var msg = JSON.parse(e.message);
        //console.log(msg);
        if (msg.id === Octocat.self.id) {
            //console.log("return");
            return;
        }
        if (!Octocat.self.id) {
            Octocat.self.id = msg.id;
        }
        router[msg.type](msg.msg, msg.id);
    };

    channel.onopen = function() {
        emit(Messages.USER_JOIN, Octocat.self.settings);
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
        if (e.target.className.indexOf('noclick') != -1) return;
        var loc = {x: e.pageX, y: e.pageY};
        Octocat.self[Messages.USER_MOVE](loc);
        emit(Messages.USER_MOVE, loc);
    });

    function sendMessage() {
        var msg = $('input[name=msg]').val();
        $('input[name=msg]').val('');
        emit(Messages.USER_CHAT, msg);
        Octocat.self[Messages.USER_CHAT](msg);
    }
});