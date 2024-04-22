"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const http = require("http");
const cfserver_1 = require("./cfserver");
// load the settings.
var appSettingsJson = fs.readFileSync('cfappsettings.json');
const appSettings = JSON.parse(appSettingsJson);
// set ports
const port = process.env.port || appSettings.WebApplicationServerPort;
// create application server.
var appServer = new cfserver_1.ApplicationServer({ appSettings: appSettings });
// http server.
var httpServer1 = http.createServer(async function (req, res) {
    // application server.
    await appServer.processRequestAsync(req, res);
}).listen(port);
