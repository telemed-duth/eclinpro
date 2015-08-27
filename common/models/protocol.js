module.exports = function (Protocol) {
  Protocol.observe('before save', function updateTimestamp(ctx, next) {
    if (ctx.instance) {
      ctx.instance.modified = new Date();
    } else {
      ctx.data.created = new Date();
    }
    next();
  });
};
