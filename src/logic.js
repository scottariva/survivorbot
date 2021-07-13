// from a list of players, randomly pair them up
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

// random member of a list of people, utilizing flavour text for the rock draw mechanic of survivor
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

// randomize a variable number of players into a variable number of tribes based on user input
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

// WIP for a simulation of a season of survivor for a number of players similar to https://brantsteele.com/survivor/ 
function simulate(list)
{
    
    var message = '';
    if(list.length > 5 && list.length < 22)
    {
        var members = list.splice(1);
        var len = members.length;

        var tribes = [];

        // sample tribe names
        var tribe1 = 'Tagi';
        var tribe2 = 'Pagong';

        // if 7 players or less, utilize only 1 tribe of this name
        if (len <= 7)
        {
            tribe1 = 'Rattana';
            tribe2 = 'Rattana';
        }

        // add odd members to one tribe, and even members to another
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

        var mod = members.length % 2 === 0 ? 0 : 1; // is cast size even or odd
        var merge = len > 7 ? (((len-mod)/2)+2) : len; // number of players at the merge
        var ftc = 3; // final tribal council will be 3 people unless it meets one of the 2 below conditions

        // if cast is smaller than 14, utilize a final 2 tribal council
        if (len < 14)
        {
            ftc = 2;
        }

        // 1 in 8 chance for final tribal council to be of 2 people, if 14 or more
        var final2 = Math.floor((Math.random() * 8)  + 1);
        if (final2 === 8)
        {
            ftc = 2;
        }

        var jurysize = merge - ftc;
        var votesleft = jurysize;
        var isSwap = true;

        // if the cast is smaller than 11, or 1/10 chance for a cast size of 11 or higher, then there will not be a swap
        var swapRand = Math.floor((Math.random() * 10)  + 1);
        if (swapRand === 10)
        {
            isSwap = false;
        }
        if (len < 11)
        {
            isSwap = false;
        }

        // random swap time based on a defined range
        swapNum = 0;
        if (isSwap === true)
        {
            var xt = Math.floor((Math.random() * (merge - 6))  + 2);
            var swapNum = len - xt;
        }

        for (var i = 0; i < len; i ++)
        {

            // message indicating a Merge, Swap or FTC is occuring
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
            
            // Code to determine how a player left the game with a number of degrees of pseudo-randomness
            var placement = len - i;
            var placementPostifx = helper.postfix(placement);
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

module.exports = {soulmates, rocks, tribeSwap, simulate};