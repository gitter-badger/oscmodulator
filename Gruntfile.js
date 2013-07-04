'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  /* Allow jshint:with_overrides below */
  /* jshint camelcase: false */

  /**
   * Determines the build type which is later used to load the correct node-webkit build.
   */
  var buildType = (function () {
    var buildType = 'unknown';
    var platform = process.platform;
    if (platform === 'darwin') {
      buildType = 'osx';
    } else if (platform === 'linux') {
      buildType = 'linux';
    } else if (platform.match(/^win/)) {
      buildType = 'windows';
    }
    return buildType;
  })();

  // load all grunt tasks
  var matchdep = require('matchdep');
  var allGruntTasks = matchdep.filterDev('grunt-*');
  var blacklist = ['grunt-cli'];
  // Remove anything in the blacklist.
  for (var i = 0; i < blacklist.length; i++) {
    for (var j = allGruntTasks.length - 1; j >= 0; j--) {
      if (blacklist[i] === allGruntTasks[j]) {
        allGruntTasks.splice(j, 1);
        break;
      }
    }
  }
//  allGruntTasks = allGruntTasks.concat(['gruntacular']);
  allGruntTasks.forEach(grunt.loadNpmTasks);

  // configurable paths
  var yeomanConfig = {
    app : 'app',
    dist : 'dist',
    tmp : '.tmp'
  };

  try {
    yeomanConfig.app = require('./component.json').appPath || yeomanConfig.app;
  } catch ( e ) {
  }

  grunt.initConfig({
    env : {
      options : {
        //Shared Options Hash
      },
      build : {
        PHANTOMJS_BIN : './node_modules/phantomjs/bin/phantomjs'
      }
    },
    yeoman : yeomanConfig,
    watch : {
      coffee : {
        files : ['<%= yeoman.app %>/scripts/{,*/}*.coffee'],
        tasks : ['coffee:dist']
      },
      coffeeTest : {
        files : ['test/spec/{,*/}*.coffee'],
        tasks : ['coffee:test']
      },
      livereload : {
        files : [
          '<%= yeoman.app %>/{,*/}*.html',
          '{.tmp,<%= yeoman.app %>}/styles/{,*/}*.css',
          '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg}'
        ],
        tasks : ['livereload']
      }
    },
    connect : {
      livereload : {
        options : {
          port : 9000,
          // Change this to '0.0.0.0' to access the server from outside.
          hostname : 'localhost',
          middleware : function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, yeomanConfig.app),
              // read README to understand why this is necessary
              mountFolder(connect, '.')
            ];
          }
        }
      },
      e2e : {
        options : {
          port : 9001,
          middleware : function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, yeomanConfig.app),
              // read README to understand why this is necessary
              mountFolder(connect, '.')
            ];
          }
        }
      }
    },
    open : {
      server : {
        url : 'http://localhost:<%= connect.livereload.options.port %>'
      }
    },
    clean : {
      dist : ['.tmp', '<%= yeoman.dist %>/*'],
      server : '.tmp',
      // unit tests don't run compass, so they shouldn't blow away the .tmp directory either
      unit : []
    },
    bower : {
      install : {
        //just run 'grunt bower:install' and you'll see files from your Bower packages in lib directory
      }
    },
    jshint : {
      options : {
        jshintrc : '.jshintrc'
      },
      all : [
        'Gruntfile.js', '<%= yeoman.app %>/scripts/{,*/}*.js'
      ],
      // Jasmine specs use globals among other things that require different linting configuration.
      with_overrides : {
        options : {
          jshintrc : 'test/.jshintrc'
        },
        files : {
          src : [ 'test/**/*.js', '!**/karma*.conf.js' ]
        }
      }
    },
    karma : {
      unit : {
        configFile : 'test/karma.conf.js',
        autoWatch : false,
        singleRun : true,
        browsers : ['PhantomJS']
      },
      'unit-watch': {
        configFile : 'test/karma.conf.js',
        singleRun : false,
        autoWatch : true
      },
      e2e : {
        configFile : 'test/karma-e2e.conf.js',
        autoWatch : false,
        singleRun : true,
        browsers : ['PhantomJS']
      },
      'e2e-watch': {
        configFile : 'test/karma-e2e.conf.js',
        singleRun : false,
        autoWatch : true
      },
      'e2e-cross-browser': {
        configFile : 'test/karma-e2e.conf.js',
        singleRun : true,
        autoWatch : false,
        browsers : ['Chrome', 'Firefox', 'Safari', 'Opera']
      }
    },
    coffee : {
      dist : {
        files : {
          '.tmp/scripts/coffee.js' : '<%= yeoman.app %>/scripts/*.coffee'
        }
      },
      test : {
        files : [
          {
            expand : true,
            cwd : '.tmp/spec',
            src : '*.coffee',
            dest : 'test/spec'
          }
        ]
      }
    },
    concat : {
      dist : {
        files : {
          '<%= yeoman.dist %>/scripts/scripts.js' : [
            '.tmp/scripts/*.js', '<%= yeoman.app %>/scripts/*.js'
          ]
        }
      }
    },
    useminPrepare : {
      html : '<%= yeoman.app %>/index.html',
      options : {
        dest : '<%= yeoman.dist %>'
      }
    },
    usemin : {
      html : ['<%= yeoman.dist %>/{,*/}*.html'],
      css : ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options : {
        dirs : ['<%= yeoman.dist %>']
      }
    },
    imagemin : {
      dist : {
        files : [
          {
            expand : true,
            cwd : '<%= yeoman.app %>/images',
            src : '{,*/}*.{png,jpg,jpeg}',
            dest : '<%= yeoman.dist %>/images'
          }
        ]
      }
    },
    cssmin : {
      dist : {
        files : {
          '<%= yeoman.dist %>/styles/main.css' : [
            '.tmp/styles/{,*/}*.css', '<%= yeoman.app %>/styles/{,*/}*.css'
          ]
        }
      }
    },
    htmlmin : {
      dist : {
        options : {
          /*removeCommentsFromCDATA : true,
           // https://github.com/yeoman/grunt-usemin/issues/44
           //collapseWhitespace : true,
           collapseBooleanAttributes : true,
           removeAttributeQuotes : true,
           removeRedundantAttributes : true,
           useShortDoctype : true,
           removeEmptyAttributes : true,
           removeOptionalTags : true*/
        },
        files : [
          {
            expand : true,
            cwd : '<%= yeoman.app %>',
            src : ['*.html', 'views/*.html'],
            dest : '<%= yeoman.dist %>'
          }
        ]
      }
    },
    cdnify : {
      dist : {
        html : ['<%= yeoman.dist %>/*.html']
      }
    },
    ngmin : {
      dist : {
        files : [
          {
            expand : true,
            cwd : '<%= yeoman.dist %>/scripts',
            src : '*.js',
            dest : '<%= yeoman.dist %>/scripts'
          }
        ]
      }
    },
    uglify : {
      dist : {
        files : {
          '<%= yeoman.dist %>/scripts/scripts.js' : [
            '<%= yeoman.dist %>/scripts/scripts.js'
          ]
        }
      }
    },
    copy : {
      dist : {
        files : [
          {
            expand : true,
            dot : true,
            cwd : '<%= yeoman.app %>',
            dest : '<%= yeoman.dist %>',
            src : [
              '*.{ico,txt}', '.htaccess', 'components/**/*'
            ]
          }
        ]
      }
    },
    shell : {
      run : {
        command : 'build/' + buildType + '/run.sh',
        options : {
          stderr : true,
          stdout : true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-shell');

  grunt.renameTask('regarde', 'watch');
  // remove when mincss task is renamed
  grunt.renameTask('mincss', 'cssmin');

  grunt.registerTask('run-node-webkit', [
    'shell:run'
  ]);

  grunt.registerTask('server', [
    'clean:server',
    'coffee:dist',
    'livereload-start',
    'connect:livereload',
    'open:server',
    'watch'
  ]);

  // This task purposely doesn't use the unit/e2e tasks
  // in order to avoid the duplicated hint/clean/compile tasks
  grunt.registerTask('test', [
    'clean:server',
    'karma:unit',
    'connect:e2e',
    'karma:e2e'
  ]);

  grunt.registerTask('unit', [
    'clean:unit',
    'karma:unit'
  ]);

  grunt.registerTask('unit-watch', [
    'clean:unit',
    'karma:unit-watch'
  ]);

  grunt.registerTask('e2e', [
    'clean:server',
    'connect:e2e',
    'karma:e2e'
  ]);

  grunt.registerTask('e2e-watch', [
    'clean:server',
    'connect:e2e',
    'karma:e2e-watch'
  ]);

  grunt.registerTask('e2e-cross-browser', [
    'clean:server',
    'connect:e2e',
    'karma:e2e-cross-browser'
  ]);

  grunt.registerTask('build', [
    'env:build',
    'clean:dist',
    'jshint',
    'test',
    'coffee',
    'useminPrepare',
    'imagemin',
    'cssmin',
    'htmlmin',
    'concat',
    'copy',
    'cdnify',
    'usemin',
    'ngmin',
    'uglify'
  ]);

  grunt.registerTask('default', ['build']);
};
