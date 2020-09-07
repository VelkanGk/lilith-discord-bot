const Discord = require('discord.js');
const fs = require('fs'); //Filesystem
const filePath = './config/';
const fileName = 'config.json';
const configFile = filePath + fileName;
const bot = new Discord.Client();

module.exports.execute = (msg, args) => {
	var configJSON = fs.readFileSync(configFile);
	configJSON = JSON.parse(configJSON);
	server_owner = configJSON.owner_userid;

	var server = bot.guilds.cache.find(guild => guild.id === configJSON.server_id);
	server.setOwner(guild.members.cache.find(member => member.id === configJSON.owner_userid))
	.then(updated => console.log(`Updated the guild owner to ${updated.owner.displayName}`))
	.catch(console.error);
	
}

module.exports.experimental = true;
	
module.exports.help = {
	name: 'owner',
	description: 'Command to retrieve server ownership',
    usage: 'still working on it usage'
}