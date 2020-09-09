# vgk-discord-bot
This discord bot can keep track of players custom nicknames per channel in a server and allows you to roll many dices with modifiers. This code was based on [pap-discordbot](https://github.com/LilithTheSuccubus/pap-discordbot) by [LilithTheSuccubus](https://github.com/LilithTheSuccubus) under her [MIT Licence](https://github.com/LilithTheSuccubus/pap-discordbot/blob/master/LICENSE)


## Installation
1. Create a cloud server (heroku, aws, etc.)
2. Install node.js in cloud server
3. Clone repository to cloud server
4. Run the node app in cloud server
5. Create a new app in Discord DEV and invite it to your channel
6. ENJOY!!!

<b> For more details about installation, please check [WIKI > Installation](). This bot is currently intended to be used by people who have a basic understanding of how to setup a discord bot and handle node.js. </b>
    
## Features:
- Keep track of specific nicknames for users in certain channel
- Roll any dice combination
- Set manually (command line) nicknames for users.
- Use Discord interface to change the nicknames and the bot will keep track of these changes (no command line needed).
- On Channel delete or user removal, the bot will automatically clean up the registries. So don't worry about it.
- Has a super nice personality with fancy messages!

## Capability Clarification
The bot currently is not able to change the nickname of the server owner*.
This is due to limitations provided by the permission system of Discord, as the server owner will always have the highest permission.
This can be circumvented by transfering ownership of the Discord Server to another secondary account, so the server owner can have his regular account be manipulated by the bot.
You can't transfer the server ownership to a bot.

<b>Never transfer ownership of Discord Server to an unrecognized account, thirt parties or someone you don't trust .</b>
