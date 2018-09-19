const Discord = require('discord.js');
var env = require('./env.json');
var config = require('./config.json');
var utilities = require('./utilities.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Started Bot: ${client.user.tag}`);
});

client.on('message', msg => {
    utilities.message(msg)
});

client.login(env.token);