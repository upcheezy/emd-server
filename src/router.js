const express = require('express');
const EmdService = require('./service');

const EmdRouter = express.Router();
const bodyParser = express.json();

EmdRouter
    .route('/counties')
    .get((req, res, next) => {
        EmdService.getAllCountyNames(req.app.get('db'))
            .then(res.json({ user: 'tobi' }))
    })