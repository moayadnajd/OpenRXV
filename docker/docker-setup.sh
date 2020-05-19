#!/bin/bash

set +e

sudo apt-get -y update > /dev/null

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
sudo apt-get -y update > /dev/null

sudo apt-get -y install docker-ce docker-ce-cli containerd.io > /dev/null

sudo usermod -aG docker $USER > /dev/null

newgrp docker 

sudo systemctl enable docker

sudo echo "vm.max_map_count=262144" >> /etc/sysctl.conf

sysctl -w vm.max_map_count=262144

sudo curl -L "https://github.com/docker/compose/releases/download/1.25.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose > /dev/null

sudo chmod +x /usr/local/bin/docker-compose > /dev/null

sudo docker run hello-world