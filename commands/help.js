const { Util } = require("discord.js");

module.exports.execute = (msg, args) => {
    fs.readdir("./commands/", (err, files) => {
        if(err) console.error(err);
        let p = config.prefix;
        let jsfiles = files.filter(f => f.split(".").pop() === "js");
        if(jsfiles.length <= 0) {
            console.log("No commands to load!");
            return;
        }

        let response = [];
        let result = jsfiles.forEach((f, i) => {
            let props = require(`./${f}`);
            response.push("**"+p+props.help.name+"**: "+props.help.description);
        });
        response.push("\nFor **usage** write: "+p+"[cmd] info")
        util.print(msg,'',response.join("\n"),'blue');

    });
}

module.exports.experimental = false;
module.exports.help = {
    name: 'help',
    description: 'Shows all available commands',
    usage: '$help'
}
