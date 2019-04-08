#!/bin/sh
SCR=$(readlink -f $0)
echo "$SCR: Updating local deps"

cd $(readlink -f $(dirname $0)/..)
(
    cd closet-component-packages
    echo "$SCR: cd $(pwd)"
    npm install
)
(
    cd closet-default-component-packages
    echo "$SCR: cd $(pwd)"
    npm install
)
(
    cd content-manager
    echo "$SCR: cd $(pwd)"
    npm install
)
(
    cd tau-component-packages
    echo "$SCR: cd $(pwd)"
    npm install
)
(
    cd contents
    echo "$SCR: cd $(pwd)"
    npm install
    bower install
    grunt build
)
(
    cd design-editor
    echo "$SCR: cd $(pwd)"
    npm install
)
