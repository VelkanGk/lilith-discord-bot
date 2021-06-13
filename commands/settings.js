const filePath = './config/';
const fileName = 'config.json';
const configFile = filePath + fileName;
let description ="";
description += 'settings prefix [character]';
description += '\nsettings experimental_commands [on/off]';
description += '\nsettings welcome_active [on/off]';
description += '\nsettings welcome_msg Welcome {user} to the server';
description += '\nsettings welcome_channel #chanel_name';
description += '\nsettings current_settings';
description += '\nsettings authorize [role_mention]';
description += '\nsettings unauthorize [role_mention]';
description += '\nsettings clean_auth';

module.exports.execute = (msg, args) => {

    if (!util.checkAuth(msg)){ 
        util.print(msg,'',`Sorry <@${msg.author.id}>! I can't let you use this command`,'red');
        return; 
    }

    let conf = config['guild'][msg.guild.id];
    let p = conf.prefix;
    switch(args[1]){
        case 'prefix':
            if (args[2] == undefined){ args[2] = ''; }
            switch(args[2].length){
                case 1:
                    conf.prefix = args[2];
                    util.saveFile(configFile,fileName,config);
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
            let keys = Object.keys(conf);
            for(let i = 0; i < keys.length; i++){
                var val = conf[keys[i]];
                switch(typeof val){
                    case 'boolean': val = val?'ON':'OFF'; break;
                }
                response += "\n**"+keys[i]+"**: "+val;
            }
            util.print(msg,'',response,'blue');
        break;
        case 'welcome_active':
            if(!conf.welcome) { conf.welcome = {}; }
            if(conf.welcome.active == undefined) { conf.welcome.active = false; }
            
            if(args[2] == undefined){
                util.print(msg,'',"The welcome_active is set to "+(conf.welcome.active?'ON':'OFF'),'blue');
            }else{
                args[2] = args[2].toLowerCase();
                if(['on','off'].indexOf(args[2]) >= 0){
                    conf.welcome.active = args[2] == 'on' ? true : false;
                    util.saveFile(configFile,fileName,config);
                    util.print(msg,'',"I have changed welcome_active to ["+args[2]+"]",'green');
                    global.config = require('.'+configFile);
                }else{
                    util.print(msg,'',"You are using it wrong...\n"+p+"settings welcome_active [on/off]",'red');
                }
            }
        break;
        case 'welcome_msg':
            if(!conf.welcome) { conf.welcome = {}; }
            if(!conf.welcome.msg) { conf.welcome.msg = "Welcome {user}"; }
            if(args[2] == undefined){
                util.print(msg,'',"The welcome_text is set to:\n"+conf.welcome.msg,'blue');
            }else{
                let m = args;
                m.splice(0,2);
                m = m.join(" ");
                conf.welcome.msg = m;
                util.saveFile(configFile,fileName,config);
                util.print(msg,'',"I have changed welcome_msg to:\n"+m,'green');
                global.config = require('.'+configFile);
            }
        break;
        case 'welcome_channel':
            if(!conf.welcome) { conf.welcome = {}; }
            if(!conf.welcome.channel_name) { conf.welcome.channel_name = ""; }
            if(args[2] == undefined){
                //validateChannel & search ChannelID
                channel = msg.guild.channels.cache.filter((channel)=>{ return channel.name === args[2] && channel.type === 'text'; });
                var channelID = "";
                if(channel.size == 0){
                    util.print(msg,'',"There is no channel "+args[2]+". Maybe you made a typo?",'red');
                    return;
                }else if(channel.size != 1){
                    util.print(msg,'',`I have found ${channel.size} channels with the same name  ${args[2]}.\nPlease rename the channels so I can select the correct one.`,'red');
                    return;
                }else{
                    channelID = channel.first().id;
                    util.print(msg,'',"The welcome_channel is set to <#"+channelID+">",'blue');
                }
            }else{
                //validateChannel & search ChannelID
                channel = msg.guild.channels.cache.filter((channel)=>{ return channel.name === args[2] && channel.type === 'text'; });
                var channelID = "";
                if(channel.size == 0){
                    util.print(msg,'',"There is no channel "+args[2]+". Maybe you made a typo?",'red');
                    return;
                }else if(channel.size != 1){
                    util.print(msg,'',`I have found ${channel.size} channels with the same name  ${args[2]}.\nPlease rename the channels so I can select the correct one.`,'red');
                    return;
                }else{
                    channelID = channel.first().id;
                    conf.welcome.channel_name = args[2];
                    util.saveFile(configFile,fileName,config);
                    util.print(msg,'',`I have changed welcome_channel to <#${channelID}>`,'green');
                    global.config = require('.'+configFile);
                }
            }
        break;
        case 'experimental_commands':
            if(args[2] == undefined){
                util.print(msg,'',"The experimental_command is set to "+(conf.experimental_commands?'ON':'OFF'),'blue');
            }else{
                args[2] = args[2].toLowerCase();
                if(['on','off'].indexOf(args[2]) >= 0){
                    conf.experimental_commands = args[2] == 'on' ? true : false;
                    util.saveFile(configFile,fileName,config);
                    util.print(msg,'',`Be careful now!\nI have changed experimental_commands to ${args[2]}`,'green');
                    global.config = require('.'+configFile);
                }else{
                    util.print(msg,'',"You are using it wrong...\n"+p+"settings experimental_commands [on/off]",'red');
                }
            }
        break;
        case 'authorize':
            if(args[2] != undefined && args[2] != ''){
                let roleID = ""; 
                if(args[2].match(/<@&\d+>/)){
                    roleID = args[2].replace(/<@&?/,"").replace(">","");
                }else if (args[2]){
                    util.print(msg,'',`I can't find a role called ${args[2]} in this server.\nMaybe a typo or it wasn't recognized as mention like this <@!${msg.author.id}>`,'red');
                    return;
                }
                let modRole = msg.guild.roles.cache.find(role => role.id === roleID);
                if(modRole){
                    conf.authorized_roles = conf.authorized_roles || [];
                    conf.authorized_roles.push(roleID);
                    util.saveFile(configFile,fileName,config);
                    util.print(msg,'',`Very well, I will listen to ${args[2]} too.`,'green');
                    global.config = require('.'+configFile);
                }else{
                    util.print(msg,'',`I can't find a role called ${args[2]} in this server.\nMaybe a typo or it wasn't recognized as mention like this <@!${msg.author.id}>`,'red');
                }
            }else{
                if(conf.authorized_roles.length > 0){
                    util.print(msg,'',`This are the current authorized roles:\n   - <@&${conf.authorized_roles.join('>\n   - <@&')}>`);
                }else{
                    util.print(msg,"Only the server owner is authorized");
                }
            }
        break;
        case 'unauthorize':
            if(args[2] != undefined && args[2] != ''){
                let roleID = ""; 
                if(args[2].match(/<@&\d+>/)){
                    roleID = args[2].replace(/<@&?/,"").replace(">","");
                }else if (args[2]){
                    util.print(msg,'',`I can't find a role called ${args[2]} in this server.\nMaybe a typo or it wasn't recognized as mention like this <@!${msg.author.id}>`,'red');
                    return;
                }
                let modRole = msg.guild.roles.cache.find(role => role.id === roleID);

                if(-1 < conf.authorized_roles.indexOf(roleID)){
                    conf.authorized_roles.splice(conf.authorized_roles.indexOf(roleID),1);
                    util.saveFile(configFile,fileName,config);
                    util.print(msg,'',`${args[2]} is no longer authorized.`,'green');
                    global.config = require('.'+configFile);
                }else{
                    util.print(msg,'',`"${args[2]}" Is not recorded on my book, maybe a typo?`);
                }
            }else{
                util.print(msg,'',`You need to tell which role you would like me to remove.\nTry this way ${p}settings unauthorize [Role_name]`);
            }
        break;
        case 'clean_auth':
            let roles = conf.authorized_roles;
            let newRoles = [];
            for(let i = 0; i < roles.length; i++){
                let modRole = msg.guild.roles.cache.find(role => role.id === roles[i]);
                if(modRole) newRoles.push(roles[i]);
            }
            conf.authorized_roles = newRoles;
            util.saveFile(configFile,fileName,config);
            util.print(msg,'',`This are the current authorized roles:\n   - <@&${conf.authorized_roles.join('>\n   - <@&')}>`);
            global.config = require('.'+configFile);
            
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