oscmodulator
============

[![Build Status](https://travis-ci.org/OSCModulator/oscmodulator.png)](https://travis-ci.org/OSCModulator/oscmodulator)

Modulate Anything!

Dependencies
-------------
To build OSC Modulator, you will need:

* NodeJS
* Grunt
* Bower

Building
--------
Once you have those installed, you can build the project as follows:

    // clone the repo
    > git clone https://github.com/OSCModulator/oscmodulator.git
    > cd oscmodulator
    
    // npm install NodeJS dependencies
    > npm install
    // install grunt-cli
    > npm install -g grunt-cli@0.1.9
    // Initialize the project
    > grunt init
    
    // build and test the project
    > grunt
    // build the project
    > grunt build
    // or test the project
    > grunt test
    // or run the project UI in a browser
    > grunt server
    // or run the full application
    > grunt nw-run
