const api = require('express').Router()
const db = require('../db/db.json')

// GET route for getting the whole db.json
api.get('/notes', (req, res) => {
    res.json(db)
})

module.exports = api