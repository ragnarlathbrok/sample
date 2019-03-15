'use strict';

/**
 * Render the main application page
 */
var _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  multer = require('multer'),
  config = require(path.resolve('./config/config'));
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.uploads.profileUpload.dest);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});
var mongoose = require('mongoose');
var User = mongoose.model('User');
var fs = require('fs');
exports.renderIndex = function (req, res) {
  res.render('modules/core/server/views/index', {
    user: req.user || null
  });
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};

exports.addImages = function (req, res) {

  // console.log(req.user);
  // console.log(req.user);
  var param = req.params.category;
  // console.log(param);
  // if(param === 'header' || param === 'banner2') {
  //   var singleUpload = multer({
  //     storage: storage,
  //     fileFilter: function(req, file, cb) {
  //       var ext = path.extname(file.originalname);
  //       if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.mp4' && ext !== '.mkv' && ext !== '.flv' && ext !== '.avi') {
  //         return cb(new Error('Only images and Videos are allowed'));
  //       }
  //       cb(null, true);
  //     }
  //   }).single('myimage');
  //   singleUpload(req, res, function (err) {
  //     if (err) {
  //       res.status(500).render('modules/core/server/views/500', {
  //         error: 'Oops! Something went wrong...Could not Upload'
  //       });
  //     } else {
  //       User.findOne({
  //         username: req.user.username,
  //         email: req.user.email
  //       }, function (err, user) {
  //         if (err) {
  //           res.status(500).render('modules/core/server/views/500', {
  //             error: 'Oops! Something went wrong...Could not Upload'
  //           });
  //         } else {
  //           if(param === 'banner1')
  //             user.banner1 = req.file;
  //           else
  //             user.banner2 = req.file;
  //           user.save(function (err) {
  //             if (err) {
  //               res.status(500).render('modules/core/server/views/500', {
  //                 error: 'Oops! Something went wrong...Could not Upload'
  //               });
  //             } else {
  //               console.log('successfilly uploaded');
  //               res.redirect('/viewImages');
  //             }
  //           });
  //         }
  //       });
  //     }
  //   });
  // } else {
  var multiUpload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
      var ext = path.extname(file.originalname);
      if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.mp4' && ext !== '.mkv' && ext !== '.flv' && ext !== '.avi') {
        return cb(new Error('Only images and Videos are allowed'));
      }
      cb(null, true);
    }
  }).array('myimage');
  multiUpload(req, res, function (err) {
    if (err) {
      res.status(500).render('modules/core/server/views/500', {
        error: 'Oops! Something went wrong...Could not Upload'
      });
    } else {
      User.findOne({
        username: req.user.username,
        email: req.user.email
      }, function (err, user) {
        if (err) {
          res.status(500).render('modules/core/server/views/500', {
            error: 'Oops! Something went wrong...Could not Upload'
          });
        } else {
          if (param === 'header') {
            if (user.head.length > 0) {
              for (var i = 0; i < user.head.length; i++) {
                fs.unlink(user.head[i].path);
              }
            }
            user.head = req.files;
          }
          else if (param === 'body') {
            if (user.body.length > 0) {
              for (var j = 0; j < user.body.length; j++) {
                fs.unlink(user.body[j].path);
              }
            }
            user.body = req.files;
          }
          else {
            if(user.other.length > 0) {
              for(var k = 0;k<user.other.length;k++) {

                fs.unlink(user.other[k].path);
              }
            }
            user.other = req.files;
          }
          user.save(function (err) {
            if (err) {
              res.status(500).render('modules/core/server/views/500', {
                error: 'Oops! Something went wrong...Could not Upload'
              });
            } else {
              console.log('successfilly uploaded');
              res.redirect('/viewImages');
            }
          });
        }
      });
    }
  });
  // }
};
exports.addLinks = function (req, res) {
  // console.log(req.body);
  User.findOne({
    username: req.user.username,
    email: req.user.email
  }, function (err, user) {
    if (req.body.where === 'header')
      user.head = req.body.images;
    else if (req.body.where === 'body')
      user.body = req.body.images;
    else
      user.other = req.body.images;
    user.save(function (err) {
      if (err) {
        res.status(500).render('modules/core/server/views/500', {
          error: 'Oops! Something went wrong...Could not Upload'
        });
      } else {
        res.json(req.body.images);
      }
    });
  });
};
exports.appendLinks = function (req, res) {
  if (req.body.where === 'header') {
    User.update({
      username: req.user.username,
      email: req.user.email
    },
      { $push: { head: { $each: req.body.images } } },
      function (err, user) {
        if (err) {
          res.status(500).render('modules/core/server/views/500', {
            error: 'Oops! Something went wrong... Could not Upload'
          });
        } else {
          console.log('Successfully appended the images');
          res.json(req.body.images);
        }
      });
  } else if(req.body.where === 'body') {
    User.update({
      username: req.user.username,
      email: req.user.email
    },
      { $push: { body: { $each: req.body.images } } },
      function (err, user) {
        if (err) {
          res.status(500).render('modules/core/server/views/500', {
            error: 'Oops! Something went wrong... Could not Upload'
          });
        } else {
          console.log('Successfully appended the images');
          res.json(req.body.images);
        }
      });
  }
  else {
    User.update({
      username: req.user.username,
      email: req.user.email
    },
      { $push: { other: { $each: req.body.images } } },
      function (err, user) {
        if (err) {
          res.status(500).render('modules/core/server/views/500', {
            error: 'Oops! Something went wrong... Could not Upload'
          });
        } else {
          console.log('Successfully appended the images');
          res.json(req.body.images);
        }
      });
  }
};
exports.appendImages = function (req, res) {
  var param = req.params.category;
  var multiUpload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
      var ext = path.extname(file.originalname);
      if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.mp4' && ext !== '.mkv' && ext !== '.flv' && ext !== '.avi') {
        return cb(new Error('Only images and Videos are allowed'));
      }
      cb(null, true);
    }
  }).array('myimage');
  multiUpload(req, res, function (err) {
    if (err) {
      res.status(500).render('modules/core/server/views/500', {
        error: 'Oops! Something went wrong...Could not Upload'
      });
    } else {
      if (param === 'header') {
        User.update({
          username: req.user.username,
          email: req.user.email
        },
          { $push: { head: { $each: req.files } } },
          function (err, user) {
            if (err) {
              res.status(500).render('modules/core/server/views/500', {
                error: 'Oops! Something went wrong...Could not Upload'
              });
            } else {
              console.log('Successfully appended the images');
              res.redirect('/viewImages');
            }
          }
        );
      } else if (param === 'body'){
        User.update({
          username: req.user.username,
          email: req.user.email
        },
          { $push: { body: { $each: req.files } } },
          function (err, user) {
            if (err) {
              res.status(500).render('modules/core/server/views/500', {
                error: 'Oops! Something went wrong... Could not Upload'
              });
            } else {
              console.log('Successfully appended the images');
              res.redirect('/viewImages');
            }
          });
      } 
      else {
        User.update({
          username: req.user.username,
          email: req.user.email
        },
          { $push: { other: { $each: req.files } } },
          function (err, user) {
            if (err) {
              res.status(500).render('modules/core/server/views/500', {
                error: 'Oops! Something went wrong... Could not Upload'
              });
            } else {
              console.log('Successfully appended the images');
              res.redirect('/viewImages');
            }
          });
      }
    }
  });
};
exports.prependLinks = function(req,res) {
  User.findOne({
    username: req.user.username,
    email: req.user.email
  }, function (err, user) {
    if (req.body.where === 'header')
      user.head = req.body.images.concat(user.head);
    else if (req.body.where === 'body')
      user.body = req.body.images.concat(user.body);
    else
      user.other = req.body.images.concat(user.other);
    user.save(function (err) {
      if (err) {
        res.status(500).render('modules/core/server/views/500', {
          error: 'Oops! Something went wrong...Could not Upload'
        });
      } else {
        res.json(req.body.images);
      }
    });
  });
};
exports.prependImages = function(req,res) {
  var multiUpload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
      var ext = path.extname(file.originalname);
      if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.mp4' && ext !== '.mkv' && ext !== '.flv' && ext !== '.avi') {
        return cb(new Error('Only images and Videos are allowed'));
      }
      cb(null, true);
    }
  }).array('myimage');
  multiUpload(req, res, function (err) {
    if (err) {
      res.status(500).render('modules/core/server/views/500', {
        error: 'Oops! Something went wrong...Could not Upload'
      });
    } else {
      // console.log(req.files);
      User.findOne({
        username: req.user.username,
        email: req.user.email
      },function(err,user) {
        if (req.params.category === 'header')
          user.head = req.files.concat(user.head);
        else if (req.params.category === 'body')
          user.body = req.files.concat(user.body);
        else
          user.other = req.files.concat(user.other);
        user.save(function (err) {
          if (err) {
            res.status(500).render('modules/core/server/views/500', {
              error: 'Oops! Something went wrong...Could not Upload'
            });
          } else {
            console.log('Successfully prepended the images');
            res.redirect('/viewImages');
          }
        });
      });
    }
  });
};
exports.getAllImages = function (req, res) {
  // console.log(req.body);
  User.find({}, function (err, user) {
    if (err) {
      res.status(500).render('modules/core/server/views/500', {
        error: 'Oops! Something went wrong...Could Not load Images'
      });
    } else {
      res.json(user[0]);
    }
  });
};
exports.getAll = function (req, res) {
  User.findOne({
    username: req.user.username,
    email: req.user.email
  }, function (err, user) {
    if (err) {
      res.status(500).render('modules/core/server/views/500', {
        error: 'Oops! Something went wrong...Could Not load Images'
      });
    } else {
      res.json(user[0]);
    }
  });
};
exports.replaceImage = function (req, res) {
  var singleUpload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
      var ext = path.extname(file.originalname);
      if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.mp4' && ext !== '.mkv' && ext !== '.flv' && ext !== '.avi') {
        return cb(new Error('Only Images and Videos are allowed'));
      }
      cb(null, true);
    }
  }).single('myimage');
  singleUpload(req, res, function (err) {
    if (err) {
      res.status(500).render('modules/core/server/views/500', {
        error: 'Oops! Something went wrong...Could not Upload'
      });
    } else {
      User.findOne({
        username: req.user.username,
        email: req.user.email
      }, function (err, user) {
        if (req.params.category === 'header') {
          // console.log(user.head[req.params.index]);
          if (fs.existsSync(user.head[req.params.index].path))
            fs.unlink(user.head[req.params.index].path);
          user.head[req.params.index] = req.file;
          user.markModified('head');
        }
        else if (req.params.category === 'body') {
          if (fs.existsSync(user.body[req.params.index].path))
            fs.unlink(user.body[req.params.index].path);
          user.body[req.params.index] = req.file;
          user.markModified('body');
        } else {
          if (fs.existsSync(user.other[req.params.index].path))
            fs.unlink(user.other[req.params.index].path);
          user.other[req.params.index] = req.file;
          user.markModified('other');
        }
        user.save(function (err) {
          if (err) {
            res.status(500).render('modules/core/server/views/500', {
              error: 'Oops! Something went wrong...Could not Upload'
            });
          } else {
            console.log('Successfully replaced image');
            res.redirect('/updateImages');
          }
        });
      });
    }
  });
};
exports.replaceUrl = function (req, res) {
  User.findOne({
    username: req.user.username,
    email: req.user.email
  }, function (err, user) {
    if (req.body.where === 'header') {
      if (fs.existsSync(user.head[req.body.index].path))
        fs.unlink(user.head[req.body.index].path);
      user.head[req.body.index] = req.body.image;
      user.markModified('head');
    } else if (req.body.where === 'body'){
      if (fs.existsSync(user.body[req.body.index].path))
        fs.unlink(user.body[req.body.index].path);
      user.body[req.body.index] = req.body.image;
      user.markModified('body');
    } else {
      if (fs.existsSync(user.other[req.body.index].path))
        fs.unlink(user.other[req.body.index].path);
      user.other[req.body.index] = req.body.image;
      user.markModified('other');
    }
    user.save(function (err) {
      if (err) {
        res.status(500).render('modules/core/server/views/500', {
          error: 'Oops! Something went wrong...Could not Upload'
        });
      } else {
        console.log('Successfully replaced image');
        res.json(req.body);
      }
    });
  });
};
exports.deleteAll = function (req, res) {
  if (req.body.which === 'header') {
    User.findOne({
      username: req.user.username,
      email: req.user.email
    }, function (err, user) {
      if (user) {
        for (var i = 0; i < user.head.length; i++) {
          if (fs.existsSync(user.head[i].path))
            fs.unlink(user.head[i].path);
        }
      }
    });
    User.update({
      username: req.user.username,
      email: req.user.email
    },
      { $set: { head: [], headInfo: [] } }, function (err, user) {
        console.log('Deleted All');
        res.json(req.body);
      });
  } else if (req.body.which === 'body'){
    User.findOne({
      username: req.user.username,
      email: req.user.email
    }, function (err, user) {
      if (user) {
        for (var i = 0; i < user.body.length; i++) {
          if (fs.existsSync(user.body[i].path))
            fs.unlink(user.body[i].path);
        }
      }
    });
    User.update({
      username: req.user.username,
      email: req.user.email
    },
      { $set: { body: [], bodyInfo: [] } }, function (err, user) {
        console.log('Deleted All');
        res.json(req.body);
      });
  } else {
    User.findOne({
      username: req.user.username,
      email: req.user.email
    }, function (err, user) {
      if (user) {
        for (var i = 0; i < user.other.length; i++) {
          if (fs.existsSync(user.other[i].path))
            fs.unlink(user.other[i].path);
        }
      }
    });
    User.update({
      username: req.user.username,
      email: req.user.email
    },
      { $set: { other: [], otherInfo: [] } }, function (err, user) {
        console.log('Deleted All');
        res.json(req.body);
      });
  }
};
exports.deleteImage = function (req, res) {
  // console.log(req.body);
  User.findOne({
    username: req.user.username,
    email: req.user.email
  }, function (err, user) {
    var i;
    if (req.body.which === 'header') {
      for (i = 0; i < req.body.indexes.length; i++) {
        if (req.body.indexes[i] === false) {
          user.headInfo.splice(i, 1);
          try {
            if (fs.existsSync(user.head[i].path))
              fs.unlink(user.head[i].path);
          } catch (err) {
            console.log('Error---->', err.message);
          }
        }
        user.head = req.body.images;
      }
    } else if(req.body.which === 'body') {
      for (i = 0; i < req.body.indexes.length; i++) {
        if (req.body.indexes[i] === false) {
          user.bodyInfo.splice(i, 1);
          try {
            if (fs.existsSync(user.body[i].path))
              fs.unlink(user.body[i].path);
          } catch (err) {
            console.log('Error---->', err.message);
          }
        }
        user.body = req.body.images;
      }
    } else {
      for (i = 0; i < req.body.indexes.length; i++) {
        if (req.body.indexes[i] === false) {
          user.otherInfo.splice(i, 1);
          try {
            if (fs.existsSync(user.other[i].path))
              fs.unlink(user.other[i].path);
          } catch (err) {
            console.log('Error---->', err.message);
          }
        }
        user.other = req.body.images;
      }
    }
    user.save(function (err) {
      if (err) {
        res.status(500).render('modules/core/server/views/500', {
          error: 'Oops! Something went wrong...Could not Upload'
        });
      } else {
        res.json(req.body.images);
      }
    });
  });
};
exports.addUrlInfo = function (req, res) {
  User.findOne({
    username: req.user.username,
    email: req.user.email
  }, function (err, user) {
    if (req.body.where === 'header')
      user.headInfo = req.body.info;
    else if(req.body.where === 'body')
      user.bodyInfo = req.body.info;
    else
      user.otherInfo = req.body.info;
    user.save(function (err) {
      if (err) {
        res.status(500).render('modules/core/server/views/500', {
          error: 'Oops! Something went wrong...Could not Upload'
        });
      } else {
        res.json(req.body.info);
      }
    });
  });
};
exports.addPriority = function(req,res) {
  var tempImage = '';
  var tempInfo = '';
  console.log(req.body);
  User.findOne({
    username: req.user.username,
    email: req.user.email
  },function(err,user) {
    if(req.body.which === 'body') {
      for(var i = 0;i<req.body.priorities.length;i++) {
        if(req.body.priorities[i] !== null) {
          tempImage = user.body[req.body.priorities[i]];
          user.body[req.body.priorities[i]] = user.body[i];
          user.body[i] = tempImage;
          tempInfo = user.bodyInfo[req.body.priorities[i]];
          user.bodyInfo[req.body.priorities[i]] = user.bodyInfo[i];
          user.bodyInfo[i] = tempInfo;
        }
      }
      user.markModified('body');
    } else {
      for(var j = 0;j<req.body.priorities.length;j++) {
        if(req.body.priorities[j] !== null) {
          tempImage = user.head[req.body.priorities[j]];
          user.head[req.body.priorities[j]] = user.head[j];
          user.head[j] = tempImage;
          tempInfo = user.headInfo[req.body.priorities[j]];
          user.headInfo[req.body.priorities[j]] = user.headInfo[j];
          user.headInfo[j] = tempInfo;
        }
      }
      user.markModified('head');
    }
    user.save(function (err) {
      if (err) {
        res.status(500).render('modules/core/server/views/500', {
          error: 'Oops! Something went wrong...Could not Upload'
        });
      } else {
        res.json(req.body);
      }
    });
  });
};
