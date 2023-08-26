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
            response.push("**/"+props.help.name+"**: "+props.help.description);
        });
        // response.push("\nFor **usage** write: /[cmd] info")
        util.reply(msg,'',response.join("\n"),'blue');

    });
}

module.exports.help = {
    name: 'help',
    register:true,
    description: 'Shows all available commands',
    //usage: '/help'
}