module.exports = function (Healthcenter) {

    Healthcenter.beforeRemote('upsert', function(context, user, next) {
     var req = context.req;
     req.body.ownerId = req.accessToken.userId;
     console.log("upsert Works!");
     next();
   });

};
