#!/bin/bash

export PATH="/bin:/usr/bin:/usr/local/bin"
echo 'crontab begin with: $cd /home/pi/home-server-v2 && $shjs /home/pi/home-server-v2/auto-update.js' >> /home/pi/home-server-v2/output.log &&
cd /home/pi/home-server-v2 && shjs /home/pi/home-server-v2/auto-update.js >> /home/pi/home-server-v2/output.log &&
echo 'crontab end' >> /home/pi/home-server-v2/output.log

