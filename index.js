const VERSION = "3.10.0";

const {Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField,Permissions} = require(`discord.js`);

//REQUIRED ''IMPORTS''
global.util = require('./utilities/util.js');               //My useful utility library
global.Discord = require('discord.js');                     //Required discord api
global.fs = require('fs');                                  //File System handler


//Main Instance of the bot, call this for everything
global.bot = new Client({intents:[GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

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
const trackerPath = './config/';
const nicknamesJSON = 'nicknames.json';
const configJSON = 'config.json';
var files = [nicknamesJSON, configJSON];

//Check directory and required files existance
util.fileCheck(trackerPath,files);

//Load global config
global.config = require(trackerPath+configJSON);
global.nickTracker = require(trackerPath+nicknamesJSON);


//discord bot authentication
bot.login(config.token)
    .then(console.log("Bot Login"))
    .catch(error => console.log("The provided token is invalid. Please check your config file in config/config.json for a valid bot token.\n" + error))

bot.on('ready', () => {
    console.log('This bot is now active\nv'+VERSION);
});



// ################ EVENTS ######################

// Each message
bot.on('messageCreate', msg => {

    util.checkGuild(config,msg);

    let guildID = msg.guild.id
    let prefix = config["guild"][guildID]['prefix'];

    //Exit when incoming message does not start with specifed prefix or is sent by the bot
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    //Remove Prefix and create Array with each of the arguments
    let cmdString = msg.content.substring(prefix.length);
    let args = cmdString.split(/ +/);

    let command;

    //Check if is a dice cmd
    if(cmdString.match(/^\d+/) || cmdString.match(/^[dD]/)){
        command = 'roll';
    }else if(cmdString.match(/^min/) || cmdString.match(/^max/)){
        command = 'minmax';
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
        }else {
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


