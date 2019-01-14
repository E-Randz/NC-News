const fixUserAndDate = (data) => {
  return data.map((item) => {
    item.username = item.created_by;
    item.created_at = new Date(item.created_at);
    delete item.created_by;
    return item;
  });
};

const formatCommentData = (data, articles) => {
  // create lookup for the title of the article
  const articleLookup = articles.reduce((acc, curr) => {
    acc[curr.title] = curr.article_id;
    return acc;
  }, {});
  // process data to fix data and username, then fix article_id
  return fixUserAndDate(data).map((comment) => {
    comment.article_id = articleLookup[comment.belongs_to];
    delete comment.belongs_to;
    return comment;
  });
};

module.exports = { fixUserAndDate, formatCommentData };
