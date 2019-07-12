cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-camera.Camera",
      "file": "plugins/cordova-plugin-camera/www/CameraConstants.js",
      "pluginId": "cordova-plugin-camera",
      "clobbers": [
        "Camera"
      ]
    },
    {
      "id": "cordova-plugin-camera.CameraPopoverOptions",
      "file": "plugins/cordova-plugin-camera/www/CameraPopoverOptions.js",
      "pluginId": "cordova-plugin-camera",
      "clobbers": [
        "CameraPopoverOptions"
      ]
    },
    {
      "id": "cordova-plugin-camera.camera",
      "file": "plugins/cordova-plugin-camera/www/Camera.js",
      "pluginId": "cordova-plugin-camera",
      "clobbers": [
        "navigator.camera"
      ]
    },
    {
      "id": "cordova-plugin-camera.CameraPopoverHandle",
      "file": "plugins/cordova-plugin-camera/www/CameraPopoverHandle.js",
      "pluginId": "cordova-plugin-camera",
      "clobbers": [
        "CameraPopoverHandle"
      ]
    },
    {
      "id": "cordova-plugin-document-scanner.scan",
      "file": "plugins/cordova-plugin-document-scanner/www/scan.js",
      "pluginId": "cordova-plugin-document-scanner",
      "clobbers": [
        "scan"
      ]
    },
    {
      "id": "cordova-plugin-mobile-ocr.rectext",
      "file": "plugins/cordova-plugin-mobile-ocr/www/rectext.js",
      "pluginId": "cordova-plugin-mobile-ocr",
      "clobbers": [
        "textocr"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-whitelist": "1.3.4",
    "cordova-plugin-camera": "4.1.0",
    "cordova-plugin-document-scanner": "4.0.0",
    "cordova-plugin-mobile-ocr": "3.1.1"
  };
});