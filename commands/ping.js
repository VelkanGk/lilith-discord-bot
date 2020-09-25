module.exports.execute = (msg, args) => {
    util.print(msg,'',"pong!",'green');
}

module.exports.experimental = false;
module.exports.help = {
    name: 'ping',
    description: 'Answer pong!',
    usage: "$ping"
}