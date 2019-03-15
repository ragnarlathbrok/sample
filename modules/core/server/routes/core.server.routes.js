'use strict';
module.exports = function (app) {
  // Root routing
  var core = require('../controllers/core.server.controller');

  // Define error pages
  app.route('/server-error').get(core.renderServerError);

  // Return a 404 for all undefined api, module or lib routes
  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  // Define application route
  app.route('/').get(core.renderIndex);
  app.route('/pmj/admin/signin').get(core.renderIndex);
  app.route('/add-info').get(core.renderIndex);
  app.route('/viewImages').get(core.renderIndex);
  app.route('/updateImages').get(core.renderIndex);
  app.route('/settings/picture').get(core.renderIndex);
  app.route('/settings/password').get(core.renderIndex);
  app.route('/settings/profile').get(core.renderIndex);
  app.route('/:category/image').post(core.addImages);
  app.route('/save-links').post(core.addLinks);
  app.route('/:category/appendImages').post(core.appendImages);
  app.route('/:category/prependImages').post(core.prependImages);
  app.route('/append-links').post(core.appendLinks);
  app.route('/prepend-links').post(core.prependLinks);
  app.route('/getImages').get(core.getAllImages);
  app.route('/get-all').get(core.getAll);
  app.route('/:index/:category/replace').post(core.replaceImage);
  app.route('/replace-url').post(core.replaceUrl);
  app.route('/delAll').put(core.deleteAll);
  app.route('/delete-image').put(core.deleteImage);
  app.route('/addurlInfo').put(core.addUrlInfo);
  app.route('/addPriority').put(core.addPriority);
};
