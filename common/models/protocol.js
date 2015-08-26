module.exports = function (Protocol) {

  // Set the username to the users email address by default.
  Protocol.observe('before save', function prepareCP(ctx, next) {
    if (ctx.instance) {
      if (ctx.instance.owner === undefined) {
        ctx.instance.owner = ctx
      }
      ctx.instance.status = 'created';
      ctx.instance.created = Date.now();
    }
    next();
  });

};
