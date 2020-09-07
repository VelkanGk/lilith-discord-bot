const filePath = './config/';
const fileName = 'config.json';
const configFile = filePath + fileName;
const description = 'settings prefix [character]\nsettings experimental_commands [on/off]\nsettings current_settings';

module.exports.execute = (msg, args) => {
    let modRole = msg.guild.roles.cache.find(role => role.name === "Admin");
    if (!modRole) { util.print(msg,'',"I can't find an Admin role in this server.",'red'); return;}
    if (!msg.member.roles.cache.has(modRole.id)){ util.print(msg,'',`Sorry <@${msg.author.id}>! I can't let you use this command`,'red'); return; }

    let p = config.prefix;
    switch(args[1]){
        case 'prefix':
            if (args[2] == undefined){ args[2] = ''; }
            switch(args[2].length){
                case 1:
                    config.prefix = args[2];
                    saveConfig(config);
                    util.print(msg,'',"Done, I have changed the prefix to "+args[2],'green');
                    global.config = require('.'+configFile);
                break;
                case 0:
                    util.print(msg,'',"You are using it wrong...\n"+p+"settings prefix [character]",'red');
                break;
                default:
                    util.print(msg,'',"Oops! the prefix must be a single character",'red');
                break;
            }
        break;
        case 'current_settings':
            var response = "This are your current settings:";
            let keys = Object.keys(config);
            for(let i = 0; i < keys.length; i++){
                var val = config[keys[i]];
                switch(typeof val){
                    case 'boolean': val = val?'ON':'OFF'; break;
                }
                response += "\n**"+keys[i]+"**: "+val;
            }
            util.print(msg,'',response,'blue');
        break;
        case 'experimental_commands':
            if(args[2] == undefined){
                util.print(msg,'',"The experimental_command is set to "+(config.experimental_commands?'ON':'OFF'),'blue');
            }else{
                args[2] = args[2].toLowerCase();
                if(['on','off'].indexOf(args[2]) >= 0){
                    config.experimental_commands = args[2] == 'on' ? true : false;
                    saveConfig(config);
                    util.print(msg,'',"Be careful now!\nI have changed experimental_commands to ["+args[2]+"]",'green');
                    global.config = require('.'+configFile);
                }else{
                    util.print(msg,'',"You are using it wrong...\n"+p+"settings experimental_commands [on/off]",'red');
                }
            }
        break;
        default:
            util.print(msg,'',`Hi <@${msg.author.id}>! What would you like me to do?\n`+description,'blue');
        break;
    }
}


module.exports.experimental = false;
module.exports.help = {
    name: 'settings',
    description: 'Change config variables',
    usage: description
}

function saveConfig(fts) {
    fs.writeFileSync(configFile, JSON.stringify(fts), null, 4);
    console.log("Succesfully saved to [" + fileName + "]!")
}