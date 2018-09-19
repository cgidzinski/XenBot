const Discord = require('discord.js');
var mongoose = require('mongoose');
mongoose.plugin(schema => { schema.options.usePushEach = true });
var env = require('./env.json');
var config = require('./config.json');
var utilities = require('./utilities.js');
const client = new Discord.Client();
if (!mongoose.connect(env.db, { useNewUrlParser: true })) {
    res.send("DB Fail");
}
mongoose.set('debug', true);
client.on('ready', () => {
    console.log(`Started Bot: ${client.user.tag}`);
});

client.on('message', msg => {
    utilities.message(msg)
});

client.login(env.token);