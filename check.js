const axios = require('axios');
const moment = require('moment');
const GITHUB = {
    apiBase: "api.github.com", 
}

checkEvents = async (username) => {
    let url = `https://${GITHUB.apiBase}/users/${username}/events?per_page=300`;
    try{
        const resp = await axios.get(url);
        return resp;
    }
    catch(e){
        console.log(e);
        throw new Error(e);
    }
}

getDates = async (username) => {
    const events = await checkEvents(username);
    return events.data.map(x => x.created_at.substring(0, x.created_at.indexOf('T')));
}

getCommitsInARow = async (username) => {
    const dates = await getDates(username);
    let index;
    let amount = (moment().format('L') === moment(dates[0], 'YYYY-MM-DD').format('L')) ? 1:0;
    for(index = 0; index <= dates.length-1; index++){
        let a = moment(dates[index], 'YYYY-MM-DD');
        let b = moment(dates[index+1], 'YYYY-MM-DD');
        const dif = a.diff(b,'days');
        if(dif > 1)
            return amount;
        else if(dif === 1)
            amount++;
    }
    return amount;
}

main = async () => {
try{
    username = process.env.username || 'manuelf18'  
    console.log(await getCommitsInARow(username));
}
catch(e){
    console.log(e);
}}

main();