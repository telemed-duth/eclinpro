module.exports = function (Protocol) {

  Protocol.beforeCreate = function(next, instance) {
    instance.created = instance.modified = Date.now();
    next();
  };

  Protocol.beforeUpdate = function(next, instance) {
    instance.modified = Date.now();
    next();
  };
};
