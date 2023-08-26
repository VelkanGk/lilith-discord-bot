module.exports.execute = (msg, args) => {
    util.reply(msg,'',"pong!",'green');
}

module.exports.help = {
    name: 'ping',
    register:true,
    description: 'Answer pong!',
    options:[
        {name:"arg-1", description:"first argument", type: global.Discord.ApplicationCommandOptionType.Number}
    ],
    //usage: "/ping --arg-1"
}