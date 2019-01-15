
Parse.Cloud.afterSave('sales', request => {
  const query = new Parse.Query('stocks');
  query.get(request.object.get('stockId')).then(value => {
    value.increment('quantity', -(Number(request.object.get('quantity'))));
    return value.save();
  }).catch(error => {
    console.error("Got an error " + error.code + " : " + error.message);
  })
});

Parse.Cloud.afterSave('purchases', request => {
  const query = new Parse.Query('stocks');
  query.get(request.object.get('stockId')).then(value => {
    value.increment('quantity', (Number(request.object.get('quantity'))));
    value.set('purchase', request.object.get('purchase'));
    value.set('expire', request.object.get('expire'));
    return value.save();
  })
});
// Parse.Cloud.afterSave("Comment", (request) => {
//   const query = new Parse.Query("Post");
//   query.get(request.object.get("post").id)
//     .then(function(post) {
//       post.increment("comments");
//       return post.save();
//     })
//     .catch(function(error) {
//       console.error("Got an error " + error.code + " : " + error.message);
//     });
// });


