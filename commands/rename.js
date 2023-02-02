const filePath = './config/';
const fileName = 'nicknames.json';
const file = filePath + fileName;

module.exports.execute = (msg, args) => {

    if (!util.checkAuth(msg)){ 
        util.print(msg,'',`Sorry <@${msg.author.id}>! I can't let you use this command`,'red');
        return; 
    }

    //Drop first argument
    args.splice(0,1);

    //Get channel name
    voiceName = args.join(" ");

    //Get channel properties
    channel = bot.channels.cache.filter((channel)=>{ return channel.name === voiceName && channel.type === 'voice'; });
    
    //if channel exists
    if(channel.size == 0 || channel.size != 1){
        //error message if channel not found
        util.print(msg,'',"Sorry!\nI couldn't find a voice channel named '"+voiceName+"'",'red');
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
                                util.print(msg,'',"I'm not allowed to change "+member.user.username+"'s nickname",'red'); 
                            }else{
                              util.print(msg,'',"Something happened!\nI couldn't update "+member.user.username+"'s nickname\nError code: "+err.code,'red');  
                            }
                        }
                    );
                }
            }
        }
        
    }

}

module.exports.experimental = false;
module.exports.help = {
    name: 'rename',
    description: 'Updates automatically the Nicknames of a voice channel from the tracker file',
    usage: ".rename <Voice_Channel_Name>"
}