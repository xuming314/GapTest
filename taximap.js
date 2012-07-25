TaxiMap = {
    createNew:function (bayeux) {
        var self = {};
        self.bayeux = bayeux;
        self.map = null;
        self.markers = {};
        self._postLatlng = $('#postLatlng');
        self._lat=$('#lat');
        self._lng=$('#lng');

        self.onError = function () {
            if (navigator.geolocation) alert("Error: The Geolocation service failed.");
            else alert("Error: Your browser doesn't support geolocation.");
        };
        self._isInitMap=false;
        self.refreshMap = function (position) {
            if (!self._isInitMap)
            {
                self.bayeux.subscribe('/taxi/*', self.refreshMarker, self);
                var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                var mapOptions = {zoom:15, center:latlng, navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}, mapTypeId:google.maps.MapTypeId.ROADMAP};
                self.map = new google.maps.Map(document.getElementById("mapContainer"), mapOptions);
                self._isInitMap=true;
            }
            self.sendLatLng(position.coords.latitude, position.coords.longitude);
        };
        self.refreshMarker = function (message) {
            var latlng = new google.maps.LatLng(message.lat, message.lng);
            if (!self.markers[message.user]) self.markers[message.user] = new google.maps.Marker({ position:latlng, map:self.map, title:message.user });
            self.markers[message.user].setPosition(latlng);
        };
        self.sendLatLng=function (lat, lng) {
            self._lat.val(lat);
            self._lng.val(lng);
            var userName=$('#username').val();
            if (userName=='') return;
            self.bayeux.publish('/taxi/'+self.userName, {user:userName, lat:lat, lng:lng});
        };
        self._postLatlng.submit(function () {
            self._username = $('#username').val();
            self.sendLatLng(self._lat.val(), self._lng.val());
            return false;
        });

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(self.refreshMap, self.onError, {timeout:10000});
            navigator.geolocation.watchPosition(self.refreshMap);
        }
        else self.onError();
        return self;
    }
}
