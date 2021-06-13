
module.exports.execute = (msg, args) => {
    msg.author.guild = msg.guild;
    this.welcome(msg.author);
    
}

module.exports.welcome = (member) => {
    
    let guildID = member.guild.id;
    var message = config['guild'][guildID].welcome.msg;
    message = message.replace(/{user}/g,`<@${member.id}>`);
    //validateChannel & search ChannelID
    channel = bot.channels.cache.filter((channel)=>{ return channel.name === config['guild'][guildID].welcome.channel_name && channel.type === 'text'; });
    if(channel.size == 0 || channel.size != 1){
        return;
    }else{
        //channelID = channel.first().id;
        let msg = { channel: channel.first() };
        util.print(msg,'',message,'green');
    }
}

module.exports.experimental = false;
module.exports.help = {
    name: 'welcome',
    description: 'Give a welcome message to new users.',
    usage: "$welcome \nThis emulates a welcome message, otherwise the command is BOT USE ONLY. To change the message go to settings"
}