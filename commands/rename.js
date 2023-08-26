const filePath = './config/';
const fileName = 'nicknames.json';
const file = filePath + fileName;

module.exports.execute = (msg, args) => {

    if (!util.checkAuth(msg)){ 
        util.print(msg,'',`Sorry <@${msg.user.id}>! I can't let you use this command`,'red');
        return; 
    }

    //Get channel properties
    channel = bot.channels.cache.filter((channel)=>{ return channel.id == args['voice-channel'] && channel.type === 'voice'; });
    
    //if channel exists
    if(channel.size == 0 || channel.size != 1){
        //error message if channel not found
        util.reply(msg,'',"Sorry!\nI couldn't find a voice channel with id "+args['voice-channel'],'red');
        return;
    }else{
        //get first channel from collection
        channel = channel.first();

        let guildID = msg.guild.id;
        
        //Load nicknamesTracker File
        var nickJSON = fs.readFileSync(file);
        nickJSON = JSON.parse(nickJSON);
        if (!nickJSON[guildID]) {
            nickJSON[guildID] = {};
            util.saveFile(file,fileName,nickJSON);
        }

        //For each member connected in the voice channel
        for (const [memberID, member] of channel.members) {
            
            if(nickJSON[guildID][member.id] == undefined) continue;

            var newNickname = nickJSON[guildID][member.id].registrations[channel.id];
            var currentNickname = member.nickname;
            //set new nickname
            if(newNickname == undefined || newNickname == ''){ 
                continue; 
            } else {
                if(newNickname != currentNickname){
                    member.setNickname(newNickname).catch(
                        (err) => {
                            if(err.code == 50013){
                                util.reply(msg,'',"I'm not allowed to change "+member.user.username+"'s nickname",'red'); 
                            }else{
                              util.reply(msg,'',"Something happened!\nI couldn't update "+member.user.username+"'s nickname\nError code: "+err.code,'red');  
                            }
                        }
                    );
                }
            }
        }

    }
}


module.exports.help = {
    name: 'rename',
    register:true,
    description: 'Updates automatically the Nicknames of a voice channel from the tracker file',
    options:[
        {name:"voice-channel",required:true,description:"Voice channel name", type:global.Discord.ApplicationCommandOptionType.Channel}
    ],
    //usage: "/rename <Voice_Channel_Name>"
}