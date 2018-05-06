module.exports = function (grunt) {

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        // for front-end tdd
        karma: {
            options: {
                configFile: 'karma.conf.js'
            },
            test: {
                singleRun: true
            }
        },

        githooks: {
            all: {
                options: {
                    template: 'hooks/pre-commit.js'
                },
                'pre-commit': 'karma:test'
            }
        }
    });

    grunt.loadNpmTasks('grunt-githooks');

    grunt.registerTask('default', ['githooks', 'karma:test']);
};