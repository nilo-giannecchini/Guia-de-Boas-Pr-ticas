module.exports = function (grunt) {

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    grunt.loadNpmTasks('grunt-githooks');

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
                // options: {
                //     template: '../../.git/hooks/pre-commit.js'
                // },
                'pre-commit': 'karma'
            }
        }
    });


    grunt.registerTask('default', 'default task description', function () {
        console.log('hello world');
    });
    grunt.registerTask('githook', ['githooks', 'karma:test']);
};