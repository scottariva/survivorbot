Discord Bot for Querying Survivor Statistics via Google Sheets
Created By: Scott Riva

# Usage

Use "node ." to start the bot running
The bot will be online and run until the console is cancelled
You can utilize https://discordapp.com/oauth2/authorize?client_id=579445633929314304&scope=bot&permissions=8 to invite the bot to your desired discord server

# Commands

Help (!help)
- List of commands

Season Info Command (!s[#])
- Inputting !s followed by the corresponding season number will provide brief statistics about that survivor season

Big Brother Info Command (!bb[#])
- Inputting !s followed by the corresponding season number will provide brief statistics about that big brother season

Stats Link (!stats)
- Will link to the source google doc

Rocks (!rocks [names])
- Inputting !rocks followed by a list of people separated by a space will randomly choose a player to be eliminated, for the purposes of a deadlock vote

Simulator (!sim [names])
- Inputting !rocks followed by a list of people separated by a space will randomly simulate a season of survivor based on the inputted individuals

Soulmates (!soulmates [names])
- Inputting !soulmates followed by a list of people separated by a space will randomly pair players together

Tribe Swap (!tribeswap [#] [names])
- Inputting !tribeswap followed by the number of tribes followed by a list of people separated by a spece will place that list of players randomly into that many tribes

Invite (!invite)
- Provide link that will invite the bot to a discord server
