oscmodulator
============

[![Build Status](https://travis-ci.org/OSCModulator/oscmodulator.png)](https://travis-ci.org/OSCModulator/oscmodulator)

Modulate Anything!

# Getting Started

## Install Prerequisites

These prerequisites tools are used for creating builds and running tests.

### OS X Instructions

Run the `> commands` from your shell.

#### Clone the repository

    > git clone https://github.com/OSCModulator/oscmodulator.git
    > cd oscmodulator

#### Prepare Homebrew

Install Homebrew (if you don't already have it)

    >ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"
or

Update Homebrew (if you already had it installed)

    >brew update

#### Node.js Runtime

Install the Node Version Manager (nvm) via Homebrew.

    >brew install nvm

To activate nvm, you need to source it from your shell.

    source $(brew --prefix nvm)/nvm.sh
    
For example, add this line to your `~/.bashrc`, `~/.profile`, or `~/.zshrc` file to have it automatically sourced upon login.

##### Install Node.js via nvm

Run the following commands to install the correct version of Node.js for development.

    >nvm install 0.10.29
    >nvm use 0.10.29
    >npm update -g
    >npm install -g npm@1.4.14

Optionally, set your default Node.js version so you don't have to specifiy it every time you login.

    >nvm alias default 0.10.29

#### Install Project Dependencies

Run the following lines from within the root directory of the project before starting development. You may also need to run these lines again after any `git pull`.

    >npm install
    >grunt init
    
## Create a build

    > grunt

## Project Development

These are the various tasks available for doing local development and testing in the Chrome browser.

Run and serve the development build at `localhost:9000`.

    >grunt serve    

`note: This also watches for files changes to update the build, run tests, and livereload the app.`

Open the development build in your default browser. Depends on `grunt serve`.

    >grunt open:serve

Run and serve the production build at `localhost:9000`.

    >grunt serve:dist
    
Open the production build in your default browser. Depends on `grunt serve:dist`.

    >grunt open:serve
    
### Running Tests

Run all unit tests and report.

    grunt test

or

    grunt test:unit

Run end to end tests (e2e) and report. Depends on `grunt serve` or `grunt serve:dist`.

    grunt test:e2e
    
## Continuous Integration

Run the continuous integration build. This runs linting, build, unit tests, e2e tests, and generates code coverage reports.

    >grunt ci
    
`note: This would be run on a continuous integration service such as Travis or Jenkins.`
