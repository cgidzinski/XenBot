var config = require('./config.json');
var stringSimilarity = require('string-similarity');
let trigger = "xenbot"

function isAdmin(msg) {
    return config.admin.includes(msg.author.id)
}

function isBot(msg) {
    return msg.author.bot
}

function getRole(message) {
    return { 'admin': isAdmin(message), 'bot': isBot(message), 'name': message.author.username }
}

function message(msg) {
    let strings = msg.content.trim().toLowerCase().split(" ")
    let sim = stringSimilarity.findBestMatch(trigger, strings);
    if (sim.bestMatch.rating >= 0.50) {
        console.log("\n---------------------------------------------")

        console.log("COMMAND MATCHED [" + sim.bestMatch.rating + "]")
        let user = getRole(msg)
        let cmd = strings.join(" ")
        let filteredCmd = strings.filter(word => {
            return word != sim.bestMatch.target
        }).join(" ")
        console.log("-- User: " + user.name)
        console.log("-- Admin:", user.admin)
        console.log("-- Bot:", user.bot)
        console.log("-- Command:", cmd)

        matchList(msg, filteredCmd)
        console.log("---------------------------------------------")
    }
}

function match(strings, cmd, message, callback) {
    let sim = stringSimilarity.findBestMatch(cmd, strings);
    console.log("Comparing [" + cmd + "] to [" + strings + "]")
    console.log("Sim Match Percent: " + sim.bestMatch.target + " @ " + sim.bestMatch.rating)
    let matchedCount = 0
    for (var i = 0; i < strings.length; i++) {
        if (cmd.includes(strings[i])) {
            matchedCount += 1
        }
    }
    let matchedPercent = matchedCount / cmd.split(" ").length
    console.log("Word Match Percent: " + matchedPercent)

    if (sim.bestMatch.rating >= 0.50 || (sim.bestMatch.rating >= 0.30 && matchedPercent >= 0.30)) {
        return callback(true)
    }
    message.reply('Im not sure what you said....');
    return callback(false)
}

function matchList(msg, cmd) {
    match(["hey", "hi", "hello", "sup", "konichiwa"], cmd, msg, (success => {
        if (success) msg.reply("Hey there :)");
    }))
}

module.exports = {
    message: message
}