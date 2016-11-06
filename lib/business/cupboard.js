var Cupboard = require('../models/cupboard');
var response = require('../common/responses')

module.exports = new class CupboardBusiness {
    constructor() {

    }

    isInUse(login, cupboard) {
        return cupboard.login != undefined &&
            cupboard.login != login;
    }

    isOccupied(cupboard) {
        return cupboard.login != undefined;
    }

    occupy(login, cupboard) {
        cupboard.update({ $set: { login: login } }, (err) => {
            if (err) throw err;
        });
    }

    tryOpen(res, login, cupboard) {
        if (this.isInUse(login, cupboard)) {
            response.occupied(res);
            return;
        } else if (!this.isOccupied(cupboard)) {
            this.occupy(login, cupboard);
        }

        response.open(res);
    }

    open(req, res) {
        Cupboard.findOne({ code: req.params.code }, (err, cupboard) => {
            if (err) throw err;
            if (cupboard) {
                this.tryOpen(res, req.login, cupboard);
            } else {
                response.notFound(res);
            }
        });
    }

    release(req, res) {
        Cupboard.findOne({ code: req.params.code }, (err, cupboard) => {
            if (err) throw err;
            if (cupboard) {

                if (cupboard.login != req.login) {
                    response.unauthorized(res);
                    return;
                }

                cupboard.login = undefined;
                cupboard.save();
                response.release(res);
            } else {
                response.notFound(res);
            }
        });
    }
} 