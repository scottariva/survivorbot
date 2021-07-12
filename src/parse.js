const GoogleSpreadsheet = require('google-spreadsheet');
const { promisify } = require('util');

async function bigBrother(num)
{
    const numBBSeasons = 5;
    const creds = require('../client_secret.json');
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

async function seasonName(num) {
    const numSurvivorSeasons = 18;
    const creds = require('../client_secret.json');
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
    const creds = require('../client_secret.json');
    const doc = new GoogleSpreadsheet('10w06dXiPwCFNUePN2ALt48w_cWNUc46IKyjTlyA5suI');
    await promisify(doc.useServiceAccountAuth)(creds);
    const info = await promisify(doc.getInfo)();
    const sheet = info.worksheets[sheetNum];
    const rows = await promisify(sheet.getRows)({
        offset:0
    });

    // clarification on duplicate names
    if (name === 'parker')
    {
        return 'did you mean xhockey or Kidfierce?'
    }
    if (name === 'vince' || name === 'vincent')
    {
        return 'did you mean Chock or Lenboy?'
    }

    // manually update gender pronouns
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

module.exports = {bigBrother, seasonName, variableNum};