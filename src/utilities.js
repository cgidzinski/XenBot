var config = require('./config.json');
var actions = require('./actions.js');

var DB = require('./models/models');
var stringSimilarity = require('string-similarity');
let trigger = "xenbot"
let sourceUser = {}

function initUser(message, callback) {
    let discordID = message.author.id
    let username = message.author.username
    DB.User.findOne({ discordID: discordID }).exec(function(err, user) {
        if (!user) {
            var user = new DB.User()
            user.discordID = discordID
            user.username = username
            user.save()
            return callback(user)
        } else {
            user.username = username
            user.save()
            return callback(user)
        }
    })
}






function message(msg) {
    if (msg.author.bot) return
    initUser(msg, (user) => {
        sourceUser = user
        let strings = msg.content.trim().toLowerCase().split(" ")
        let sim = stringSimilarity.findBestMatch(trigger, strings);
        if (sim.bestMatch.rating >= 0.50) {
            console.log("\n---------------------------------------------")
            console.log("COMMAND MATCHED [" + sim.bestMatch.rating + "]")
            let cmd = strings.join(" ")
            let filteredCmd = strings.filter(word => {
                return word != sim.bestMatch.target
            }).join(" ")
            console.log("-- User: " + msg.author.username)
            console.log("-- Command:", cmd)
            matchList(msg, filteredCmd)
            console.log("---------------------------------------------")
        }
    })
}

function purematch(strings, cmd, message, min) {
    let matchedCount = 0
    for (var i = 0; i < strings.length; i++) {
        if (cmd.includes(strings[i])) {
            matchedCount += 1
        }
    }
    if (matchedCount >= min) {
        return true
    } else {
        return false
    }
}

function match(strings, cmd, message, min) {
    let sim = stringSimilarity.findBestMatch(cmd, strings);
    console.log("Comparing [" + cmd + "] to [" + strings + "]")
    console.log("Sim Match Percent: " + sim.bestMatch.target + " @ " + sim.bestMatch.rating)
    let matchedCount = 0
    for (var i = 0; i < strings.length; i++) {
        if (cmd.includes(strings[i])) {
            matchedCount += 1
        }
    }
    if (sim.bestMatch.rating >= 0.70) {
        return true
    }
    return false
}


function isAdmin(msg) {
    return true

    // if (sourceUser.admin === false) {
    //     msg.reply("Must be an admin :(")
    //     return false
    // } else {
    //     return true
    // }
}

function matchList(msg, cmd) {
    if (purematch(["hey", "hi", "hello", "sup", "konichiwa"], cmd, msg, 1)) {
        actions.hi(msg)
    } else if (purematch(["soob", "subaru", "subi"], cmd, msg, 1)) {
        actions.subaru(msg)
    } else if (purematch(["open", "crack", "lootbox"], cmd, msg, 2)) {
        actions.lootopen(msg)
    } else if (purematch(["how", "many", "lootbox"], cmd, msg, 2)) {
        actions.lootcheck(msg)
    } else if (purematch(["give", "to", "lootbox"], cmd, msg, 2)) {
        if (isAdmin(msg)) actions.lootgive(msg)
    } else {
        actions.none(msg)
    }
}


module.exports = {
    message: message
}