const { json } = require('body-parser');
var fs = require('fs');

const addArticleToDB = async (articleTitle, articleHash, articlePublishDate, articleSummary, articleThubmnailUrl, articleCategory) => {
    if(articleTitle == undefined || articleHash == undefined || articlePublishDate == undefined || articleThubmnailUrl == undefined || articleCategory == undefined) {
        return;
    }
    var stringDB = await fs.promises.readFile("./data/articles.json"); 
    var jsonDB = JSON.parse(stringDB);
    jsonDB.articles.push({
        "articleTitle": articleTitle,
        "articleHash": articleHash,
        "articlePublishDate": articlePublishDate,
        "articleSumary": articleSummary,
        "articleThubmnailUrl": articleThubmnailUrl,
        "articleCategory": articleCategory
    })
    console.log(jsonDB);
    await fs.promises.writeFile("./data/articles.json", JSON.stringify(jsonDB));
    return jsonDB;
}

const getArticleList = async () => {
    const stringDB = await fs.promises.readFile("./data/articles.json"); 

    return stringDB;
}

module.exports = { addArticleToDB, getArticleList };
