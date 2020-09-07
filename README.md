# vgk-discord-bot
This discord bot can keep track of players custom nicknames per channel in a server and allows you to roll many dices with modifiers. This code was based on [pap-discordbot](https://github.com/LilithTheSuccubus/pap-discordbot) by [LilithTheSuccubus](https://github.com/LilithTheSuccubus) under her [MIT Licence](https://github.com/LilithTheSuccubus/pap-discordbot/blob/master/LICENSE)


## Installation
- Create a server, for example on heroku as described in this [video](https://www.youtube.com/watch?v=D5F0zOdiHU8).
- Install node.js on the server. Install instructions for differente operating systems can be found on the official [node.js website](https://nodejs.org/en/download/).
- Clone this repository on the server.
- Then you need to initialize the directory with these commands:
    ```
    > npm init
    > npm install discord.js
    ```
- Then create a new application (aka bot) on the discord application [developer portal](https://discordapp.com/developers/applications).
- Under the 'bot' menu you should find a 'token' - it's normally hidden and should always stay a secret. You'll need that token later.
- After you created the application on the discord developer website, invite it to your server by following [this guide](https://discordjs.guide/preparations/adding-your-bot-to-servers.html#bot-invite-links).
- Configure the bot by copying the file config.example.json in the config directory to config.json also in the config directory and insert the secret token for the bot you created.
- After that you just need to start the application you just configured. On windows use the startserver.bat, on linux just run
    ```
    > node .
    ```
- Your bot should now appear as online in your server.

<b> This bot is currently intended to be used by people who have a basic understanding of how to setup a discord bot and handle node.js. </b>
    
## Commands:
- Register or delete a nickname:
    ```
    !nick register "Nickname" "Channel_Name" <@Target_user>
    !nick delete "Nickname" "Channel_Name" <@Target_user>
    ```
    NB: target_user is a mention to a user in the server. It's optional and requires "Admin" or "Master" role to assign nicknames to other users in the server.

- Roll
    ```
    !2d20+2-1
    !1d20-5,1d20+2
    !roll 1d20
    !roll 3d6,2d10-4
    ```
    NB: Lets you roll N group of dice with N modifiers to total value, also shows you the rolls result separately for your convenience.

- Settings
    ```
    !settings prefix <character>
    !settings current_settings
    !settings experimental_commands
    ```
    NB: Lets you change the prefix used in this bot (you can also change it directly in `config.json`). Requires "Admin" role.

- Flush
    ```
    !flush
    ```
    NB: Clear up to 99 messages from the channel history. Requires "Admin" role.

- Help
    ```
    !help
    ```
    NB: List all commands and a brief description.
    ```
    !<command> info
    ```
    NB: shows you a complete description and usage of the command.

## Capability Clarification
The bot currently is not able to change the nickname of the server owner*.
This is due to limitations provided by the permission system of Discord, as the server owner will always have the highest permission.
This can be circumvented by transfering ownership of the Discord Server to another secondary account, so the server owner can have his regular account be manipulated by the bot.

<b>Never transfer ownership of the Discord Server to the bot, as you are currently unable to retrieve it.</b>
