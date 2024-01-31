const { json } = require('body-parser');
var fs = require('fs');

const validateUser = async (userHash) => {
    userHash = new String(userHash);
    const file = await fs.promises.readFile("./data/keys.json");
    const jsonData = JSON.parse(file);
    console.log(typeof userHash);
    console.log(userHash);
    for(let i = 0; i < jsonData.keys.length; i++)  {
        console.log(jsonData.keys[i].userHash);
        console.log(jsonData.keys[i].userHash == userHash);
        if(jsonData.keys[i].userHash == userHash) {
            return jsonData.keys[i];
        }
    }
    throw new Error("No Valid Users with the Provided Key: " + userHash);

} 

module.exports = validateUser;