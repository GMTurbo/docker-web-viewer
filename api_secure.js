'use strict';

const Bcrypt = require('bcrypt');
const Hapi = require('hapi');
const Basic = require('hapi-auth-basic');
const Inert = require('inert');
const Path = require('path');
const fs = require('fs');
const Log = require('log')
const util = require("util")
const timestamp = require('time-stamp');
const log = new Log('info', fs.createWriteStream('./logs/web_viewer' + timestamp('YYYY-MM-DD-HH:mm:ss') + '.log'));

const imageFolder = './site/images/';

const users = {
    marty: {
        username: 'marty',
        password: '$2a$10$wfa5ASr8iQS7RpAQrp6E4uCVluiSQznIcizMdTf1VDIqJ7AD9V1e6',
        name: 'mr robot',
        id: '0'
    }
};

function get_ip(request) {
    var ip = request.headers['x-forwarded-for'] ||
        request.info.remoteAddress;

    return ip
}

const validate = async (request, username, password, h) => {

    if (username === 'help') {
        return { response: h.redirect('https://www.google.com') };     // custom response
    }

    const user = users[username];
    if (!user) {
        return { credentials: null, isValid: false };
    }

    const isValid = await Bcrypt.compare(password, user.password);
    const credentials = { id: user.id, name: user.name };
    log.info(user.username + " attempted accessing route: " + request.path + " from (" + get_ip(request) + ") succeeded: " + isValid)
    return { isValid, credentials };
};

const main = async () => {

    const server = Hapi.server({
        host: '0.0.0.0',
        port: 8085,
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'site')
            },
            cors: true
        },
    });

    await server.register(require('hapi-auth-basic'));
    await server.register(Inert);

    server.auth.strategy('simple', 'basic', { validate });
    server.auth.default('simple');

    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: '.',
                redirectToSlash: true,
                index: true,
            }
        }
    });

    // Add the route
    server.route({
        method: 'GET',
        path: '/images',
        handler: function (request, h) {

            log.info("received request from " + get_ip(request) + " " + util.inspect(request.info, { showHidden: false, depth: null }));
            var files = []
            return fs.readdirSync(imageFolder).map(function (file) {
                return file
            })
        }
    });

    await server.start();

    return server;
};

main()
    .then((server) => log.info(`Server listening on ${server.info.uri}`))
    .catch((err) => {

        console.error(err);
        process.exit(1);
    });
