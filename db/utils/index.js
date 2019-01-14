exports.formatArticle = (articles) => {
  articles.map((article) => {
    article.username = article.created_by;
    delete article.created_by;

  })
}

// let formatDate = function(dateMS) {
//   let date = new Date(dateMS);
//   console.log(date.toString().slice(0, 11));
// };

// formatDate(1547470728277);