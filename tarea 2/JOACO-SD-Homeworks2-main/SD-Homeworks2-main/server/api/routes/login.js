/* IMPORTS */
const { Router } = require('express')
const express = require('express')
const router = express.Router()
const { getUsers } = require('./user.controller')


/* APIS */
/*router.post('/insert',DataInserted)*/
router.post('/users',getUsers)

//router.get('/search', getRedis)


module.exports = router