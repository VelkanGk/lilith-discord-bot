module.exports.execute = (msg, args) => {
    try {
        var error = [];
        var response = [];
        arg = args['dice'].split(",");

        for (let i = 0; i < arg.length; i++) {
            var roll = [];
            let total = 0;
            //Autocomplete dice cmd
            if(arg[i].match(/^d/)){ arg[i] = "1"+arg[i]; }
            

            if(args['mods'] != undefined){
                arg[i] += args['mods'];
            }

            arg[i]=arg[i].replace(/\+/g," +");
            arg[i]=arg[i].replace(/\-/g," -");
            arg[i]=arg[i].replace(/\s+/g," ");
            
            //Valitade roll cmd
            if(!arg[i].match(/^\d+[dD]\d+([+-]\d)*/)){
                error.push("**ERROR:** Invalid dice notation -> \""+args[i]+"\"");
                continue;
            }
            //Split modifiers
            let m = arg[i].split(" ");

            //Get dices to roll
            let d = m[0].split(/[dD]/);
            let diceNumber = d[0];
            let diceType = d[1];


            for(let j = 0; j < diceNumber; j++ ){
                let r = getRandomInt(1,Number(diceType));
                let rf = r;
                if(args['condition'] != undefined){
                    let r2 = getRandomInt(1,Number(diceType));
                    switch(args['condition']){
                        case 'adv': rf = r>r2? r : r2; break;
                        case 'dsv': rf = r<r2? r : r2; break;
                    }
                    roll.push(r2);
                }
                roll.push(r);
                total += rf;
            }

            //Apply modifiers to total roll
            let diceRolled = diceNumber+'d'+diceType;
            for(let j = 1; j < m.length; j++){
                total += Number(m[j]);
                diceRolled += m[j];
            }
            
            //Final response
            response.push(`<@${msg.user.id}> rolled [${diceRolled}]: **${total}** \n Results [ ${roll.join(" , ")} ]`);
            
        }
        //Publish response
        util.reply(msg,'',response.join("\n"));
    } catch (error) {
        //Whatever error handler :P
        util.reply(msg,'',`**ERROR:** \"${error}\"`,'red');
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports.help = {
    name: 'roll',
    register:true,
    description: 'Roll ANY dice',
    options:[
        {name:"dice", required:true, description:"roll your dice #d#, Ex. 3d10, d20", type: global.Discord.ApplicationCommandOptionType.String},
        {name:"mods", required:false, description:"modify the final result: +2-3", type: global.Discord.ApplicationCommandOptionType.String},
        {name:"condition", required:false, description:"roll with advantage or disadvantage", type: global.Discord.ApplicationCommandOptionType.String,
            choices: [ {name:'advantage', value:'adv'},{name:'disadvantage', value:'dsv'}]
        },
    ],
    //usage: 'Rolls ANY dice in format [xdy m...] where X is the quantity of dice to roll, Y is the dice type (2,4,6,8,10,20,100... etc.) and M are the modifiers for the total roll. \nExamples:\n$1d20+5-2\n$d100\n$5d4-1\nYou can roll more than a dice group separating them by comas (,)'
}