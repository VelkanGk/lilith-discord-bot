
//flag representing that dice have been rolled
let rolledFlag = false;

//array of numbers representing hunger dice results
//0-5 values from 1-10
let redDice = [];

//array of numbers representing normal dice results
//0-20 values from 1-10
let normalDice = [];

//the total number of successes in hunger and normal result arrays
let successes = -1;

//flag for possible messy critical (two 10s, at least one on a red die)
let messyFlag = false;

//flag for possible bestial failure (a 1 on a red die)
let bestialFlag = false;

//flag for definite bestial failure (a 1 on a red die and no successes)
let definiteBestialFlag = false;

//the user's hunger level, represents the number of dice out of the pool that are hunger dice
//number between 0-5
let hunger;

//the user's dice pool, the total number of dice to roll
//number between 1-20
let dice;

//Results Icons
let redImages=[],normalImages=[];

module.exports.execute = (msg, args) => {
    try {

        // Check input format
        if(isNaN(args[1])||isNaN(args[2])){
            util.print(msg,'',`**ERROR:** Invalid dice notation -> <@${msg.author.id}> Try this way:\n!vtm [Normal dice pool] [Hunger]\n!vtm 6 2`,'red');
            return;
        }
        
        //Get Dice to roll
        hunger = Number(args[2]);
        dice = Number(args[1]);

        //If user tries to roll a dice pool of 0 or less
        if(dice <= 0 || dice > 20){
            util.print(msg,'',`Ooops! <@${msg.author.id}> your [Normal dice pool] must be a number between 1-20`,'red');
            return;
        }
    
        //If user tries to roll a dice pool with less than 0 hunger dice
        if(hunger < 0 || hunger > 6){
            util.print(msg,'',`Ooops! <@${msg.author.id}> your [Hunger] must be a number between 1-5`,'red');
            return;
        }
        
        //If user tries to roll a dice pool with less than 0 hunger dice
        if(hunger > dice){
            util.print(msg,'',`Ooops! <@${msg.author.id}> your [Hunger] must be less or equal to your [normal dice pool]`,'red');
            return;
        }
    
        //Roll dices and evaluate results
        evaluateResult();

        let respuesta = `<@${msg.author.id}> has rolled Success: **${successes}** `;
        respuesta += "\nNormal: "+normalImages.join(' ');
        respuesta += "\nHunger: "+redImages.join(' ');
        if(messyFlag){ respuesta += "\n*Messy Critical!*"; }
        if(bestialFlag){ respuesta += "\n*Possible Bestial Failure!*"; }
        if(definiteBestialFlag){ respuesta += "\n*Bestial Failure!*"; }
        util.print(msg,'',respuesta,'blue');




        
    } catch (error) {
        //Whatever error handler :P
        util.print(msg,'',`**ERROR:** \"${error}\"`,'red');
    }
}

module.exports.help = {
    name: 'legacy_vtm',
    register:false,
    description: 'Old prefix notation .vtm [DicePool] [Hunger]',
}


//main function, fully rolls dice arrays and calculates successes/image results
function evaluateResult() {
    //Do de roll
    rollCheck();
    //Evaluate the roll
    calculateSuccesses()
}

//rolls a full check- the specified number of hunger dice, and the remaining normal dice left from the pool
function rollCheck() {
    //empty previous results
    redDice = [];
    normalDice = [];

    //roll hunger array, number of hunger dice, or pool if pool smaller than hunger
    let rollHunger = hunger;
    if (dice < hunger)
        rollHunger = dice;
    rollArray(rollHunger, redDice);

    //roll remaining non-hunger dice left in pool
    let remainingDice = dice - hunger;
    rollArray(remainingDice, normalDice);
}
//rolls the specified number of d10s, stores results in the specified array, and sorts in descending value order
function rollArray(diceNum, array) {
    //roll dice
    for (let i = 0; i < diceNum; i++)
        array.push(rollDie())

    //sort descending (highest first)
    array.sort(function (a, b) {
        if (a < b)
            return 1;
        else if (a > b)
            return -1;
        else
            return 0;
    })
}
//Generate random number
function rollDie() {
    //return 9;
    return Math.floor(Math.random() * 10) + 1;
}

//calculates the number of successes (one for each 6 or above, including doubling for crits)
function calculateSuccesses() {
    //reset values for fresh calculation
    successes = 0;
    bestialFlag = redDice.includes(1);

    //find how many crits, if any, the user rolled and begin with that many successes
    let arr = redDice.concat(normalDice)
    let crits = findCritSuccesses(arr)

    //increment successes for each one
    for (let die of arr)
        if (die > 5)
            successes++;
    //remove triple-counted crits
    successes -= crits * 2

    //if no successes and a 1 on any hunger dice, flag for definite bestial fail
    definiteBestialFlag = redDice.includes(1) && successes === 0;

    createImgArrays();

}

/**
 * count the number of successes due to criticals that have come up
 * two 10s counts as 4 successes instead of just two
 * @param arr the array of numbers to check for double 10s
 */
function  findCritSuccesses(arr) {
    //get number of crits aka double 10s
    let crits = Math.floor(countTens(arr) / 2)
    //count 4 successes for every crit
    successes += crits * 4
    //flag for messy crit if any crits and any 10s on hunger dice
    messyFlag = crits > 0 && redDice.includes(10)
    return crits;
}

//counts and returns the number of 10s in the given array of numbers
function countTens(dice) {
    let count = 0;
    for (let die of dice)
        if (die === 10)
            count++;
    return count;
}


//fill arrays of red/black dice result icons based on numbers rolled
function createImgArrays() {
    //clear image arrays
    redImages = [];
    normalImages = [];

    //process list of hunger dice results
    redDice.forEach(die => {
        if (die === 1)
            redImages.push('Ø');
        else if (die < 6)
            redImages.push('O');
        else if (die < 10)
            redImages.push('┼');
        else
            redImages.push('╬');
        
    });

    //process list of normal dice results
    normalDice.forEach(die => {
        if (die < 6)
            normalImages.push('O');
        else if (die < 10)
            normalImages.push('┼');
        else
            normalImages.push('╬');
        
    });
}
