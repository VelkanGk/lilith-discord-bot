module.exports.execute = (msg, args) => {
    let text = ['I choose **[opt]**','I guest **[opt]** is better','I like **[opt]**','pick **[opt]**!','definitely **[opt]**!', 'mmm... **[opt]**!' ]
    args = args.options.split(",");
    let r = Math.floor(Math.random() * args.length);
    let i = Math.floor(Math.random() * text.length);
    util.reply(msg,'', text[i].replace("[opt]",args[r]));
}

module.exports.help = {
    name: 'choose',
    register:true,
    description: 'Choose one from a given set of options',
    options:[
        {name:"options", required:true, description:"Separate your options with a coma (,) like a,b,c", type: global.Discord.ApplicationCommandOptionType.String}
    ],
    //usage: "/choose --options a|b|c"
}