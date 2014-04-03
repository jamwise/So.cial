var so = {
    cial:function(options)
    {
        
        if(typeof options !== "object") return false;
        if(typeof options.permissions === "string") this.permissions = options.permissions;
        var autoSize = (typeof options.autoSize !== "undefined") ? options.autoSize : false;
        var context = this;
        this.server_flow = (typeof options.server_flow !== "undefined") ? options.server_flow : false;
        this.appId = (typeof options.appId !== "undefined") ? options.appId : false;
        this.redirectUri = (typeof options.redirectUri !== "undefined") ? options.redirectUri : false;

        window.fbAsyncInit = function() {

            FB.init({
                appId      : options.appId, // App ID
                status     : true, // check login status
                cookie     : true, // enable cookies to allow the server to access the session
                xfbml      : true,  // parse XFBML
                oauth  : true
            });

            context.getUserData(options.callback,false);
        };

        if(autoSize) context.autoSize();
        //FB.Canvas.setAutoGrow();
            
        //Facebook's async loading of SDK:
        var d = document;
        var s = 'script';
        var id = 'facebook-jssdk';
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/all.js";
        fjs.parentNode.insertBefore(js, fjs);

    },

    autoSize:function(){
        var auto = (typeof arguments[0] !== "undefined") ? arguments[0] : true;
        var time = (typeof arguments[1] !== "undefined") ? arguments[1] : 500;
        if(auto) this.interval = self.setInterval(this.autoSizeProcess,time);
        else this.autoSizeProcess;
    },

    autoSizeProcess:function(){
        var body = document.body,
        html = document.documentElement;
        var height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );

        FB.Canvas.setSize({width:810,height:document.body.offsetHeight});
    },

    getUserData: function()
    {

        var askForLogin = (typeof arguments[1] !== "undefined") ? arguments[1] : true;
        var callback = (typeof arguments[0] !== "function") ? false : arguments[0];
        var context = this;

        if(this.redirectUri && askForLogin)
        {
            this.serverLogin();
        }else {
            FB.getLoginStatus(function(response) {
                if (response.status === 'connected') {
                    var accessToken = response.authResponse.accessToken;
                    context.facebook_id = response.authResponse.userID;
                    if(callback) callback(true,response);
                } else {
                    if(askForLogin) context.dialogLogin(callback);
                    else if(callback) callback(false,response)
                }
            });
        }
    },

    scrollTo: function()
    {
        var position = (typeof arguments[0] === "object") ? arguments[0] : {x:0,y:arguments[0]};            

        FB.Canvas.getPageInfo(function(pageInfo){
            $({y: pageInfo.scrollTop}).animate(
                {y: position.y},
                {duration: 1000, step: function(offset){
                    FB.Canvas.scrollTo(0, offset);
                }
            });
        });
    },

    dialogLogin: function()
    {
        var callback = (typeof arguments[0] !== "function") ? false : arguments[0];
        var context = this;

        FB.login(function(response) {
            if (response.authResponse) {
              FB.api('/me', function(response) {
                context.facebook_id = response.id;
                if(callback) callback(true,response);
              });
            } else {
                if(callback) callback(false,response);
            }
        }, {scope: context.permissions});
    },

    serverLogin: function()
    {
        if(!this.appID || !this.redirectUri) return false;
        window.open(this.strings.facebook_server_flow_url+"?client_id="+this.appId+"&redirectUri="+this.redirectUri+fr+"&scope="+this.permissions,"_self");
    },

    inviteFriends:function()
    {

        var message = (typeof arguments[0] !== "string") ? false : arguments[0];
        var callback = (typeof arguments[1] !== "function") ? false : arguments[1];
        
        if(!message || !callback) return false;
            console.log("invite");
        FB.ui({method: 'apprequests',
            message: message
        }, callback);
    },

    fql: function()
    {
        if ('undefined' !== typeof FB) {
            var type = typeof arguments[0];
            var query = (type === "string" || type === "object") ? arguments[0] : false;
            var callback = (typeof arguments[1] !== "function") ? false : arguments[1];

            if(query && callback && type === "string")
            {
                FB.api({
                    method: 'fql.query',
                    query: query
                }, callback);

            } 

            else if(query && callback && type === "object") 
            {
                var method = {
                    method:'fql.multiquery',
                    queries: {}
                };
                for(var i = 1; i <= query.length; i++)
                {
                    method.queries['query'+i] = query[i-1];
                };
                
                FB.api(method, callback);
            }
        }
    },

    postInWindow: function()
    {
        var url = (typeof arguments[0] === "string") ? arguments[0] : false;
        var w = 550;
        var h = 500;
        var left = (screen.width/2)-(w/2);
        var top = (screen.height/2)-(h/2);
        var shareWindow = window.open(url,'','toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
        return shareWindow;
    },

    share: function()
    {
        var object = (typeof arguments[0] === "object") ? arguments[0] : false;
        var callback = (typeof arguments[1] === "function") ? arguments[1] : false;
        
        if ('undefined' !== typeof FB && object) {
            var type = (typeof object.type === "string") ? object.type : false;
            switch(type)
            {
                case "facebook_auto":
                    this.facebookAutoShare(object,callback);
                    break;

                case "facebook":
                    this.facebookShare(object,callback);
                    break;

                default:
                    this.facebookShare(object,callback);
            }
        }
    },

    twitterShare: function()
    {
        var object = (typeof arguments[0] === "object") ? {
            link    : (typeof arguments[0].link !== "undefined") ? arguments[0].link : "",
            description    : (typeof arguments[0].description !== "undefined") ? arguments[0].description : ""
        } : false;

        if(object) this.postInWindow(this.strings.twitter_url+"?text="+encodeURIComponent(object.description)+"&url="+(object.link));
    },

    facebookShare: function()
    {           
        var object = (typeof arguments[0] === "object") ? arguments[0] : false;
        var callback = (typeof arguments[1] === "function") ? arguments[1] : false;

        var shareObject = {
            method: 'feed',
            link: (typeof object.link !== "undefined") ? object.link : "",
            picture: (typeof object.picture !== "undefined") ? object.picture : "",
            name: (typeof object.title !== "undefined") ? object.title : "",
            caption: (typeof object.caption !== "undefined") ? object.caption : "",
            description: object.description
        };
            
        FB.ui(shareObject,
        function (response) {
            
            if (response && response.post_id) {
                if(callback) callback(true,response);
            } else {
                if(callback) callback(false);
            }
            
        });
    },

    permissions     : '',

    appId           : false,

    redirectUri    : false,

    server_flow     : false,

    facebook_id     : false,

    strings         : {
        facebook_server_flow_url        :   "https://www.facebook.com/dialog/oauth",
        twitter_url                     :   "http://twitter.com/intent/tweet",
        instagram_url                   :   "https://instagram.com/oauth/authorize/"
    }

}