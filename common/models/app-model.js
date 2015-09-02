module.exports = function(AppModel) {
  
  AppModel.observe('before save', function updateTimestamp(ctx, next) {
    if (ctx.instance) {
      ctx.instance.modified = Date.now();
    } else {
      ctx.data.created = Date.now();
    }
    next();
  });
    

    AppModel.beforeRemote('upsert', function(context, user, next) {
     var req = context.req;
     req.body.ownerId = req.accessToken.userId;
     console.log("upsert Works!");
     next();
   });
};
