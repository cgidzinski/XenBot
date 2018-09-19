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

    return callback(false)
}

function matchList(msg, cmd) {
    match(["hey", "hi", "hello", "sup", "konichiwa"], cmd, msg, (success => {
        if (success) {
            return msg.reply("Hey there :)");
        }
    }))

    match(["soob", "subaru", "subi"], cmd, msg, (success => {
        if (success) {
            return msg.reply("Let me tell you something about the reliability of a Subaru automobile now the thing about Subarus is if you live in America okay friends if you live in America and you're looking to buy a Subaru and you're worried about your carbon footprint let me tell you about Subaru and there's zero landfill construction facility in what you would otherwise consider a flyover state is a state that they build all of the Subarus that are for sale in America and a zero landfill waste disposal facility if you were looking for a turbocharged four-cylinder horizontally-opposed boxer engine that will get you through the roughest terrains why that's that's a Subaru you could talk about jeeps you could talk about all kinds of other vehicles but the answer at the end of the day the thing that is going to get you through the roughest off-road conditions the thing that is going to get you through every yeah absolutely is the super the think it is gonna get you through the the toughest of terrain conditions the thing that is gonna get you through even just light snow as you're as you're on your typical way home your commute home from work why it's a Subaru a Subaru is gonna get you everywhere you need to go at a price performance ratio that can't be beat okay friends so Subaru is the way to go.");
        }
    }))
    // msg.reply('Im not sure what you said....');
}

module.exports = {
    message: message
}