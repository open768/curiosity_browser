<script>
    window["adrum-start-time"] = new Date().getTime();
    (function(config) {
        config.appKey = "<?= cAppSecret::APPD_RUM_APPKEY ?>";
        config.adrumExtUrlHttp = "http://cdn.appdynamics.com";
        config.adrumExtUrlHttps = "https://cdn.appdynamics.com";
        config.beaconUrlHttp = "http://fra-col.eum-appdynamics.com";
        config.beaconUrlHttps = "https://fra-col.eum-appdynamics.com";
        config.useHTTPSAlways = true;
        config.resTiming = {
            "bufSize": 200,
            "clearResTimingOnBeaconSend": true
        };
        config.maxUrlLength = 512;
    })(window["adrum-config"] || (window["adrum-config"] = {}));
</script>
<script src="//cdn.appdynamics.com/adrum/adrum-24.2.0.4431.js"></script>