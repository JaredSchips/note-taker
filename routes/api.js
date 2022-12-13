const api = require('express').Router()
const uuid = require('uuid')['v4']
const fs = require('fs')
const { readFromFile, writeToFile, readAndAppend } = require('../helpers/fsUtils')

// GET route for getting the whole db.json
api.get('/notes', (req, res) => {
    readFromFile('./db/db.json').then(db => 
        res.json(JSON.parse(db))
    )
})

// POST route for adding to db.json
api.post('/notes', (req, res) => {
    const body = req.body
    if (!body) {
        return res.status(400).send('Bad Request: body is empty')
    }
    if (typeof body !== 'object') {
        return res.status(400).send('Bad Request: body is not an object')
    }
    if (!body.title) {
        return res.status(400).send('Bad Request: body doesn\'t contain title')
    }
    if (!body.text) {
        return res.status(400).send('Bad Request: body doesn\'t contain text')
    }

    body['id'] = uuid()

    readAndAppend(body, './db/db.json')
    
    res.status(200).json(body)
})

api.delete('/notes/:id', (req, res) => {
    const id = req.params.id
    readFromFile('./db/db.json').then(db => {
        db = JSON.parse(db)

        const dbFiltered = db.filter(note => note.id!==id)
        if (db.length === dbFiltered.length) {
            return res.status(404).send(`Note with ID ${id} was not found`)
        }
        
        writeToFile('./db/db.json', dbFiltered, `\nData deleted from ./db/db.json`)})
})

module.exports = api