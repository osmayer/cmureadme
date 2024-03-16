var fs = require('fs');

const generateArticlePage = async (articleHash, articleTitle, articleAuthor, articlePictureUrl, articleDate, articleCateogry, articleSummary) => {
    var articleBody, articleTemplate;
    try {
        articleBody = await readFileContents(articleHash);
        articleTemplate = await openArticleTemplate();
    } catch (e) {
        throw new Error("File reading error: " + e);
    }
    console.log(typeof articleTemplate);
    articleTemplate = articleTemplate.replace("{{articleBody}}", articleBody);
    articleTemplate = articleTemplate.replace("{{articleTitle}}", articleTitle);
    articleTemplate = articleTemplate.replace("{{articleAuthor}}", articleAuthor);
    articleTemplate = articleTemplate.replace("{{articleThumbnailUrl}}", articlePictureUrl);
    articleTemplate = articleTemplate.replace("{{articlePublishDate}}", articleDate);
    articleTemplate = articleTemplate.replace("{{articleSummary}}", articleSummary);
    articleTemplate = articleTemplate.replace("{{articleCategory}}", articleCateogry);
    writeArticle(articleHash, articleTemplate);
};

async function readFileContents(articleHash) {
    try {
        var fileName = await getRootFileName(articleHash);

        // Use fs.promises.readFile and await to read the file
        const file = await fs.promises.readFile("./uploads/" + articleHash + "/" + fileName);

        const stringFile = file.toString();
        var resultMatch = stringFile.match(new RegExp(/^[\s\S]*<body[^\>]*>([\s\S]*)<\/body>[\s\S]*$/));

        if (resultMatch && resultMatch.length > 1) {
            console.log(resultMatch[1]);
            return resultMatch[1];
        } else {
            throw new Error("No content found in body tags");
        }
    } catch (err) {
        console.error(err);
        throw new Error("Article Path Malformed Error");
    }
}

async function getRootFileName(articleHash) {
    try {
        // Use await to wait for the readdir operation to complete
        const fileList = await fs.promises.readdir("./uploads/" + articleHash);

        console.log(fileList);

        // Loop through the files
        for (let i = 0; i < fileList.length; i++) {
            console.log(fileList[i]);

            // Check if the file ends with .html
            if (fileList[i].toLowerCase().endsWith(".html")) {
                return fileList[i]; // Return the file name
            }
        }

        throw new Error("No HTML file found");
    } catch (err) {
        console.error(err);
        throw new Error("Article Path Malformed Error");
    }
}

async function openArticleTemplate() {
    try {
        return fs.readFileSync("./templates/generic_article.html").toString();
    } catch (e) {
        throw new Error("Internal Error: " + e);
    }
}


function urlGen(target) {
	return target
									.replace(/\s+/g, '-')             // Replace spaces with hyphens
    							.replace(/[^a-z0-9-_]/gi, '')     // Remove non-alphanumeric characters except hyphens and underscores
    							.toLowerCase()                    // Convert to lowercase
    							.substring(0, 30);                // Limit to 30 characters
}
async function writeArticle(articleTitle, article) {
    try {
        await fs.promises.writeFile("./public/generated_content/articles/" + urlGen(articleTitle) + ".html", article);
        console.log("File updated successfully");
    } catch (err) {
        console.error("Error writing file:", err);
        throw err;
    }
}
module.exports = generateArticlePage;
