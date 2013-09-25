(function () {
    var octocats = ["octoliberty.png", "femalecodertocat.png", "daftpunktocat-thomas.gif", "daftpunktocat-guy.gif", "foundingfather_v2.png", "poptocat_v2.png", "Mardigrastocat.png", "kimonotocat.png", "Professortocat_v2.png", "goretocat.png", "FIRSTocat.png", "motherhubbertocat.png", "skitchtocat.png", "gangnamtocat.png", "droctocat.png", "spidertocat.png", "megacat-2.png", "dodgetocat_v2.png", "stormtroopocat.png", "pusheencat.png", "deckfailcat.png", "murakamicat.png", "homercat.png", "minion.png", "droidtocat.png", "octofez.png", "heisencat.png", "red-polo.png", "twenty-percent-cooler-octocat.png", "momtocat.png", "front-end-conftocat.png", "snowoctocat.png", "electrocat.png", "aidorucat.png", "codercat.jpg", "strongbadtocat.png", "adventure-cat.png", "doctocat-brown.jpg", "dojocat.jpg", "defunktocat.png", "herme-t-crabb.png", "saint-nicktocat.jpg", "orderedlistocat.png", "thanktocat.png", "megacat.jpg", "linktocat.jpg", "plumber.jpg", "octotron.jpg", "baracktocat.jpg", "octocat-de-los-muertos.jpg", "grim-repo.jpg", "father_timeout.jpg", "waldocat.png", "hipster-partycat.jpg", "riddlocat.png", "visionary.jpg", "oktobercat.png", "shoptocat.png", "nyantocat.gif", "octdrey-catburn.jpg", "spectrocat.png", "bear-cavalry.png", "andycat.jpg", "notocat.jpg", "dodgetocat.jpg", "cloud.jpg", "scarletteocat.jpg", "poptocat.png", "jenktocat.jpg", "xtocat.jpg", "chellocat.jpg", "cherryontop-o-cat.png", "supportcat.png", "constructocat2.jpg", "total-eclipse-of-the-octocat.jpg", "pacman-ghosts.jpg", "octoclark-kentocat.jpg", "agendacat.png", "ironcat.jpg", "jean-luc-picat.jpg", "spocktocat.png", "wilson.jpg", "drunktocat.jpg", "dolla-dolla-bill-yall.jpg", "hubot.jpg", "trekkie.png", "octonaut.jpg", "bouncercat.png", "pythocat.png", "drupalcat.jpg", "socialite.jpg", "repo.png", "forktocat.jpg"];

    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    };

    function escapeHtml(string) {
        return String(string).replace(/[&<>"'\/]/g, function (s) {
            return entityMap[s];
        });
    }

    function randomHexColor() {
        var color = "";
        for (var i = 0; i < 6; i++) {color += Math.floor(Math.random() * 16).toString(16);}
            return color;
    }

    var Messages = {
        CONNECT: "connect",
        USER_JOIN: "user_join",
        USER_LEAVE: "user_leave",
        USER_MOVE: "user_move",
        USER_CHAT: "user_chat"
    };

    var channel = new HydnaChannel('test123.hydna.net', 'rwe');
    var id;
    var user;
    var gui = null;

    channel.onsignal = function(e) {

        var msg = JSON.parse(e.message);
        console.log(msg);
        if (msg.id === id) return;
        if (!gui) {
            id = msg.id;
            gui = new graphics(user);
        }

        gui[msg.type](msg.msg, msg.id);
    };

    channel.onopen = function() {
        var height = 150;
        user = {
            height: height,
            width: height,
            x: Math.round(Math.random() * 300),
            y: 100,
            text: null,
            color: randomHexColor(),
            image: Math.floor(Math.random() * octocats.length)
        }
        emit(Messages.USER_JOIN, user);
    };

    function emit(type, message) {
        channel.emit(JSON.stringify([type, message]));
    }

    function graphics(_user) {
        var users = {};
        users[id] = createAndAddUser(_user, 'user');

        function createAndAddUser(user, clazz) {
            var $div = $('<div></div>').addClass("kitten " + clazz).css({
                width: user.width + "px",
                height: user.width + "px",
                backgroundImage: "url('" + 'http://octodex.github.com/images/' + octocats[user.image] + "')",
                left: user.x,
                top: user.y,
                backgroundSize: user.width + 'px ' + user.height + 'px'
            });
            $('body').append($div);

            $div.append($('<div></div>').addClass("bubble"));

            return $div;
        }

        this.user_join = function (user, id) {
            users[id] = createAndAddUser(user);
            if (user.text) {
                gui.user_chat(user.text, id);
            }
        }

        this.user_chat = function (msg, id) {
            var $bubble = users[id].children().first();
            $bubble.html(escapeHtml(msg));
            $bubble.css({
                display: "block"
            });
        }

        this.user_move = function (loc, id) {
            var $user = users[id];
            $user.clearQueue().stop().animate({
                left: loc.x - $user.width() / 2 + "px",
                top: loc.y - $user.height() / 2 + "px"
            });
        }

        this.user_leave = function (msg, id) {
            users[id].remove();
            delete users[id];
        }

        this.connect = function (msg) {
            for (var key in msg) {
                gui[Messages.USER_JOIN](msg[key], key);
            }
        }
    }

    $(function () {
        $('input[name=button]').click(function(){
            sendMessage();
        });
        $(document).keypress(function(e) {
            if(e.which == 13) {
                sendMessage();
                return false;
            }
        });

        window.onclick = function (e) {
            if (e.y > $(window).height() - 110) return;
            gui[Messages.USER_MOVE](e, id);
            emit(Messages.USER_MOVE, {x: e.x, y: e.y});
        }
    });

    function sendMessage() {
        var msg = $('input[name=msg]').val();
        $('input[name=msg]').val('');
        emit(Messages.USER_CHAT, msg);
        gui[Messages.USER_CHAT](msg, id);
    }
})();