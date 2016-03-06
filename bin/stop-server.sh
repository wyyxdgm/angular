#!/bin/bash

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd $DIR/..

DATE=`date +%Y%m%d`
echo "stop-server at: `date +%F%k:%M:%S.%N`" 1>> log/tty.${DATE}.log 2>>log/tty.${DATE}.err &

#关闭项目
if [ -f process.pid ] ; then
	pid=`cat process.pid`
	if [ ! -z $pid ] ; then
		ppid=`./bin/get-parent-pid.sh $pid`
		if [ ! -z $ppid ] ; then
			echo "kill ppid: $ppid" 1>> log/tty.${DATE}.log 2>>log/tty.${DATE}.err
			kill -9 $ppid
		fi
		echo "kill $pid" 1>> log/tty.${DATE}.log 2>>log/tty.${DATE}.err
		kill -9 $pid
		rm -r process.pid
	fi
fi
exit 0