#Install Docker Engine on Ubuntu
https://docs.docker.com/engine/install/ubuntu/
OS requirements🔗
To install Docker Engine, you need the 64-bit version of one of these Ubuntu versions:
Ubuntu Bionic 18.04 (LTS)

`sudo apt-get update`

`curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -`
`sudo apt-key fingerprint 0EBFCD88`

`sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"`


   `sudo apt-get update`

   ` sudo apt-get install docker-ce docker-ce-cli containerd.io`

   `sudo docker run hello-world`

   next step

   https://docs.docker.com/engine/install/linux-postinstall/

   #Manage Docker as a non-root user

   `sudo usermod -aG docker $USER`
   `newgrp docker `

   `sudo systemctl enable docker`

   `sudo echo "vm.max_map_count=262144" >> /etc/sysctl.conf`
   `sysctl -w vm.max_map_count=262144`
   `sudo curl -L "https://github.com/docker/compose/releases/download/1.25.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose`

   `sudo chmod +x /usr/local/bin/docker-compose`

   `cd OpenRXV/docker`

   `docker-compose up -d`