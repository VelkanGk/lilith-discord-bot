const filePath = './config/';
const fileName = 'nicknameTracker.json';
const file = filePath + fileName;

module.exports.execute = (msg, args) => {
    util.print(msg,'',"Sorry <@"+msg.author.id+">, I'm the only one who can manage the nickname book.\nWhat am I supposed to do if you leave me without work?\nI don't want to go back to that alley...\n*soft sobbings*...",'red');
}

module.exports.updateNickname = (oldMember, newMember) => {
    if(newMember.voice != null){
        //Load nicknamesTracker File
        var nickJSON = fs.readFileSync(file);
        nickJSON = JSON.parse(nickJSON);
        if (!nickJSON.players) {
            nickJSON.players = {};
            util.saveFile(file,fileName,nickJSON);
        }
        var userID = newMember.user.id;
        if(!nickJSON.players[userID]){
            nickJSON.players[userID] = {
                name: newMember.user.username,
                userid: userID,
                registrations: {}
            }
        }
        if(newMember.voice.channel != null){
            var channelID = newMember.voice.channel.id;
            var currentNickname = nickJSON.players[userID].registrations[channelID];
            var newNickname = newMember.nickname;

            if(newNickname == undefined || newNickname == ''){ return; }

            if(newNickname != currentNickname){
                nickJSON.players[userID].registrations[channelID] = newNickname;
                util.saveFile(file,fileName,nickJSON);
            }
        }else{
            var newUserName = newMember.nickname;

            if(newUserName == undefined || newUserName == ''){ newUserName = newMember.user.username; }

            if(newUserName != nickJSON.players[userID].name){
                nickJSON.players[userID].name = newUserName;
                util.saveFile(file,fileName,nickJSON);
            }
        }
    }
}
module.exports.experimental = false;
module.exports.help = {
    name: 'nickname',
    description: 'Updates automatically the Nickname Tracker File',
    usage: "You simply don't use this command."
}