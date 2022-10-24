//const { poolGRPC } = require('../configs/database')
//const axios = require('axios')
//const https = require('https')
const credentials = require('../event.js')
//import credentials from '../event.js';

const getUsers = async (req, res) => {
    const {username, password} = {username:"pepito", password:"membrillo"}  //req.body;
    console.log(username)
    
    
    const credentials = { username, password };
    const success = stream.write(eventType.toBuffer(credentials));     
    if (success) {
        console.log(`message queued (${JSON.stringify(credentials)})`);
    } else {
        console.log('Too many messages in the queue already..');
    }
};
getUsers()

module.exports = {
    getUsers,
};