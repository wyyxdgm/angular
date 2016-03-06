#!/bin/bash
function ppid () {
   ps -p ${1:-$$} -o ppid=;
}
pid=$1
if [ -z $pid ];then
	read -p "PID: " pid
fi
ps -p ${pid:-$$} -o ppid=
