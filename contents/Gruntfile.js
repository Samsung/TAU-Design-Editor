/* global module, require */
module.exports = function (grunt) {
    var path = require('path'),
        pkg = grunt.file.readJSON('package.json'),

        // Paths to packages located in atom-package
        srcDistPath = 'dist',
        srcComponentsPath = 'dist/1.0.0/components',
        distTauPackage = '../tau-component-packages/libs/closet',
        distClosetPackage = '../closet-component-packages/libs/closet',
        distClosetComponentsPackage = '../closet-component-packages/components',

        // Path to build framework
        distPath = path.join('dist', pkg.version),
        srcPath = 'src',
        templatePath = path.join('build', 'template'),
        // fix
        onBuildRead = function (moduleName, path, contents) {
            // repair broken pragmas excludes tags
            return contents.replace(/\/\/ >>/g, "//>>");
	    };

    // Project configuration.
    grunt.initConfig({
        pkg: pkg,

        bower: {
            install: {
                options: {
                    copy: false,
                    verbose: true
                }
            }
        },

        requirejs: {
            options: {
                baseUrl: srcPath,
                paths: {
                    'jQuery': '../bower_components/jquery/dist/jquery'
                },
                optimize: 'none',
                findNestedDependencies: true,
                pragmasOnSave: {
                    buildExclude: true
                },
                onBuildRead: onBuildRead,
                wrap: {
                    startFile: path.join(templatePath, 'wrap.prefix'),
                    endFile: path.join(templatePath, 'wrap.suffix')
                }
            },
            full: {
                options: {
                    name: 'dress.closet.full',
                    exclude: ['jQuery'],
                    out: path.join(distPath, pkg.name + '.closet.full') + '.js'
                }
            },
            dress:{
                options: {
                    name: 'dress/dress',
                    exclude: ['jQuery'],
                    out: path.join(distPath, pkg.name) + '.js'
                }
            },
            closet: {
                options: {
                    name: 'components/dress.closet',
                    exclude: ['jQuery'],
                    out: path.join(distPath, 'components', pkg.name + '.closet') + '.js'
                }
            }
        },

        'module-requirejs': {
            all: {
                options: {
                    baseUrl: srcPath,
                    output: distPath,
                    paths: {
                        'jQuery': '../bower_components/jquery/dist/jquery'
                    },
                    exclude: ['jQuery', 'components/dress.closet'],
                    optimize: 'none',
                    findNestedDependencies: true,
                    pragmasOnSave: {
                        buildExclude: true
                    },
	                onBuildRead: onBuildRead,
                    wrap: {
                        startFile: path.join(templatePath, 'module.prefix'),
                        endFile: path.join(templatePath, 'module.suffix')
                    }
                },
                src : path.join(srcPath, 'components', '*/*.js')
            }
        },

        less : {
            all: {
                files : [{
                    src: path.join(srcPath, 'dress.closet.full.less'),
                    dest: path.join(distPath, pkg.name + '.closet.full') + '.css'
                }]
            },

            modules: {
                files: [
                    {
                        expand: true,
                        cwd: srcPath,
                        src: [path.join('components', '**/*.less')],
                        dest: distPath,
                        ext: '.css'
                    }
                ]
            }
        },

        copy: {
            json: {
                expand: true,
                cwd: srcPath,
                src: [path.join('components', '**/*.json')],
                dest: distPath
            },
            // coping closet folder because of problems with symlinks in FAT
            closetTau: {
                expand: true,
                cwd: srcDistPath,
                src: '**',
                dest: distTauPackage
            },
            closet: {
                expand: true,
                cwd: srcDistPath,
                src: '**',
                dest: distClosetPackage
            },
            // coping components folder because of problems with symlinks in FAT
            components: {
                expand: true,
                cwd: srcComponentsPath,
                src: '**',
                dest: distClosetComponentsPackage
            },
            resources : {
                expand: true,
                cwd: srcPath,
                src: [path.join('components', '**/resources/*')],
                dest: distPath
            }
        },

        'string-replace': {
            version: {
                options: {
                    replacements: [{
                        pattern: /@VERSION/ig,
                        replacement: '<%= pkg.version %>'
                    }]
                },
                files: {
                    'dest': [path.join(distPath, '**/*.js')]
                }
            }
        },

        clean: {
            all: [distPath]
        },

        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        },

        watch: {
            options: {
                // Start a live reload server on the default port 35729
                livereload: true,
                interrupt: true
            },
            js: {
                files : [path.join(srcPath, '**/*.js')],
                tasks : ['requirejs']
            },
            less: {
                files : [path.join(srcPath, '**/*.less')],
                tasks : ['css']
            }
        },

        concurrent: {
            devel: {
                tasks: ['watch', 'karma'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });

    // Load framework custom tasks
    grunt.loadTasks('build/tasks');

    // Load the plugin that provides the 'uglify' task.
    grunt.loadNpmTasks('grunt-bower-task');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('install', ['bower', 'build']);

    grunt.registerTask('version', []);
    grunt.registerTask('css', ['less']);

    grunt.registerTask('devel', ['concurrent:devel']);
    grunt.registerTask('build', ['clean', 'requirejs', 'module-requirejs', 'copy:json', 'copy:resources', 'css', 'version', 'copy:closet', 'copy:closetTau', 'copy:components']);

    // Default task(s).
    grunt.registerTask('default', ['build']);
};
