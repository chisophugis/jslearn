/*jslint node:true*/

module.exports = function (grunt) {

    'use strict';

    grunt.loadNpmTasks('grunt-jslint'); // load the task

    grunt.initConfig({
        watch: {
            files: '<config:jslint.files>',
            tasks: 'jslint'
        },

        jslint: { // configure the task
            files: [ // some example files
                // for the moment. 'Gruntfile.js',
                'index.js'
            ],
            exclude: [
            ],
            directives: { // example directives
                todo: true,
                indent: 4,
                browser: true,
                predef: [ // array of pre-defined globals
                ]
            },
            options: {
                junit: 'out/junit.xml', // write the output to a JUnit XML
                log: 'out/lint.log',
                jslintXml: 'out/jslint_xml.xml',
                errorsOnly: true, // only display errors
                failOnError: false, // defaults to true
                shebang: true, // ignore shebang lines
                checkstyle: 'out/checkstyle.xml' // write a checkstyle-XML
            }
        }

    });

    grunt.registerTask('default', 'watch');
};
