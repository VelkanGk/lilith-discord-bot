module.exports.execute = (msg, args) => {
    // Get current prefix for error msg
    let prefix = config.prefix;

    // Get dice pool and difficult, default 6
    let pool = Number(args[1]);
    let diff = args[2] != undefined ? Number(args[2]) : 6;

    // Check if pool is a number
    if(!pool){
        util.print(msg,'',"You are using it wrong...Try this way:\n"+prefix+"wod <Pool> [Diff]\n"+prefix+"wod 5",'red');
        return;
    }
    // Check if difficulty is a number
    if(!diff){
        util.print(msg,'',"You are using it wrong...Try this way:\n"+prefix+"wod <Pool> [Diff]\n"+prefix+"wod 5 7",'red');
        return;
    }

    // Roll the dice!
    var roll = [];
    for(let i = 1; i <= pool; i++){
        roll.push( Math.floor(Math.random() * 10) + 1 );
    }
    // Sort ascending order
    roll = roll.sort((a, b) => { return a - b; });
    
    // Evaluate results
    let result = [];
    let succ = 0;
    for(let i = 0; i < roll.length; i++){
        let j = roll[i];
        // If is a success, highlight it
        if(j >= diff){
            roll[i] = "**"+roll[i]+"**"; 
            succ++;
        }
        // Underline 10's and 1's
        if(j == 10 || j == 1){
            roll[i] = "__"+roll[i]+"__"; 
        }
        result.push(roll[i]);
    }

    // Print result
    util.print(msg,'',`<@${msg.author.id}> success: **${succ}** \n Results [ ${roll.join(" , ")} ]`);
}

module.exports.experimental = false;
module.exports.help = {
    name: 'wod',
    description: 'Roll 10-sided dice. Difficult is optional, use 6 as default',
    usage: "$wod <Dice Pool> [Difficult]\n$wod 5 7\n$wod 3"
}