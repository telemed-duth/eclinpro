module.exports = function(Protocol) {
      

    Protocol.beforeRemote('create', function(context, user, next) {
     var req = context.req;
     req.body.ownerId = req.accessToken.userId;
     console.log("protocol create Works!");
     next();
   });
};
