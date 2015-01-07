 document.addEventListener("deviceready", onDeviceReady, false);

    // device APIs are available
    //
    function onDeviceReady() {
        
        alert(device.model);
        alert(device.cordova);
        alert(device.platform);
        
    }
