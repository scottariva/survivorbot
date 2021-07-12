// translates a number of string inputs inot their correlating numeric value for the code to handle
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

// return a random member of a list
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

// add a postfix for a number, ie 1st 2nd 3rd
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

// send a random image of a torch being snuffed
function snuffImage()
{
    var snuffNum = Math.floor((Math.random() * 12)  + 1);
    switch(snuffNum)
    {
        case 1:
            return ('https://i.imgur.com/Q0Ikitq.png');
        case 2:
            return ('https://i.imgur.com/3bAsM0w.png');
        case 3:
            return ('https://i.imgur.com/T4YeRX7.png');
        case 4:
            return ('https://i.imgur.com/DSxpTfI.png');
        case 5:
            return ('https://i.imgur.com/oW2p5OH.png');
        case 6:
            return ('https://i.imgur.com/fRJSIGP.png');
        case 7:
            return ('https://i.imgur.com/wSK2fvB.png');
        case 8:
            return ('https://i.imgur.com/SxGJegI.png');
        case 9:
            return ('https://i.imgur.com/3DDQJlx.png');
        case 10:
            return ('https://i.imgur.com/iwkXjIT.png');
        case 11:
            return ('https://i.imgur.com/Ox45j6u.png');
        case 12:
            return ('https://i.imgur.com/eGY1R3H.png');
    }
}

module.exports = {getVariableNumType, randomList, postfix, snuffImage};