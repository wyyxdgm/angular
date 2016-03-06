#!/bin/bash
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd $DIR/..

DATE=`date +%Y%m%d`
echo "path: `pwd`"

#启动项目
if [ ! -d log/ ]; then
	mkdir log/
fi

#stop
bash ./bin/stop-server.sh

#start
echo "start-server at: `date +%F%k:%M:%S.%N`" 1>> log/tty.${DATE}.log 2>>log/tty.${DATE}.err &
supervisor server.js 1>> log/tty.${DATE}.log 2>>log/tty.${DATE}.err &
