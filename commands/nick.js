const fs = require('fs'); //Filesystem
const { Util } = require('discord.js');
const trackerPath = './config/';
const nameTrackerJSON = 'nicknameTracker.json';
const nameTracker = trackerPath + nameTrackerJSON;

module.exports = {
    execute(msg, args) {
        //If there are more than 4 arguments means that args separate spaces wrongly or is admin assign to other target.
        //In either case, lets check for wrong spacing
        if(args.length > 4){
            var arguments = [];
            for(let i = 2; i < args.length;i++){
                arguments.push(args[i]);
            }
            arguments = arguments.join(" ");
            //assign random substring to separate correctly
            arguments = arguments.replace('" "','"~°|°~"');
            arguments = arguments.replace('" <','"~°|°~<');
            arguments = arguments.split(/~°\|°~/);
            //rearrange args with new separations
            let nargs = [args[0],args[1]];
            for(let i = 0; i < arguments.length; i++){
                nargs.push(arguments[i]);
            }
            args = nargs;
        }

        //Set message sender user as default user
        let userID = msg.author.id;

        //Get current Prefix
        var p = config.prefix;

        //If the target is other player than self
        if(args.length == 5){
            //Check Master or Admin privileges
            let modRole1 = msg.guild.roles.cache.find(role => role.name === "Master");
            let modRole2 = msg.guild.roles.cache.find(role => role.name === "Admin");
            if (!modRole1 && !modRole2) { util.print(msg,'',"I can't find an Master or Admin role in this server.",'red'); return;}
            if (!msg.member.roles.cache.has(modRole1.id) && !msg.member.roles.cache.has(modRole2.id)){ 
                util.print(msg,'',`Sorry <@${msg.author.id}>! I can't let you set nicknames to other players`,'red'); 
                return; 
            }

            //Get the target ID
            if(args[4].match(/<@!\d+>/)){
                let id = args[4].replace(/<@!?/,"").replace(">","");
                if(msg.guild.member(id)){
                    userID = id;
                }else{
                    util.print(msg,'',`I can't find someone called ${args[4]} in this server.\nMaybe a typo or it wasn't recognized as mention like this <@!${msg.author.id}>`,'red');
                    return;
                }
            }else if (args[4]){
                util.print(msg,'',`I can't find someone called ${args[4]} in this server.\nMaybe a typo or it wasn't recognized as mention like this <@!${msg.author.id}>`,'red');
                return;
            }
        }
        
        
        //Complete arguments validation
        if (!args[2] || !args[3]){ 
            util.print(msg,'',`Sorry <@${msg.author.id}> it looks like you have forgotten something. Try this way:\n${p}nick <register|delete> \"<New_nickname>\" \"<Channel_Name>\"`,'red'); 
            return;
        }
        //Nickname and ChannelName validation
        if (!args[2].match((/\".*?\"/g)) || !args[3].match((/\".*?\"/g))){ 
            util.print(msg,'',"Remember to put the nickname and the channel name in quotation marks (\"like this\")",'red'); 
            return;
        }

        //Argument Saving (thanks RikerTuros)
        try {
            var nickName = msg.content.match(/\".*?\"/g)[0].replace(/\"?\"/g, '');
        } catch (err) {
            util.print(msg,'',"Oops! Something went wrong with the nickname...\n"+err,'red');
            return;
        }
        try {
            var channelName = msg.content.match(/\".*?\"/g)[1].replace(/\"?\"/g, '');
        } catch (err) {
            util.print(msg,'',"Oops! Something went wrong with the channel name...\n"+err,'red');
            return;
        }

        //validateChannel & search ChannelID
        channel = msg.guild.channels.cache.filter((channel)=>{ return channel.name === channelName && channel.type === 'voice'; });
        var channelID = "";
        if(channel.size == 0){
            util.print(msg,'',"There is no such channel. Maybe you made a typo?",'red');
            return;
        }else if(channel.size != 1){
            util.print(msg,'',`I have found ${channel.size} channels with the same name.\nPlease rename the channels so I can select the correct one.`,'red');
            return;
        }else{
            channelID = channel.first().id;
        }

        //Load nicknamesTracker File
        var nickJSON = fs.readFileSync(nameTracker);
        nickJSON = JSON.parse(nickJSON);
        if (!nickJSON.players) {
            nickJSON.players = [];
            saveNick(nickJSON);
        }

        otherTarg = false;

        //Case command
        switch (args[1]) {
            case 'register':

                //Checks if player exists, otherwise creates it
                if(!(userID in nickJSON.players)){
                    nickJSON.players[userID] = {
                        name: msg.guild.member(userID).user.username,
                        userid: userID,
                        registrations: {}
                    }
                }
                //Check if channel exists in player, otherwise creates it
                if(!(channelID in nickJSON.players[userID].registrations)){
                    nickJSON.players[userID].registrations[channelID] = "";
                }

                //Assign new nickname
                nickJSON.players[userID].registrations[channelID] = nickName;

                //Save file
                saveNick(nickJSON);

                //Confirmation
                util.print(msg,'',`Excellent!\nI have saved <@${userID}>'s new nickname "${nickName}" to the channel "${channelName}"`,'green');
                checkNicknames(msg,channelID,userID);
                break;
            case 'delete':
                //Checks if the player exists or has nicknames
                if(!(userID in nickJSON.players)){
                    util.print(msg,'',`<@${userID}> don't have a registered nicknames`,'blue');
                    return;
                }
                //Checks if the player has a nickname assigned to the channel
                if(!(channelID in nickJSON.players[userID].registrations)){
                    util.print(msg,'',`<@${userID}> don't have a registered nickname for channel "${channelName}"`,'blue');
                    return;
                }

                //Delete nickname from  channel
                delete nickJSON.players[userID].registrations[channelID];
                
                //Save file
                saveNick(nickJSON);

                //Checks and confirms that the nickname has been removed
                if(!(channelID in nickJSON.players[userID].registrations)){
                    util.print(msg,'',`I have removed <@${userID}>'s nickname "${nickName}" from the channel "${channelName}"`,'green');
                }

                checkNicknames(msg,channelID,userID);

                break;
            case 'test':
                checkNicknames(msg,channelID,userID);
            break;
            default:
                util.print(msg,'',`Sorry <@${msg.author.id}> it looks like you have forgotten something. Try this way:\n${p}nick <register|delete> \"<New_nickname>\" \"<Channel_Name>\"`,'red');
            break;
        }
    },
    renameNickname(oldState,newState){
        //if user has not switched channels
        if (oldState.channelID === newState.channelID) return;
		
		//Load the nickname JSON file
        var nickJSON = fs.readFileSync(nameTracker);
        nickJSON = JSON.parse(nickJSON);
		
        //Check if userid is in players
        if (!(newState.member.user.id in nickJSON.players)) return;
        
        //Retrive nickname
        var nickname = nickJSON.players[newState.member.user.id].registrations[newState.channelID];
        
        //If nickname is empty or doesn't exist, assign the default name
        if(nickname == undefined || nickname == ''){ nickname = nickJSON.players[newState.member.user.id].name; }

        //Due to Discord permissions, no bot is allowed to change a server's owner nickname.
        owner = newState.guild.ownerID == newState.member.user.id;

        //Set new nickname
        if(newState.member.nickname != nickname && !owner){
            newState.member.setNickname(nickname);
        }else if (owner){
            //util.print(newState.msg,'',"Sorry Master, I'm not allowed to change your name.",'red');
        }
    }
};

module.exports.experimental = false;
module.exports.help = {
    name: 'nick',
    description: 'Change your nicknames when in a specific voice channel',
    usage: '$nick <register/delete> "<Nick>" "<Channel Name>"\nRemember to use the quotations (")'
}

function saveNick(fts) {
    fs.writeFileSync(nameTracker, JSON.stringify(fts), null, 4);
    console.log("Succesfully saved to [" + nameTrackerJSON + "]!")
}

function checkNicknames(msg,channelID,userID){
    //get member to check
    var member = msg.guild.members.cache.find(user => user.id === userID);
    //if is in updated voice channel set new nickname
    if(member.voice.channel != null && member.voice.channel.id == channelID){
        var nickJSON = fs.readFileSync(nameTracker);
        nickJSON = JSON.parse(nickJSON);
        var nickname = nickJSON.players[userID].registrations[channelID];
        if(nickname == undefined || nickname == ''){ nickname = nickJSON.players[userID].name; }
        member.setNickname(nickname);
    }
}