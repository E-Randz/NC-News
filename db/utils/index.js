const fixUserAndDate = (data) => {
  return data.map((item) => {
    const newItem = { ...item };
    newItem.username = newItem.created_by;
    newItem.created_at = new Date(newItem.created_at);
    delete newItem.created_by;
    return newItem;
  }, {});
};

const formatCommentData = (data, articles) => {
  // create lookup for the title of the article
  const articleLookup = articles.reduce((acc, curr) => {
    acc[curr.title] = curr.article_id;
    return acc;
  }, {});
  // process data to fix data and username, then fix article_id
  return fixUserAndDate(data).map((comment) => {
    const newComment = { ...comment };
    newComment.article_id = articleLookup[newComment.belongs_to];
    delete newComment.belongs_to;
    return newComment;
  });
};

module.exports = { fixUserAndDate, formatCommentData };
