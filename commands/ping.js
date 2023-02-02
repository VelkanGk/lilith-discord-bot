module.exports.execute = (msg, args) => {
    util.print(msg,'',"pong!",'green');
    console.log(msg.channel.id);
    console.log(msg);
}

module.exports.experimental = false;
module.exports.help = {
    name: 'ping',
    description: 'Answer pong!',
    usage: "$ping"
}