var config = require('./config.json');
var stringSimilarity = require('string-similarity');

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
    if (msg.content.trim().toLowerCase().includes("xenbot")) {
        command(msg)
    } else {
        speech(msg)
    }
}

function speech(message) {
    let user = getRole(message)
    console.log("[" + user.name + "] " + message.content)
    return
}

function match(string, message, callback) {
    let text = message.content.trim().toLowerCase().replace("xenbot", "").trim()
    let sim = stringSimilarity.findBestMatch(text, string);
    console.log("Comparing " + text + " to " + string)
    console.log("Best Match: " + sim.bestMatch.target + " " + sim.bestMatch.rating)
    if (sim.bestMatch.rating >= 0.50) {
        return callback(true)
    }

    message.reply('Im not sure what you said....');
    return callback(false)
    // 

}

function command(message) {
    let user = getRole(message)
    let cmd = message.content.trim().toLowerCase()
    console.log("COMMAND ------------------------------")
    console.log("[" + user.name + "] ")
    console.log("-- Admin:", user.admin)
    console.log("-- Bot:", user.bot)
    console.log("-- Command:", cmd)
    console.log("COMMAND ------------------------------")

    match(["hey", "hi"], message, (success => {
        if (success) {
            message.reply('Hey');
        }
    }))







    return
}

module.exports = {
    message: message
}