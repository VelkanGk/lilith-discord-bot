const { MessageEmbed } = require('discord.js');

function print(msg,title,body,color="blue"){
    const embed = new MessageEmbed();
    switch(color){
        case "red": color = "ff0000"; break;
        case "green": color = "00ff00"; break;
        case "blue": color = "0000ff"; break;
    }
    if(title.trim() != ""){ embed.setTitle(title); }
    if(color.trim() != ""){ embed.setColor('0x'+color); }
    if(body.trim() != ""){ embed.setDescription(body); }

    msg.channel.send(embed);

}

function saveFile(filepath,filename,fts) {
    fs.writeFileSync(filepath, JSON.stringify(fts), null, 4);
    console.log("Succesfully saved to [" + filename + "]!")
}


function checkGuild(config,msg){
    if(config['guild'][msg.guild.id] == undefined){
        config['guild'][msg.guild.id] = {
            prefix : config.prefix,
            authorized_roles:[],
            welcome : {
                active : false,
                msg: "",
                channel_name:""
            }
        }
        util.saveFile('./config/config.json','config.json',config);
        global.config = require('../config/config.json');
    }
}

function fileCheck(path,files) {

    var config_prefab = {
        prefix: ".",
        token: "<Enter Bot Token>",
        experimental_commands: false,
        guild:{}
    }


    if (!fs.existsSync(path.replace("./",''))) {
        fs.mkdirSync(path.replace("./",''));
    }

    var emptyJson = "";
    for (var file of files) {
        if (fs.existsSync(path + file)) {
            console.warn(`${file} exists. Moving on.`);
        } else {
            console.warn(`${file} file missing -> Creating a new one`);
            switch (file) {
                case "config.json": emptyJson = JSON.stringify(config_prefab); break;
                default: emptyJson = JSON.stringify({});  break;
            }
            var filePath = path + file;
            //Needs to be syncronized to correcty write to files
            fs.writeFileSync(filePath, emptyJson, function (err, result) {
                if (err) console.log('error', err);
            });
        }
    }
}

function checkAuth(msg){
    let authorized = false;
    let owner = msg.guild.ownerID;
    authorized = owner == msg.author.id;

    let roles = config['guild'][msg.guild.id]['authorized_roles'];
    if(!authorized){
        for(let i = 0; i < roles.length; i++){
            let modRole = msg.guild.roles.cache.find(role => role.id === roles[i]);
            if(modRole){
                if(msg.member.roles.cache.has(modRole.id)) authorized = true;
            }
        }
    }

    return authorized;
}

// add the code below
module.exports = { print,saveFile,fileCheck,checkGuild,checkAuth }