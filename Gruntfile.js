module.exports = function( grunt ) {

    var BUILD_DEST = './js/jQuery-autogrow.js',
        MIN_DEST = './js/jQuery-autogrow.min.js'

    var gruntConfig = {};

    gruntConfig.pkg = grunt.file.readJSON("package.json");

    gruntConfig.jshint = {
        all: {
            options: {
                jshintrc: "./.jshintrc"
            },

            files: {
                src: [
                    BUILD_DEST
                ]
            }
        }
    };

    gruntConfig["closure-compiler"] = {
        frontend: {
            closurePath: '../closure_compiler',
            js: BUILD_DEST,
            jsOutputFile: MIN_DEST,
            maxBuffer: 8192,
            options: {
                compilation_level: 'SIMPLE_OPTIMIZATIONS',
                language_in: 'ECMASCRIPT5',
                charset: "UTF-8",
                debug: false
            },
            noreport: true
        }
    };

    grunt.initConfig(gruntConfig);
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-closure-compiler');

};