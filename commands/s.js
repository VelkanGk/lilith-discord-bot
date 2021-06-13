const use = "#s d[diceType] [value] [mention_member]\n#s d100 1\n#s d100 30, d100 2\n#s d100 45 @Someone";
module.exports.execute = (msg, args) => {

    if (!util.checkAuth(msg)){ 
        msg.author.send(`You don't have the role to use this command, try talking to your server owner.`);
        msg.delete({ timeout: 1 }).catch(console.error);
        return; 
    }
    
    args.splice(0,1);

    cmd = args.join(' ').replace(/\s+/g,' ').split(',');

    let guildID = msg.guild.id;
    for(var i = 0; i < cmd.length; i++){
        let arg = cmd[i].trim().split(' ');
        if(!cmd[i].trim().match(/^d\d+ \d+/)){
            console.log(cmd);
            // msg.author.send(`Wrong usage kiddo. Try this way:\n${use}`);
            // msg.delete({ timeout: 1 }).catch(console.error);
            return;
        }
    
    
        arg[0] = arg[0].replace('d','');
        let diceType = Number(arg[0]);
    
        
        let userID = "general";
    
        //Get the target ID
        if(arg[2] != undefined && arg[2].trim() != ''){
            let member = msg.mentions.members.first();
            if(member.user != undefined){
                userID = member.user.id;
            }else{
                msg.author.send("There was no name mentioned in the command or the member you targeted can't see the channel in which you wrote the command.");
                return;
            }
            
        }
        diceTracker[guildID] = diceTracker[guildID] || {};
        diceTracker[guildID][userID] = diceTracker[guildID][userID] || {};
        diceTracker[guildID][userID][diceType] = diceTracker[guildID][userID][diceType] || [];
        diceTracker[guildID][userID][diceType].push(arg[1]);
    }
    msg.delete({ timeout: 1 }).catch(console.error);

    

}

module.exports.experimental = false;
module.exports.help = {
    name: 's',
    description: 'set roll value for an specific dice and player',
    usage: use
}