const express = require('express');
const EmdService = require('./service');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const EmdRouter = express.Router();
const bodyParser = express.json();

EmdRouter
    .route('/counties')
    .get((req, res, next) => {
        EmdService.getAllCountyNames(req.app.get('db'))
            .then(counties => {
                res.json(counties)
            })
    })

EmdRouter
    .route('/grid')
    .get((req, res, next) => {
        EmdService.getAllGrids(req.app.get('db'))
            .then(grid => {
                res.json(grid)
            })
    })


EmdRouter
    .route('/draw')
    .post(bodyParser, (req, res, next) => {
        // console.log(req.body)
        // destructuring below
        const {
            coords,
            geomtype
        } = req.body
        EmdService.getIntersects(
                req.app.get('db'),
                geomtype,
                coords
            )
            .then(data => {
                res
                    .status(201)
                    .json(data)
            })
            .catch(next)
    })

EmdRouter
    .route('/countyselect')
    .post(bodyParser, (req, res, next) => {
        const {
            countyname
        } = req.body
        EmdService.getCounties(
                req.app.get('db'),
                countyname
            )
            .then(data => {
                res
                    .status(201)
                    .json(data)
            })
            .catch(next)
    })

module.exports = EmdRouter;