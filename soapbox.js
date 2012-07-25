Soapbox = {
    createNew:function (bayeux) {
        var self = {};
        self.bayeux = bayeux;
        self._login = $('#enterUsername');
        self._app = $('#app');
        self._post = $('#postMessage');
        self._stream = $('#stream');
        self._latlng = $('#postLatlng');
        self._app.hide();
        self._latlng.hide();

        self._login.submit(function () {
            self._login.fadeOut('slow', function() {
                self._app.fadeIn('slow');
                self._latlng.fadeIn('slow');
                self._latlng.submit();
            });
            self._username = $('#username').val();
            self.bayeux.bind('transport:down', function () { self._post.find('textarea,input').attr('disabled', true); }, self);
            self.bayeux.bind('transport:up', function () { self._post.find('textarea,input').attr('disabled', false); }, self);
            self.bayeux.subscribe('/chat/*', self.accept, self);
            return false;
        });
        self._post.submit(function () {
            var msg = $('#message');
            self.bayeux.publish('/chat/'+self._username, {user:self._username, message:msg.val()});
            msg.val('');
            return false;
        });

        self.accept = function (message) {
            self._stream.prepend('<li><b>' + message.user + ':</b> ' + message.message + '</li>');
        };

        return self;
    }
}


