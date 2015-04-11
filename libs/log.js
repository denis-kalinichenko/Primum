/**
 * Created by Denis on 2015-04-11.
 */
var winston = require('winston');
var ENV = process.env.NODE_ENV;

function getLogger (module) {
    var path = module.filename.split("/").slice(-2).join("/");

    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                colorize: true,
                level: (ENV == 'development') ? 'debug' : 'error',
                label: path
            })
        ]
    });
}

module.exports = getLogger;