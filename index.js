const VERSION = "4.0.0";

const {Client, GatewayIntentBits, REST, Routes } = require('discord.js');

//REQUIRED ''IMPORTS''
global.util = require('./utilities/util.js');               //My useful utility library
global.Discord = require('discord.js');                     //Required discord api
global.fs = require('fs');                                  //File System handler


//Main Instance of the bot, call this for everything
global.bot = new Client({
    intents:[
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions
    ] 
});


//Code for dynamic command handling
bot.commands = new Discord.Collection();
reg_cmds = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    bot.commands.set(command.help.name, command);
    if(command.help.register){
        reg_cmds.push(command.help);
    }
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
    .catch(error => console.log("The provided token is invalid. Please check your config file in config/config.json for a valid bot token.\n" + error));


bot.on('ready', (c) => {
    console.log(`${c.user.username} is online v${VERSION}`);
    console.log('Registering commands...');

    //Get all guilds_id on which the bot is running
    const Guilds = c.guilds.cache.map(guild => guild.id);

    //Register commands for each guild
    Guilds.forEach(guild => {
        const rest = new REST({ version:'10' }).setToken(config.token);
        (async ()=>{
            try{
                await rest.put(
                    Routes.applicationGuildCommands(c.user.id+"",guild+""),
                    { body: reg_cmds }
                );
                console.log(`Slash commands where registered for ${guild}!`);
        
            }catch(err){
                console.log(reg_cmds);
                console.log(`There was an error ${err}`);
            }
        })();
    });

});

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
        command = 'legacy_roll';
    }else if(cmdString.match(/^vtm/)){
        command = 'legacy_vtm';
    }else{
        return;
    }

    //Exit if the command doesn't exit
    if (!bot.commands.has(command)) return;

    //Executing command
    try {
        bot.commands.get(command).execute(msg, args);
    } catch (error) {
        console.error(error);
        util.print(msg,'ERROR','Invalid Syntax: '+error,'red');
    }
});


//Slash command operations
bot.on('interactionCreate',(interaction) => {

    //is slash command
    if(!interaction.isChatInputCommand() && !interaction.isButton()) return;

    if(interaction.isChatInputCommand()){
        //check if guils exists otherwise creates in config
        util.checkGuild(config,interaction);
        args = {};
    
        //arguments retrieval
        bot.commands.get(interaction.commandName).help.options?.forEach( (op)=>{
            if(interaction.options.get(op.name) != null){
               args[op.name] = interaction.options.get(op.name).value; 
            }
        });
    
        bot.commands.get(interaction.commandName).execute(interaction, args);

    }else if(interaction.isButton()){
        bot.commands.get('soundboard').sounds(interaction);
    }


});



//Welcome a new user
bot.on("guildMemberAdd", (member) => {
    bot.commands.get('welcome').welcome(member);
});


//change user nickname when joining a channel
bot.on('voiceStateUpdate', (oldState, newState) => {
    if(oldState.channelId != newState.channelId){
        bot.commands.get('nickname').renameNickname(oldState, newState);
    }
})

//Saves the new nickname when changed via discord GUI
bot.on("guildMemberUpdate", (oldMember, newMember) => {
    bot.commands.get('nickname').updateNickname(oldMember, newMember);
});

//clean registered users nicknames from the deleted voice channel
bot.on("channelDelete", (channel) => {
    bot.commands.get('nickname').removeChannel(channel);
});

//Clean user nicknames when leaves the guild (server)
bot.on("guildMemberRemove", (member) => {
    bot.commands.get('nickname').removeMember(member);
});