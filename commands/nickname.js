const filePath = './config/';
const fileName = 'nicknames.json';
const file = filePath + fileName;

module.exports.execute = (msg, args) => {
    util.print(msg,'',"Sorry <@"+msg.author.id+">, I'm the only one who can manage the nickname book.\nWhat am I supposed to do if you leave me without work?\nI don't want to go back to that alley...\n*soft sobbings*...",'red');
}

module.exports.updateNickname = (oldMember, newMember) => {

    let guildID = oldMember.guild.id;
    if(newMember.voice != null){

        //Check if guild exists in file, otherwise creates it
        if (!nickTracker[guildID]) nickTracker[guildID] = {};

        //Check if user exists in file, otherwise creates it
        var userID = newMember.user.id;
        if(!nickTracker[guildID][userID]){
            nickTracker[guildID][userID] = {
                name: newMember.user.username,
                userid: userID,
                registrations: {}
            }
            util.saveFile(file,fileName,nickTracker);
        }

        //check if user is conected in voice channel
        if(newMember.voice.channel != null){
            var channelID = newMember.voice.channel.id;
            var currentNickname = nickTracker[guildID][userID].registrations[channelID];
            var newNickname = newMember.nickname;

            if((newNickname == undefined || newNickname == '') && nickTracker[guildID][userID].registrations[channelID] != undefined){ 
                delete nickTracker[guildID][userID].registrations[channelID];
                util.saveFile(file,fileName,nickTracker);
                return; 
            }

            if(newNickname != currentNickname){
                nickTracker[guildID][userID].registrations[channelID] = newNickname;
                util.saveFile(file,fileName,nickTracker);
            }

        }else{
            var newUserName = newMember.nickname;

            if(newUserName == undefined || newUserName == ''){ newUserName = newMember.user.username; }

            if(newUserName != nickTracker[guildID][userID].name){
                nickTracker[guildID][userID].name = newUserName;
                util.saveFile(file,fileName,nickTracker);
            }
        }
    }
}

module.exports.renameNickname = (oldState,newState) => {
    //if user has not switched channels
    if (oldState.channelID === newState.channelID) return;

    let guildID = newState.guild.id;

    //Check if guild exists in file, otherwise creates it
    if (!nickTracker[guildID]) nickTracker[guildID] = {};

    //Check if user exists in file, otherwise creates it
    var userID = newState.member.user.id;
    if(!nickTracker[guildID][userID]){
        nickTracker[guildID][userID] = {
            name: newState.member.user.username,
            userid: userID,
            registrations: {}
        }
        util.saveFile(file,fileName,nickTracker);
    }
    
    //Check if userid is in players
    if (!(userID in nickTracker[guildID])) return;
    
    //Retrive nickname
    var alias = nickTracker[guildID][userID].registrations[newState.channelID];
    
    //If alias is empty or doesn't exist, assign the default name
    if(alias == undefined || alias == ''){ alias = nickTracker[guildID][userID].name; }

    //Due to Discord permissions, no bot is allowed to change a server's owner nickname.
    owner = newState.guild.ownerID == userID;

    //Set new nickname
    if(newState.member.nickname != alias && !owner){
        newState.member.setNickname(alias).catch(
            (err) => {
                if(err.code == 50013){
                    //util.print(newState.msg,'',"I'm not allowed to change "+member.user.username+"'s nickname",'red'); 
                }else{
                    //util.print(newState.msg,'',"Something happened!\nI couldn't update "+member.user.username+"'s nickname\nError code: "+err.code,'red');  
                }
            }
        );
    }else if (owner){
        //util.print(newState.msg,'',"Sorry Master, I'm not allowed to change your name.",'red');
    }
}

module.exports.removeChannel = (channel) => {

    let guildID = channel.guild.id;

    //Get all registered users
    let users = Object.keys(nickTracker[guildID]);

    //Delete all nicknames from channel
    for(var i = 0; i < users.length; i++){
        delete nickTracker[guildID][users[i]].registrations[channel.id];
    }

    //Save file
    util.saveFile(file,fileName,nickTracker);
}

module.exports.removeMember = (member) => {

    let guildID = member.guild.id;

    //Delete user
    delete nickTracker[guildID][member.id];

    //Save file
    util.saveFile(file,fileName,nickTracker);
}

module.exports.experimental = false;

module.exports.help = {
    name: 'nickname',
    description: 'Updates automatically the Nickname Tracker File',
    usage: "You simply don't use this command."
}