const util = require("../utilities/util");


module.exports.execute = (msg, args) => {
    this.welcome(msg.author);
    
}

module.exports.welcome = (member) => {
    var message = config.welcome.msg;
    message = message.replace(/{user}/g,`<@${member.id}>`);
    let channel = bot.channels.cache.filter((channel)=>{ return channel.id === config.welcome.channel_ID; });
    if(channel == {} ) { return; }
    let msg = { channel: channel.first() }
    util.print(msg,'',message);
}

module.exports.experimental = false;
module.exports.help = {
    name: 'welcome',
    description: 'Give a welcome message to new users.',
    usage: "$welcome \nThis emulates a welcome message, otherwise the command is BOT USE ONLY. To change the message go to settings"
}