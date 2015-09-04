module.exports = function (Healthcenter) {

    Healthcenter.beforeRemote('create', function(context, user, next) {
     var req = context.req;
     req.body.ownerId = req.accessToken.userId;
     console.log("healthcenter create Works!");
     next();
   });

};
