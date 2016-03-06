#!/bin/bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd $DIR/..
echo $DIR

#pre
./bin/stop-server.sh
if [ -d log ]; then
	rm -rf log/
fi

#rsync remote
rsync -avz -e "ssh -p 22" . guimaodai@192.168.101.51:wedding