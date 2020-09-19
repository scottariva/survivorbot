const Discord = require('discord.js');
const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');
const bot =  new Discord.Client();
var express = require('express');
var mysql = require('mysql');

const token = fs.readFile('client_token.txt', 'utf8', function(err, data) {
    if (err) throw err;
    console.log(data);
});

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
            seasonName(msg.content.substring(2,4)).then(res => {
                if(res != null)
                {
                    msg.reply(res);
                }
            });
        }

        //reply with overview information about a big brother season
        if(msg.content.substring(0,3).toLowerCase() === "!bb"){
            bigBrother(msg.content.substring(3,5)).then(res => {
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
            var unlucky = rocks(tokenized);
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
            var simd = simulate(tokenized);
            if(simd != null && simd != '')
            {
                msg.channel.send(simd);
            }  
        }

        //generate random pairs from a list of players
        if (firstCommand === '!soulmates' || firstCommand === '!soul' || firstCommand === '!soulmate' || firstCommand === '!pairs')
        {
            var smates = soulmates(tokenized);
            if(smates != null && smates != '')
            {
                msg.channel.send(smates);
            } 
        }

        //random player from a list of names
        if (firstCommand === '!random')
        {
            var rplayer = randomList(tokenized);
            if(rplayer != null && rplayer != '')
            {
                msg.channel.send(rplayer);
            } 
        }

        //snuff a players torch with an appropriate image
        if (firstCommand === '!snuff' || firstCommand === '!tribespoken' || firstCommand === '!smuff')
        {
            var snuffNum = Math.floor((Math.random() * 12)  + 1);
            switch(snuffNum)
            {
                case 1:
                    msg.channel.send('https://i.imgur.com/Q0Ikitq.png');
                    break;
                case 2:
                    msg.channel.send('https://i.imgur.com/3bAsM0w.png');
                    break;
                case 3:
                    msg.channel.send('https://i.imgur.com/T4YeRX7.png');
                    break;
                case 4:
                    msg.channel.send('https://i.imgur.com/DSxpTfI.png');
                    break;
                case 5:
                    msg.channel.send('https://i.imgur.com/oW2p5OH.png');
                    break;
                case 6:
                    msg.channel.send('https://i.imgur.com/fRJSIGP.png');
                    break;
                case 7:
                    msg.channel.send('https://i.imgur.com/wSK2fvB.png');
                    break;
                case 8:
                    msg.channel.send('https://i.imgur.com/SxGJegI.png');
                    break;
                case 9:
                    msg.channel.send('https://i.imgur.com/3DDQJlx.png');
                    break;
                case 10:
                    msg.channel.send('https://i.imgur.com/iwkXjIT.png');
                    break;
                case 11:
                    msg.channel.send('https://i.imgur.com/Ox45j6u.png');
                    break;
                case 12:
                    msg.channel.send('https://i.imgur.com/eGY1R3H.png');
                    break;
            }
            
            
        }

        //swap a list of players into a certain number of tribes
        if (firstCommand === "!tribeswap" || firstCommand === "!swap")
        {
            var swapped = tribeSwap(tokenized);
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
            var callType = getVariableNumType(firstCommand) // determine type of command
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

function simulate(list)
{
    
    var message = '';
    if(list.length > 5 && list.length < 22)
    {
        var members = list.splice(1);
        var len = members.length;

        var tribes = [];

        var tribe1 = 'Tagi';
        var tribe2 = 'Pagong';

        if (len <= 7)
        {
            tribe1 = 'Rattana';
            tribe2 = 'Rattana';
        }

        for (var t = 0; t < len; t ++)
        {
            if(t % 2 === 0)
            {
                tribes.push(tribe1);
            }
            else
            {
                tribes.push(tribe2);
            }
        }

        var mod = members.length % 2 === 0 ? 0 : 1;
        var merge = len > 7 ? (((len-mod)/2)+2) : len;
        var ftc = 3;
        if (len < 14)
        {
            ftc = 2;
        }
        var final2 = Math.floor((Math.random() * 8)  + 1);
        if (final2 === 8)
        {
            ftc = 2;
        }
        var jurysize = merge - ftc;
        var votesleft = jurysize;
        var isSwap = true;
        var swapRand = Math.floor((Math.random() * 10)  + 1);
        if (swapRand === 10)
        {
            isSwap = false;
        }
        if (len < 11)
        {
            isSwap = false;
        }
        swapNum = 0;
        if (isSwap === true)
        {
            var xt = Math.floor((Math.random() * (merge - 6))  + 2);
            var swapNum = len - xt;
        }

        for (var i = 0; i < len; i ++)
        {
            if ((len - i) === merge)
            {
                message = message.concat('\n**Merge**');
            }
            if ((len - i) === ftc)
            {
                message = message.concat('\n**FTC**');
            }
            if ((len - i) === swapNum)
            {
                message = message.concat('\n**Swap**');
            }
            var votes = '';

            if ((len - i) === 3 && ftc === 3) // Final 3, 3rd place
            {
                var vote = Math.floor((Math.random() * Math.floor(jurysize/3))  + 0)
                votes = ` [${vote} vote${vote === 1 ? '' : 's'}]`;
                votesleft -= vote;
            }
            else if((len - i) === 2 && ftc === 3) // Final 3, 2nd place
            {
                if(votesleft % 2 === 0)
                {
                    vote = Math.floor((Math.random() * (((votesleft/2)) - 1)  + (jurysize-votesleft)));
                    votes = ` [${vote} vote${vote === 1 ? '' : 's'}]`;
                    votesleft -= vote;
                }
                else
                {
                    vote = Math.floor((Math.random() * (Math.floor((votesleft/2))-1)) + (jurysize-votesleft));
                    votes = ` [${vote} vote${vote === 1 ? '' : 's'}]`;
                    votesleft -= vote;
                }
            }
            else if((len - i) === 2 && ftc === 2) // Final 2, 2nd place
            {
                if(votesleft % 2 === 0)
                {
                    
                    vote = Math.floor((Math.random() * (jurysize/2))  + 0);
                    votes = ` [${vote} vote${vote === 1 ? '' : 's'}]`;
                    votesleft -= vote;
                }
                else
                {
                    vote = Math.floor((Math.random() * Math.floor((jurysize/2)+1) + 0) + 0);
                    votes = ` [${vote} vote${vote === 1 ? '' : 's'}]`;
                    votesleft -= vote;
                }
            }
            else if((len - i) === 1) // 1st place
            {
                votes = ` [${votesleft} votes]`;
            }

            var randInt = Math.floor((Math.random() * members.length)  + 1);
            
            
            var member = members.splice(randInt-1,1);
            

            var placement = len - i;
            var placementPostifx = postfix(placement);
            var isEvac = Math.floor((Math.random() * 150)  + 1);
            var voteMsg = '';
            if (isEvac === 4 && (len - i) > ftc)
            {
                voteMsg = ' [Evacuated]';
            }
            else if (isEvac === 5 && (len - i) > ftc)
            {
                voteMsg = ' [Quit]'
            }
            else if ((len - i) === 4) // f4 vote
            {
                var f4Vote = Math.floor((Math.random() * 10)  + 1);
                if (f4Vote == 1)
                {
                    voteMsg = ' [2-1-1]';
                }
                else if (f4Vote > 1 && f4Vote <= 7)
                {
                    voteMsg = ' [3-1]';
                }
                else
                {
                    voteMsg = ' [2-2; Firemaking]'
                }
            }
            else if ((len - i) === 3 && ftc === 2) // f3 vote
            {
                voteMsg = ' [1-0]'
            }
            else if ((len - i) <= merge && (len - i) > ftc) 
            // || (len - i) > swapNum) // other merge votes
            {
                var votesToUse = len;

                /*if ((len - i) > swapNum)
                {
                    votesToUse = 0;
                    var thisTribe = tribes[randInt-1];
                    for (var g = 0; g < tribes.length; g++)
                    {
                        if(tribes[g] === thisTribe)
                        {
                            votesToUse += 1;
                        }
                    }
                }*/

                var mergeVote = Math.floor((Math.random() * 20)  + 1);
                if(mergeVote <= 3) // x - x - 1 votes
                {
                    var vote1 = Math.floor((Math.random() * ((votesToUse-i)-2))  + 1);
                    var vote2 = (votesToUse-i-1) - vote1;
                    if(vote1 > vote2)
                    {
                        voteMsg = ` [${vote1}-${vote2}-1]`;
                    }
                    else if (vote2 > vote1)
                    {
                        voteMsg = ` [${vote2}-${vote1}-1]`;
                    }
                    else
                    {
                        voteMsg = ` [${vote1}-${vote2}-1; Revote ${vote1}-${vote2-1}]`;
                    }
                }
                else // x - x vote
                {
                    var vote1 = Math.floor((Math.random() * ((votesToUse-i)-1))  + 1);
                    var vote2 = (votesToUse-i) - vote1;
                    if(vote1 > vote2)
                    {
                        voteMsg = ` [${vote1}-${vote2}]`;
                    }
                    else if (vote2 > vote1)
                    {
                        voteMsg = ` [${vote2}-${vote1}]`;
                    }
                    else
                    {
                        var revoteMethod = Math.floor((Math.random() * 20)  + 1);
                        if (revoteMethod === 1)
                        {
                            voteMsg = ` [${vote1}-${vote2}; Revote ${vote1-1}-${vote2-1}; Concensus]`;
                        }
                        else if (revoteMethod < 5)
                        {
                            voteMsg = ` [${vote1}-${vote2}; Revote ${vote1-1}-${vote2-1}; Rocks]`;
                        }
                        else
                        {
                            voteMsg = ` [${vote1}-${vote2}; Revote ${vote1}-${vote2-2}]`;
                        }
                    }
                }
            }
            /*else if((len - i) > swapNum)
            {
                voteMsg = ` []`;
            }*/
            var theTribe = tribes.splice(randInt-1,1);
            message = message.concat(`\n${placement}${placementPostifx} (${theTribe}) - ${member}${votes}${voteMsg}`);
        }
        return message;  
    }
    else if(list.length > 21)
    {
        return 'Too many players, please enter 20 or less players';
    }
    else
    {
        return 'Too few players, please enter 5 or more players';
    }
}

function postfix(placement)
{
    var pl = `${placement}`;
    if(pl.length !== 1 && pl[0] === '1')
    {
        return 'th';
    }
    if(pl[pl.length-1] === '1')
    {
        return 'st';
    }
    else if(pl[pl.length-1] === '2')
    {
        return 'nd';
    }
    else if(pl[pl.length-1] === '3')
    {
        return 'rd';
    }
    else
    {
        return 'th';
    }
}

function tribeSwap(list)
{

    if (!isNaN(list[1]))
    {
        var numTribes = parseInt(list[1]);
        if (numTribes >= 2 && numTribes <= 5)
        {
            var members = list.splice(2);
            if (members.length > numTribes && members.length % numTribes === 0)
            {
                var message = 'New Tribes:';
                var tribeSize = members.length / numTribes;
                for (var i = 0; i < numTribes; i ++)
                {
                    message = message.concat('\n------------');
                    for (var j = 0; j < tribeSize; j ++)
                    {
                        var randInt = Math.floor((Math.random() * members.length)  + 1);
                        var member = members.splice(randInt-1,1);
                        message = message.concat(`\n${member}`);
                    }
                }
                message = message.concat('\n------------');
                return message;
            }
            else if (members.length > numTribes)
            {
                return 1;
            }
            else
            {
                return 2;
            }    
        }
        else
        {
            return 3;
        }
    }
    return null;
}

function soulmates(list)
{
    var members = list.splice(1);
    if (members.length > 3 && members.length % 2 === 0 && members.length <= 24)
    {
        var message = 'Soul Mates:';
        var loopNum = members.length/2;
        for (var i = 0; i < (loopNum); i ++)
        {
            message = message.concat('\n');
            for (var j = 0; j < 2; j ++)
            {
                var randInt = Math.floor((Math.random() * members.length)  + 1);
                var member = members.splice(randInt-1,1);
                message = message.concat(`${member}${j === 0 ? ' + ' : ''}`);
            }
        }
        return message;
    }
    else if (members.length < 4)
    {
        return 'Not enough players, please enter 4 or more.';
    }
    else if (members.length > 24)
    {
        return 'Too many players, please enter 24 or less.';
    }
    else if (members.length % 2 !== 0)
    {
        return 'Players not divisible by 2.';
    } 
}

function randomList(list)
{
    
    if (list.length > 1)
    {
        var properList = list.splice(1);
        var randInt = Math.floor((Math.random() * properList.length)  + 1);
        var randElement = properList.splice(randInt-1,1);
        return randElement;
    }
    else
    {
        return 'No list entered. Enter a list after the command (separated by spaces) to randomly select one.';
    }
}

function rocks(list)
{
    if (list.length <= 2)
    {
        return null;
    }
    else
    {
        var random = Math.floor((Math.random() * (list.length-1))  +1);
        return `**${list[random]}** has drawn the odd coloured stone.`;
    }
}

async function seasonName(num) {
    const numSurvivorSeasons = 18;
    const creds = require('./client_secret.json');
    const doc = new GoogleSpreadsheet('10w06dXiPwCFNUePN2ALt48w_cWNUc46IKyjTlyA5suI');
    await promisify(doc.useServiceAccountAuth)(creds);
    const info = await promisify(doc.getInfo)();
    if(!isNaN(num))
    {
        if(parseInt(num) <= numSurvivorSeasons && parseInt(num) >= 1)
        {
            const sheet = info.worksheets[parseInt(num) - 1];
            const rows = await promisify(sheet.getRows)({
                offset:0
            });
            return `${rows[0].name} was a ${rows[0].playersize} player season hosted in ${rows[0].date} by ${rows[0].host} and won by ${rows[0].winner} in a ${rows[0].finalvote} vote`;
        }
    }
    return null;
}

async function bigBrother(num)
{
    const numBBSeasons = 5;
    const creds = require('./client_secret.json');
    const doc = new GoogleSpreadsheet('10w06dXiPwCFNUePN2ALt48w_cWNUc46IKyjTlyA5suI');
    await promisify(doc.useServiceAccountAuth)(creds);
    const info = await promisify(doc.getInfo)();
    if(!isNaN(num))
    {
        if(parseInt(num) <= numBBSeasons && parseInt(num) >= 1)
        {
            const sheet = info.worksheets[25];
            const rows = await promisify(sheet.getRows)({
                offset:0
            });
            if(rows.find(x => x.num.toLowerCase() === num) != null){
                return `Big Brother ${rows.find(x => x.num.toLowerCase() === num).season} was hosted by ${rows.find(x => x.num.toLowerCase() === num).host} and won by ${rows.find(x => x.num.toLowerCase() === num).winner}`;
            }
        }
    }
    return null;
}

async function variableNum(name, type){
    var sheetNum = 0;
    if (type === 0) // immunity
    {
        sheetNum = 19;
    }
    else if (type === 1) // placement
    {
        sheetNum = 20;
    }
    else if (type === 2) // votes
    {
        sheetNum = 21;
    }
    else if (type === 3 || type === 4) // idols & player stats
    {
        sheetNum = 23;
    }
    const creds = require('./client_secret.json');
    const doc = new GoogleSpreadsheet('10w06dXiPwCFNUePN2ALt48w_cWNUc46IKyjTlyA5suI');
    await promisify(doc.useServiceAccountAuth)(creds);
    const info = await promisify(doc.getInfo)();
    const sheet = info.worksheets[sheetNum];
    const rows = await promisify(sheet.getRows)({
        offset:0
    });

    if (name === 'parker')
    {
        return 'did you mean xhockey or Kidfierce?'
    }
    if (name === 'vince' || name === 'vincent')
    {
        return 'did you mean Chock or Lenboy?'
    }

    var genderPossesive = 'him';
    var genderPronoun = 'He';
    if (name === 'megan' || name === 'tagggz' || name === 'stephh')
    {
        genderPossesive = 'her';
        genderPronoun = 'She';
    }

    if (type === 0) // immunity
    {
        if(rows.find(x => x.name.toLowerCase() === name) != null){
            return `${rows.find(x => x.name.toLowerCase() === name).name} has won ${rows.find(x => x.name.toLowerCase() === name).total} individual ${rows.find(x => x.name.toLowerCase() === name).total === '1' ? 'immunity' : 'immunities'} with an average of ${rows.find(x => x.name.toLowerCase() === name).avg} per season`;
        }
    }
    if (type === 1) // placement
    {
        if(rows.find(x => x.name.toLowerCase() === name) != null){
            return `${rows.find(x => x.name.toLowerCase() === name).name} has an average placement of ${rows.find(x => x.name.toLowerCase() === name).avg}, with an average placement percentage of ${rows.find(x => x.name.toLowerCase() === name).percentile}`;
        }
    }
    if (type === 2) // votes
    {
        if(rows.find(x => x.name.toLowerCase() === name) != null){
            return `${rows.find(x => x.name.toLowerCase() === name).name} has ${rows.find(x => x.name.toLowerCase() === name).total} total votes against ${genderPossesive}, with an average of ${rows.find(x => x.name.toLowerCase() === name).avg} votes received per season`;
        }
    }
    if (type === 3) // idols
    {
        if(rows.find(x => x._cn6ca.toLowerCase() === name) != null){
            return `${rows.find(x => x._cn6ca.toLowerCase() === name)._cn6ca} has played ${rows.find(x => x._cn6ca.toLowerCase() === name).idols} idol${rows.find(x => x._cn6ca.toLowerCase() === name).idols === '1' ? '' : 's'} correctly and ${rows.find(x => x._cn6ca.toLowerCase() === name)._d6ua4} idol${rows.find(x => x._cn6ca.toLowerCase() === name)._d6ua4 === '1' ? '' : 's'} incorrectly. ${rows.find(x => x._cn6ca.toLowerCase() === name)._d88ul !== '0' ? `${genderPronoun} has been voted out with an idol ${rows.find(x => x._cn6ca.toLowerCase() === name)._d88ul} time${rows.find(x => x._cn6ca.toLowerCase() === name)._d88ul === '1' ? '' : 's'}` : ''}`;
        }
    }
    if (type === 4) // player stats
    {
        if(rows.find(x => x._cn6ca.toLowerCase() === name) != null){
            return `${rows.find(x => x._cn6ca.toLowerCase() === name)._cn6ca} has played ${rows.find(x => x._cn6ca.toLowerCase() === name).participation} season${rows.find(x => x._cn6ca.toLowerCase() === name).participation === '1' ? '' : 's'}. ${genderPronoun} has won ${rows.find(x => x._cn6ca.toLowerCase() === name)._cre1l} of tribe challenges, ${rows.find(x => x._cn6ca.toLowerCase() === name)._ckd7g} of individual challenges, with a ${rows.find(x => x._cn6ca.toLowerCase() === name)._cyevm} winrate in all challenges. ${genderPronoun} has won ${rows.find(x => x._cn6ca.toLowerCase() === name)._d180g} time${(rows.find(x => x._cn6ca.toLowerCase() === name)._d180g === '1' ? '' : 's')}, for a winrate of ${rows.find(x => x._cn6ca.toLowerCase() === name)._d2mkx}. ${genderPronoun} has made FTC ${rows.find(x => x._cn6ca.toLowerCase() === name)._cu76f} time${rows.find(x => x._cn6ca.toLowerCase() === name)._cu764 === '1' ? '' : 's'} or ${rows.find(x => x._cn6ca.toLowerCase() === name)._cvlqs} of the time, with ${rows.find(x => x._cn6ca.toLowerCase() === name)._cssly} total jury vote${rows.find(x => x._cn6ca.toLowerCase() === name)._cssly === '1' ? '' : 's'}. ${genderPronoun} has an average placement percentage of ${rows.find(x => x._cn6ca.toLowerCase() === name).placement}. ${genderPronoun} has recieved ${rows.find(x => x._cn6ca.toLowerCase() === name).voting} votes total, and voted correctly ${rows.find(x => x._cn6ca.toLowerCase() === name)._d415a} of the time. ${genderPronoun} has played ${rows.find(x => x._cn6ca.toLowerCase() === name).idols} idol${rows.find(x => x._cn6ca.toLowerCase() === name).idols === '1' ? '' : 's'} correctly and ${rows.find(x => x._cn6ca.toLowerCase() === name)._d6ua4} idol${rows.find(x => x._cn6ca.toLowerCase() === name)._d6ua4 === '1' ? '' : 's'} incorrectly.${rows.find(x => x._cn6ca.toLowerCase() === name)._d88ul !== '0' ? ` ${genderPronoun} has been voted out with an idol ${rows.find(x => x._cn6ca.toLowerCase() === name)._d88ul} time${rows.find(x => x._cn6ca.toLowerCase() === name)._d88ul === '1' ? '' : 's'}.` : ''} ${genderPronoun} has hosted ${rows.find(x => x._cn6ca.toLowerCase() === name).hosted} seasons.` 
        }
    }

    return null;
}

function getVariableNumType(text)
{
    switch(text)
    {
        case '!immunity':
        case '!immunities':
            return 0;
        case '!placement':
        case '!placements':
            return 1;
        case '!vote':
        case '!votes':
            return 2;
        case '!idol':
        case '!idols':
            return 3;
        case '!player':
        case '!players':
            return 4;
        default:
            return -1;
    }
}