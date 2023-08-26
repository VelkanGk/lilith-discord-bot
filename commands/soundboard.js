const {  ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource,AudioPlayerStatus } = require('@discordjs/voice');
const { resolve } = require('path');

module.exports.execute = (msg, args) => {
    let buttonsFile = require('../soundboard/buttonList.json');

    let row = new ActionRowBuilder();
    let components = [];
    let rowComponents = [];
    let counter = 1;
    for(let i = 0; i < 25 && i < buttonsFile.buttons.length; i++){
        if(counter == 5){
            row.addComponents(rowComponents);
            components.push(row);
            row = new ActionRowBuilder();
            rowComponents = [];
            counter = 0;
        }
        if(buttonsFile.buttons[i].id != ''){
            rowComponents.push(
                new ButtonBuilder()
                    .setCustomId(i+"-"+buttonsFile.buttons[i].id)
                    .setLabel(buttonsFile.buttons[i].label)
                    .setEmoji(buttonsFile.buttons[i].emoji)
                    .setStyle(ButtonStyle[buttonsFile.buttons[i].style]),
            );
        }
        counter++;
    }
    if(rowComponents.length > 0){
        row.addComponents(rowComponents);
        components.push(row);
    }

    const messageObject = {
        content:"",
        components:components
    };
    msg.reply(messageObject);
}

module.exports.sounds = (interaction) => {
    if(!interaction.member.voice.channel){ return interaction.reply({content:"You must be in a voice channel"}); }

    let buttonsFile = require('../soundboard/buttonList.json');
    let id = interaction.customId.split('-');

    switch(id[1]){
        case 'intro':
            let data = buttonsFile.buttons[id[0]];
            playSound(data, interaction);    
            return interaction.reply({content:"Now playing.."});
        break;
        case 'stop':
            global.player.stop();
            global.pausePlayer = false;
            return interaction.reply("Sound stopped!");
        break;
        case 'pause':
            if(global.pausePlayer){
                global.player.unpause();
                global.pausePlayer = false;
            }else{
                pausePlayer();
            }
            return interaction.reply("Sound paused!");
        break;
        default:
            interaction.reply("No action recorded");
    }

}

function pausePlayer(){
    global.player.pause();
    global.pausePlayer = true;
}


function playSound(data, interaction){
    
    global.player = createAudioPlayer();
    global.player.on('error',error => {
        if(subscription){subscription.unsubscribe();}
        if(connection){connection.destroy();} 
        return interaction.reply(`Error: ${error.message} with resource`);
    });

    let absolutePath = resolve('./soundboard/'+data.src);
    let resource = createAudioResource(absolutePath);
    global.player.play(resource);

    let connection = joinVoiceChannel({
        channelId: interaction.member.voice.channel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    let subscription = connection.subscribe(player);
    
    player.addListener("stateChange", (oldOne, newOne) => {
        switch(newOne.status){
            case "idle": 
                //console.log("Finished"); 
                if(subscription){subscription.unsubscribe();}
                if(connection){connection.destroy();} 
            break;
            case "playing": 
                //console.log("Playing song..."); 
            break;
            case "buffering": 
                //console.log("Buffering..."); 
            break;
            default: console.log("Waiting..."); break;
        }
    });

    //setTimeout(() => { player.stop(); }, 20_000);

}


module.exports.help = {
    name: 'soundboard',
    register:true,
    description: 'Answer pong!'
}