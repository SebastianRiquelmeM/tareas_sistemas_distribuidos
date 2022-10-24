/* IMPORTS */
const { Router } = require('express')
const express = require('express')
const router = express.Router()
const { getBlock } = require('./block.controller')

/* APIS */
/*router.post('/insert',DataInserted)*/

router.get('/blocked', getBlock)


module.exports = router