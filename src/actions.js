var config = require('./config.json');
const { Attachment } = require('discord.js');
var DB = require('./models/models');
const fs = require('fs');

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function getUser(id, callback) {
    DB.User.findOne({ discordID: id }).exec(function(err, user) {
        return callback(user)
    })
}

function hi(msg) {
    return msg.reply("Hey there :)");
}

function subaru(msg) {
    return msg.reply("Let me tell you something about the reliability of a Subaru automobile now the thing about Subarus is if you live in America okay friends if you live in America and you're looking to buy a Subaru and you're worried about your carbon footprint let me tell you about Subaru and there's zero landfill construction facility in what you would otherwise consider a flyover state is a state that they build all of the Subarus that are for sale in America and a zero landfill waste disposal facility if you were looking for a turbocharged four-cylinder horizontally-opposed boxer engine that will get you through the roughest terrains why that's that's a Subaru you could talk about jeeps you could talk about all kinds of other vehicles but the answer at the end of the day the thing that is going to get you through the roughest off-road conditions the thing that is going to get you through every yeah absolutely is the super the think it is gonna get you through the the toughest of terrain conditions the thing that is gonna get you through even just light snow as you're as you're on your typical way home your commute home from work why it's a Subaru a Subaru is gonna get you everywhere you need to go at a price performance ratio that can't be beat okay friends so Subaru is the way to go.");
}

function lootcheck(msg) {
    getUser(msg.author.id, (dbUser) => {
        return msg.reply("You have " + dbUser.lootboxes)
    })
}

function lootgive(msg) {
    //admin
    var userlist = msg.mentions.users;
    userlist.forEach(function(user) {
        getUser(user.id, (dbUser) => {
            if (!dbUser) {
                msg.reply("I haven't met " + user + " yet :(")
            } else {
                dbUser.lootboxes += 1;
                dbUser.save()
                msg.reply("Giving a lootbox to " + user)
            }
        })
    });
    return
}

function lootopen(msg) {
    getUser(msg.author.id, (dbUser) => {
        if (dbUser.lootboxes === 0) {
            msg.reply("You have none :(")
        } else {
            // dbUser.lootboxes -= 1;
            dbUser.save()
            fs.readdir("./src/assets/lootboxes/", function(err, items) {
                let rIndex = getRandomInt(items.length)
                let rItem = items[rIndex]
                let rExt = rItem.split('.').pop()
                const buffer = fs.readFileSync('./src/assets/lootboxes/' + items[rIndex]);
                const attachment = new Attachment(buffer, 'lootbox.' + rExt);
                msg.reply("Opening Lootbox!! :D!", attachment);
            });
        }
    })
    return
}

function none(msg) {
    return msg.reply('Im not sure what you said....');
}

module.exports = {
    hi: hi,
    subaru: subaru,
    lootcheck: lootcheck,
    lootgive: lootgive,
    lootopen: lootopen,
    none: none
}