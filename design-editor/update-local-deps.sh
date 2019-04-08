#!/bin/sh
SCR=$(readlink -f $0)
echo "$SCR: Updating local deps to symbolic links"

cd node_modules
ln -fs ../../closet-default-component-packages
ln -fs ../../content-manager
ln -fs ../../closet-component-packages
ln -fs ../../tau-component-packages

