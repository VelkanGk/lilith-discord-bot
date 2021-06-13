module.exports.execute = (msg, args) => {
    
    if (!util.checkAuth(msg)){ 
        util.print(msg,'',`Sorry <@${msg.author.id}>! I can't let you use this command`,'red');
        return; 
    }

    util.print(msg,'',"You really want me to clear the channel? [yes/no]");
    const collector = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { time: 5000 });
    collector.on('collect', message => {
        if (message.content.toLowerCase() == "yes") {
            msg.channel.messages.fetch()
            .then(function(list){
                    msg.channel.bulkDelete(list);
                }, function(err){ util.print(msg,'',`Sorry, I couldn't clear the channel:\n${err}`,'red'); }
            ) 
        } else {
            util.print(msg,'',"Let me know if you need something else.");
        }
    });
	
}

module.exports.experimental = false;
	
module.exports.help = {
	name: 'flush',
	description: 'flush all messages in text channel',
    usage: '!flush '
}