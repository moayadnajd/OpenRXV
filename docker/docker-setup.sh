#!/bin/bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NO_COLOR='\033[0m'
CLEAR_LINE='\r\033[K'

printf "[1/6]🔎   checking dependencies"

sudo apt-get -y update; 

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable";
sudo apt-get -y update;

sudo apt-get -y install docker-ce docker-ce-cli containerd.io;

sudo usermod -aG docker $USER;

newgrp docker; 

sudo systemctl enable docker;

sudo echo "vm.max_map_count=262144" >> /etc/sysctl.conf;

sysctl -w vm.max_map_count=262144;

sudo curl -L "https://github.com/docker/compose/releases/download/1.25.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose;

sudo chmod +x /usr/local/bin/docker-compose;

sudo docker run hello-world