
//VERSION 
const VERSION = "2.0";
const BASE_AUTHOR = "Lilith the Succubus";
const VERSION_AUTHOR = "Velkan Gk";

//REQUIRED ''IMPORTS''
global.util = require('./utilities/util.js');               //My useful utility library
global.Discord = require('discord.js');                     //Required discord api
global.fs = require('fs');                                  //File System handler


//Main Instance of the bot, call this for everything
global.bot = new Discord.Client();

//Code for dynamic command handling
bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    bot.commands.set(command.help.name, command);
}

//Filesystem Handling
const nameTrackerJSON = 'nicknameTracker.json';
const configJSON = 'config.json';
var files = [nameTrackerJSON, configJSON];

const trackerPath = './config/';
const initTracker = { "players": {} }

//Check directory and required files existance
fileCheck();

//Load global config
global.config = require(trackerPath+configJSON);

//Load nickname commands for auto-assignment
const nick = require('./commands/nick.js');
const util = require('./utilities/util.js');


bot.on('ready', () => {
    console.log('This bot is now active\nVersion: ' + VERSION);
});



bot.on('message', msg => {

    //Exit when incoming message does not start with specifed prefix or is sent by the bot
    if (!msg.content.startsWith(config.prefix) || msg.author.bot) return;

    //Remove Prefix and create Array with each of the arguments
    let cmdString = msg.content.substring(config.prefix.length);
    let args = cmdString.split(/ +/);

    let command;

    //Check if is a dice cmd
    if(cmdString.match(/^\d+/) || cmdString.match(/^[dD]/)){
        command = 'roll';
    }else{
        //First argument passed is set to command
        command = args[0];
    }

    //Exit if the command doesn't exit
    if (!bot.commands.has(command)) return;

    //Executing command
    try {
        
        if (msg.content.includes("info")) {
            util.print(msg,command,bot.commands.get(command).help.description+"\n"+bot.commands.get(command).help.usage,'blue');
        }
        else if (msg.content.includes("debug")) {
            bot.commands.get(command).debug(msg, args);
        }
        else {
            if (bot.commands.get(command).experimental && !config.experimental_commands) {
                util.print(msg,'ERROR',"The command you tried to use is experimental.\nThe use may severly break the bot or other features\nTo activate it's use, change \`experimental_commands\` in settings",'red');
            } else {
                bot.commands.get(command).execute(msg, args);
            }
        }
    } catch (error) {
        console.error(error);
        util.print(msg,'ERROR','Invalid Syntax: '+error,'red');
    }
})

//SOME OTHER EVENTS

//When set registered nickname when user joins a voice channel
bot.on('voiceStateUpdate', (oldState, newState) => {
    bot.commands.get('nick').renameNickname(oldState, newState);
})

//clean registered users nicknames from the deleted voice channel
bot.on("channelDelete", (channel) => {
    bot.commands.get('nick').removeChannel(channel);
});

//Clean user nicknames when leaves the guild (server)
bot.on("guildMemberRemove", function(member){
    bot.commands.get('nick').removeMember(member);
});

//Saves the new nickname when changed via discord GUI
bot.on("guildMemberUpdate", function(oldMember, newMember){
    if(newMember.nickname != oldMember.nickname){
        bot.commands.get('nickname').updateNickname(oldMember, newMember);
    }
});

//Welcome a new user
bot.on("guildMemberAdd", function(member){
    bot.commands.get('welcome').welcome(member);
});


//FILE INIT
function fileCheck() {
    var dir = "config"

    var config_prefab = {
        prefix: "!",
        token: "<Enter Bot Token>",
        experimental_commands: false,
        welcome:{
            active:false,
            msg:"Welcome {user}",
            channel_ID:""
        }
    }

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    var emptyJson = "";
    for (var file of files) {
        if (fs.existsSync(trackerPath + file)) {
            console.warn(`${file} exists. Moving on.`);
        }
        else {
            console.warn(`${file} file missing -> Creating a new one`);
            switch (file) {
                case "config.json":
                    emptyJson = JSON.stringify(config_prefab);
                    break;
                default:
                    emptyJson = JSON.stringify(initTracker);
                    break;
            }
            var path = trackerPath + file;
            //Needs to be syncronized to correcty write to files
            fs.writeFileSync(path, emptyJson, function (err, result) {
                if (err) console.log('error', err);
            });
        }
    }
}

bot.login(config.token)
    .then(console.log("Bot Login"))
    .catch(error => console.log("The provided token is invalid. Please check your config file in config/config.json for a valid bot token.\n" + error))