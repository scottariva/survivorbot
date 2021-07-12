const Discord = require('discord.js');
const bot =  new Discord.Client();
const parse = require('./parse.js');
const logic = require('./logic.js');
const helper = require('./helper.js');

// read token from private file to access discord bot credentials
/*const token = fs.readFile('client_token.txt', 'utf8', function(err, data) {
    if (err) throw err;
    console.log(data);
});*/
const token = 'NTc5NDQ1NjMzOTI5MzE0MzA0.XOCQzA.8ixwTR46-qbQepU2ahWDnb2S2wI';

// bot turning on
bot.on('ready', () => {
    console.log('The Bot is turned on!');
})

// bot replying to message
bot.on('message', (msg) => {
    
    
    //tokenize inputted command
    var commandStructure = msg.content.split(" ");

    //remove all tokens that are empty strings
    var tokenized = commandStructure.filter(function(el){
        return el !== '';
    });

    if (tokenized.length >= 1)
    {
        firstCommand = tokenized[0].toLowerCase();

        //bot will always agree with my discord account, and always disagree with other discord accounts, when asked a question
        if ((tokenized[tokenized.length-1] === 'SurvivorBot?' || tokenized[tokenized.length-1] === 'survivorbot?') && tokenized[tokenized.length-2] === 'right')
        {
            if(`${msg.author.username.toLowerCase()}${msg.author.discriminator}` === 'scott4968')
            {
                msg.channel.send('Yes I 100% agree');
            }
            else
            {
                msg.channel.send('Couldn\'t disagree more');
            }
        }

        //command to link page to invite the bot to other servers
        if (firstCommand === '!invite')
        {
            msg.reply('https://discordapp.com/oauth2/authorize?client_id=579445633929314304&scope=bot&permissions=8');
        }

        //reply with overview information about a survivor season
        if(msg.content.substring(0,2).toLowerCase() === "!s"){
            parse.seasonName(msg.content.substring(2,4)).then(res => {
                if(res != null)
                {
                    msg.reply(res);
                }
            });
        }

        //reply with overview information about a big brother season
        if(msg.content.substring(0,3).toLowerCase() === "!bb"){
            parse.bigBrother(msg.content.substring(3,5)).then(res => {
                if(res != null)
                {
                    msg.reply(res);
                }
            });
        }

        //link the google doc for the survivor sheet information
        if (firstCommand === "!stat" || firstCommand === "!stats"){
            msg.reply('https://docs.google.com/spreadsheets/d/10w06dXiPwCFNUePN2ALt48w_cWNUc46IKyjTlyA5suI/edit#gid=1489760416');
        }

        //player randomizer for drawing rocks
        if (firstCommand === "!rocks" || firstCommand === "!rock")
        {
            var unlucky = logic.rocks(tokenized);
            if(unlucky != null)
            {
                msg.channel.send(unlucky);
            }   
            else
            {
                msg.reply(`Input error, use the following format:\n${firstCommand} [players names separated by space]`)
            }
        }

        //simulate a theoretical season of survivor given a list of players
        if (firstCommand === "!sim" || firstCommand === "!simulate")
        {
            var simd = logic.simulate(tokenized);
            if(simd != null && simd != '')
            {
                msg.channel.send(simd);
            }  
        }

        //generate random pairs from a list of players
        if (firstCommand === '!soulmates' || firstCommand === '!soul' || firstCommand === '!soulmate' || firstCommand === '!pairs')
        {
            var smates = logic.soulmates(tokenized);
            if(smates != null && smates != '')
            {
                msg.channel.send(smates);
            } 
        }

        //random player from a list of names
        if (firstCommand === '!random')
        {
            var rplayer = helper.randomList(tokenized);
            if(rplayer != null && rplayer != '')
            {
                msg.channel.send(rplayer);
            } 
        }

        //snuff a players torch with an appropriate image
        if (firstCommand === '!snuff' || firstCommand === '!tribespoken' || firstCommand === '!smuff')
        {            
            msg.channel.send(helper.snuffImage())
        }

        //swap a list of players into a certain number of tribes
        if (firstCommand === "!tribeswap" || firstCommand === "!swap")
        {
            var swapped = logic.tribeSwap(tokenized);
            if (swapped != null && swapped !== 1 && swapped !== 2 && swapped !== 3)
            {
                msg.channel.send(swapped);
            }
            else if (swapped === 3)
            {
                msg.reply('Please enter a number 2 through 5 for # of tribes');
            }
            else if (swapped === 1)
            {
                msg.reply('Number of players not divisible by tribe size');
            }
            else if (swapped === 2)
            {
                msg.reply('Please have more than one member per tribe')
            }
            else
            {
                msg.reply(`Input error, use the following format:\n${firstCommand} [# of tribes] [players names separated by space]`);
            }
        }

        //handle player statistic queries
        if (tokenized.length >= 2) // ensure two commands were passed
        {
            var callType = helper.getVariableNumType(firstCommand) // determine type of command
            if (callType != -1) // ensure command is valid
            {
                variableNum(tokenized[1].toLowerCase(), callType).then(res => {
                    if(res != null)
                    {
                        msg.reply(res);
                    }
                });
                
            }
        }

        //help requests
        if (firstCommand === '!survivor' || firstCommand === '!survivorhelp' || firstCommand === '!survivorbot' || msg.isMentioned(bot.user))
        {
            msg.reply('!rocks [players names separated by space] - rock a player out\n!swap [number of tribes] [players names separated by space] - swap tribes\n!soulmates [players names separated by space] - randomly pair up players (sent to this channel) \n!sim [players names separated by space] - simulate a season of survivor\n!snuff - snuff a players torch\n!ambition - see commands for ambition survivor\n\nFor any questions/problems/suggestions contact Scott#4968')
        }
    }
})

bot.login(token);





