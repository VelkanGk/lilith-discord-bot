module.exports.execute = (msg, args) => {
    try {
        var error = [];
        var response = [];
        args = args.join().split(",");

        let guildID = msg.guild.id;

        for (let i = 0; i < args.length; i++) {
            var roll = [];
            let total = 0;
            //Autocomplete dice cmd
            if(args[i].match(/^d/)){ args[i] = "1"+args[i]; }
            args[i]=args[i].replace(/\+/g," +");
            args[i]=args[i].replace(/\-/g," -");
            args[i]=args[i].replace(/\s+/g," ");
            
            //Valitade roll cmd
            if(!args[i].match(/^\d+[dD]\d+([+-]\d)*/)){
                error.push("**ERROR:** Invalid dice notation -> \""+args[i]+"\"");
                continue;
            }
            //Split modifiers
            let m = args[i].split(" ");

            //Get dices to roll
            let d = m[0].split(/[dD]/);
            let diceNumber = d[0];
            let diceType = d[1];


            for(let j = 0; j < diceNumber; j++ ){
                let r = getRandomInt(1,Number(diceType));
                roll.push(r);
                total += r;
            }

            //Apply modifiers to total roll
            let diceRolled = diceNumber+'d'+diceType;
            for(let j = 1; j < m.length; j++){
                total += Number(m[j]);
                diceRolled += m[j];
            }
            
            //Final response
            response.push(`<@${msg.author.id}> rolled [${diceRolled}]: **${total}** \n Results [ ${roll.join(" , ")} ]`);
            
        }
        //Publish response
        util.print(msg,'',response.join("\n"));
    } catch (error) {
        //Whatever error handler :P
        util.print(msg,'',`**ERROR:** \"${error}\"`,'red');
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports.experimental = false;
module.exports.help = {
    name: 'roll',
    description: 'Rolls ANY dice, you can call this command directly [!#d#+m]',
    usage: 'Rolls ANY dice in format [xdy m...] where X is the quantity of dice to roll, Y is the dice type (2,4,6,8,10,20,100... etc.) and M are the modifiers for the total roll. \nExamples:\n$1d20+5-2\n$d100\n$5d4-1\nYou can roll more than a dice group separating them by comas (,)'
}