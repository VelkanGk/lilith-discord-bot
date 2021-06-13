module.exports.execute = (msg, args) => {
    try {
        var error = [];
        var response = [];
        var type = args[0];
        if(['min','max'].indexOf(type) < 0){
            // Get current prefix for error msg
            let prefix = config.prefix;
            util.print(msg,'',"You are using it wrong...Try this way:\n"+prefix+"min <Pool> [Mods]\n"+prefix+"min 20,20 +5\n"+prefix+"max 6,12,8 +2-4",'red');
            return;
        }
        args.splice(0,1);

        //format command
        args = args.join("").replace(/\s/g,"");
        args = args.replace(/\+/g," +");
        args = args.replace(/\-/g," -");
        args = args.split(" ");  

        //Get the dice pool to roll
        let dicePool = args[0].split(",");

        //prepare modifiers
        args.splice(0,1);
        let modifiers = args;

        //declare roll variables
        let rolls = [];
        var result = "";
        let dices = [];
        
        //Roll each dice in the pool
        for(let i = 0; i < dicePool.length; i++ ){
            let r = getRandomInt(1,Number(dicePool[i]));
            rolls.push(r);
            dices.push("d"+dicePool[i]+":"+r);
            if(result == ""){ result = r; }
            //pick the highest roll
            switch(type){
                case 'max': if(r > result) { result = r; } break;
                case 'min': if(r < result) { result = r; } break;
            }
            
        }

        let total = result;
        //apply each modifier to the highest roll
        for(let i = 0; i < modifiers.length; i++ ){
            total += Number(modifiers[i]);
        }

        let mods = modifiers.join(" ").replace(/\s+/g,"");
        //Final response
        response.push(`<@${msg.author.id}> rolled [${result} ${mods}]: **${total}**\n Results [ ${dices.join(', ')} ]`);

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
    name: 'minmax',
    description: 'Rolls any set of dice and pick the highest or lowest number',
    usage: 'Rolls ANY dice in format [x,y,z i,j,k...] X, Y and Z are the dice type (2,4,6,8,10,20,100... etc.) and I, J and K are the modifiers for the total roll. \nExamples:\n$min 6,4,8\n$min 20,20 +2\n$max 4,6 -1+2'
}