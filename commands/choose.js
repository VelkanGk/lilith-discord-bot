module.exports.execute = (msg, args) => {
    let text = ['I choose **[opt]**','I guest **[opt]** is better','I like **[opt]**','pick **[opt]**!','definitely **[opt]**!', 'mmm... **[opt]**!' ]
    args.splice(0,1);
    args = args.join(" ").split("|");
    let r = Math.floor(Math.random() * args.length);
    let i = Math.floor(Math.random() * text.length);
    util.print(msg,'', text[i].replace("[opt]",args[r]));
    
}

module.exports.experimental = false;
module.exports.help = {
    name: 'choose',
    description: 'Choose one from a given set of options',
    usage: "$choose a|b|c"
}