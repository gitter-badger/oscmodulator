oscmodulator
============

Modulate Anything!

Dependencies
-------------
To build OSC Modulator, you will need:
* NodeJS
* Ruby

Building
--------
Once you have those installed, you can build the project as follows:

    // clone the repo
    git clone https://github.com/OSCModulator/oscmodulator.git
    cd oscmodulator
    // npm install NodeJS dependencies
    npm install
    // install grunt-cli
    npm install -g grunt-cli@0.1.9
    // Initialize the project
    grunt init
    // build and test the project
    grunt
    // build the project
    grunt build
    // or test the project
    grunt test
    // or run the project UI in a browser
    grunt server
    // or run the full node-webkit application
    grunt nw-run
