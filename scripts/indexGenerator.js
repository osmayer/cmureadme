var fs = require('fs');
const { getArticleList } = require('./articleDB');

const generateIndexPage = async (configList) => {
    var indexPageTemplate = await fs.promises.readFile("./templates/index_real.html"); 
    let articleList = await getArticleList();
    articleList = JSON.parse(articleList);
    indexPageTemplate = indexPageTemplate.toString();
    if(configList.slide1 == "{None}" || searchArticleList(articleList, configList.slide1) == undefined) {
        indexPageTemplate = indexPageTemplate.replace("{{slide1Style}}", "visibility: hidden; height: 0px;");
        indexPageTemplate = indexPageTemplate.replace("{{slide1ButtonStyle}}", "visibility: hidden; height: 0px;");
    } else {
        const article1 = searchArticleList(articleList, configList.slide1) ;
        indexPageTemplate = indexPageTemplate.replace("{{slide1Style}}", "");
        indexPageTemplate = indexPageTemplate.replace("{{slide1ButtonStyle}}", "");
        indexPageTemplate = indexPageTemplate.replace("{{slide1Image}}", article1.articleThubmnailUrl);
        indexPageTemplate = indexPageTemplate.replace("{{slideHeadline1}}", article1.articleTitle);
        indexPageTemplate = indexPageTemplate.replace("{{slide1Link}}", "/generated_content/articles/" + article1.articleHash + ".html");
        indexPageTemplate = indexPageTemplate.replace("{{slideSummary1}}", article1.articleSumary);
    }

    if(configList.slide2 == "{None}" || searchArticleList(articleList, configList.slide2) == undefined) {
        indexPageTemplate = indexPageTemplate.replace("{{slide2Style}}", "visibility: hidden; height: 0px;");
        indexPageTemplate = indexPageTemplate.replace("{{slide2ButtonStyle}}", "visibility: hidden; height: 0px;");
    } else {
        const article1 = searchArticleList(articleList, configList.slide2) ;
        indexPageTemplate = indexPageTemplate.replace("{{slide2Style}}", "");
        indexPageTemplate = indexPageTemplate.replace("{{slide2ButtonStyle}}", "");
        indexPageTemplate = indexPageTemplate.replace("{{slide2Image}}", article1.articleThubmnailUrl);
        indexPageTemplate = indexPageTemplate.replace("{{slideHeadline2}}", article1.articleTitle);
        indexPageTemplate = indexPageTemplate.replace("{{slide2Link}}", "/generated_content/articles/" + article1.articleHash + ".html");
        indexPageTemplate = indexPageTemplate.replace("{{slideSummary2}}", article1.articleSumary);   
    }

    if(configList.slide3 == "{None}" || searchArticleList(articleList, configList.slide3) == undefined) {
        indexPageTemplate = indexPageTemplate.replace("{{slide3Style}}", "visibility: hidden; height: 0px;");
        indexPageTemplate = indexPageTemplate.replace("{{slide3ButtonStyle}}", "visibility: hidden; height: 0px;");
    } else {
        const article1 = searchArticleList(articleList, configList.slide3) ;
        indexPageTemplate = indexPageTemplate.replace("{{slide3Style}}", "");
        indexPageTemplate = indexPageTemplate.replace("{{slide3ButtonStyle}}", "");
        indexPageTemplate = indexPageTemplate.replace("{{slide3Image}}", article1.articleThubmnailUrl);
        indexPageTemplate = indexPageTemplate.replace("{{slideHeadline3}}", article1.articleTitle);
        indexPageTemplate = indexPageTemplate.replace("{{slide3Link}}", "/generated_content/articles/" + article1.articleHash + ".html");
        indexPageTemplate = indexPageTemplate.replace("{{slideSummary3}}", article1.articleSumary);   
    }

    if(configList.sideBar1 == "{None}" || searchArticleList(articleList, configList.sideBar1) == undefined) {
        indexPageTemplate = indexPageTemplate.replace("{{sideBar1Style}}", "visibility: hidden; height: 0px;");
    } else {
        const article1 = searchArticleList(articleList, configList.sideBar1) ;
        indexPageTemplate = indexPageTemplate.replace("{{sideBar1Style}}", "");
        indexPageTemplate = indexPageTemplate.replace("{{sideBarImg1}}", article1.articleThubmnailUrl);
        indexPageTemplate = indexPageTemplate.replace("{{sideHeadline1}}", article1.articleTitle);
        indexPageTemplate = indexPageTemplate.replace("{{sideBarLink1}}", "/generated_content/articles/" + article1.articleHash + ".html");
        indexPageTemplate = indexPageTemplate.replace("{{sideDate1}}", article1.articlePublishDate);   
    }

    if(configList.sideBar2 == "{None}" || searchArticleList(articleList, configList.sideBar2) == undefined) { 
        indexPageTemplate = indexPageTemplate.replace("{{sideBar2Style}}", "visibility: hidden; height: 0px;");
    } else {
        const article1 = searchArticleList(articleList, configList.sideBar2) ;
        indexPageTemplate = indexPageTemplate.replace("{{sideBar2Style}}", "");
        indexPageTemplate = indexPageTemplate.replace("{{sideBarImg2}}", article1.articleThubmnailUrl);
        indexPageTemplate = indexPageTemplate.replace("{{sideHeadline2}}", article1.articleTitle);
        indexPageTemplate = indexPageTemplate.replace("{{sideBarLink2}}", "/generated_content/articles/" + article1.articleHash + ".html");
        indexPageTemplate = indexPageTemplate.replace("{{sideDate2}}", article1.articlePublishDate);   
    }

    if(configList.sideBar3 == "{None}" || searchArticleList(articleList, configList.sideBar3) == undefined) {
        indexPageTemplate = indexPageTemplate.replace("{{sideBar3Style}}", "visibility: hidden; height: 0px;");
    } else {
        const article1 = searchArticleList(articleList, configList.sideBar3);
        indexPageTemplate = indexPageTemplate.replace("{{sideBar3Style}}", "");
        indexPageTemplate = indexPageTemplate.replace("{{sideBarImg3}}", article1.articleThubmnailUrl);
        indexPageTemplate = indexPageTemplate.replace("{{sideHeadline3}}", article1.articleTitle);
        indexPageTemplate = indexPageTemplate.replace("{{sideBarLink3}}", "/generated_content/articles/" + article1.articleHash + ".html");
        indexPageTemplate = indexPageTemplate.replace("{{sideDate3}}", article1.articlePublishDate);   
    }

    if(configList.bottomBar1 == "{None}" || searchArticleList(articleList, configList.bottomBar1) == undefined) {
        indexPageTemplate = indexPageTemplate.replace("{{bottom1Style}}", "visibility: hidden; height: 0px;");
    } else {
        const article1 = searchArticleList(articleList, configList.bottomBar1);
        indexPageTemplate = indexPageTemplate.replace("{{bottom1Style}}", "");
        indexPageTemplate = indexPageTemplate.replace("{{bottomImg1}}", article1.articleThubmnailUrl);
        indexPageTemplate = indexPageTemplate.replace("{{bottomHeadline1}}", article1.articleTitle);
        indexPageTemplate = indexPageTemplate.replace("{{bottom1Link}}", "/generated_content/articles/" + article1.articleHash + ".html");
        indexPageTemplate = indexPageTemplate.replace("{{bottomDate1}}", article1.articlePublishDate);   
        indexPageTemplate = indexPageTemplate.replace("{{bottomCategory1}}", article1.articleCategory);   
        indexPageTemplate = indexPageTemplate.replace("{{bottomSummary1}}", article1.articleSumary);   

    }

    if(configList.bottomBar2 == "{None}" || searchArticleList(articleList, configList.bottomBar2) == undefined) {
        indexPageTemplate = indexPageTemplate.replace("{{bottom2Style}}", "visibility: hidden; height: 0px;");
    } else {
        const article1 = searchArticleList(articleList, configList.bottomBar2);
        indexPageTemplate = indexPageTemplate.replace("{{bottom2Style}}", "");
        indexPageTemplate = indexPageTemplate.replace("{{bottomImg2}}", article1.articleThubmnailUrl);
        indexPageTemplate = indexPageTemplate.replace("{{bottomHeadline2}}", article1.articleTitle);
        indexPageTemplate = indexPageTemplate.replace("{{bottom2Link}}", "/generated_content/articles/" + article1.articleHash + ".html");
        indexPageTemplate = indexPageTemplate.replace("{{bottomDate2}}", article1.articlePublishDate);   
        indexPageTemplate = indexPageTemplate.replace("{{bottomCategory2}}", article1.articleCategory);   
        indexPageTemplate = indexPageTemplate.replace("{{bottomSummary2}}", article1.articleSumary);   
    }

    await fs.promises.writeFile("./public/index.html", indexPageTemplate);
}

function searchArticleList(articleList, articleHash) {
    for(let i = 0; i < articleList.articles.length; i++) {
        console.log(articleList.articles[i]);
        if(articleList.articles[i].articleHash == articleHash) {
            return articleList.articles[i];
        }
    }
    console.log("skill issue:    " + articleHash);
    return undefined;
}
module.exports = { generateIndexPage }