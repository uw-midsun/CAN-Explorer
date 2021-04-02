#!/usr/bin/env bash

# MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list

sudo apt-get update
sudo apt-get install -y mongodb-org

echo "mongodb-org hold" | sudo dpkg --set-selections
echo "mongodb-org-server hold" | sudo dpkg --set-selections
echo "mongodb-org-shell hold" | sudo dpkg --set-selections
echo "mongodb-org-mongos hold" | sudo dpkg --set-selections
echo "mongodb-org-tools hold" | sudo dpkg --set-selections

# Pipenv
sudo -H pip3 install -U pipenv

# Redis
sudo add-apt-repository ppa:chris-lea/redis-server -y
sudo apt-get update
sudo apt -y install redis-server

# change supervision setting to use systemd
sudo sed -i "s/^supervised.*/supervised systemd/" /etc/redis/redis.conf
sudo systemctl enable redis-server

: '
The following command is condensed form of editing /etc/systemd/system/redis.service to ...
[Unit]
Description=Advanced key-value store
After=network.target
Documentation=http://redis.io/documentation, man:redis-server(1)

[Service]
Type=forking
ExecStart=/usr/bin/redis-server /etc/redis/redis.conf
ExecStop=/bin/kill -s TERM $MAINPID
ExecStartPost=/bin/sh -c "echo $MAINPID > /var/run/redis/redis.pid"
PIDFile=/run/redis/redis-server.pid
TimeoutStopSec=0
Restart=always
User=redis
Group=redis
RuntimeDirectory=redis
RuntimeDirectoryMode=2755

UMask=007
PrivateTmp=yes
LimitNOFILE=65535
PrivateDevices=yes
ProtectHome=yes
ReadOnlyDirectories=/
ReadWriteDirectories=-/var/lib/redis
ReadWriteDirectories=-/var/log/redis
ReadWriteDirectories=-/var/run/redis

NoNewPrivileges=true
CapabilityBoundingSet=CAP_SETGID CAP_SETUID CAP_SYS_RESOURCE
RestrictAddressFamilies=AF_INET AF_INET6 AF_UNIX
MemoryDenyWriteExecute=true
ProtectKernelModules=true
ProtectKernelTunables=true
ProtectControlGroups=true
RestrictRealtime=true
RestrictNamespaces=true

# redis-server can write to its own config file when in cluster mode so we
# permit writing there by default. If you are not using this feature, it is
# recommended that you replace the following lines with "ProtectSystem=full".
ProtectSystem=true
ReadWriteDirectories=-/etc/redis

[Install]
WantedBy=multi-user.target
Alias=redis.service
'

printf "[Unit]\nDescription=Advanced key-value store\nAfter=network.target\nDocumentation=http://redis.io/documentation, man:redis-server(1)\n\n[Service]\nType=forking\nExecStart=/usr/bin/redis-server /etc/redis/redis.conf\nExecStop=/bin/kill -s TERM $MAINPID\nExecStartPost=/bin/sh -c 'echo $MAINPID > /var/run/redis/redis.pid'\nPIDFile=/run/redis/redis-server.pid\nTimeoutStopSec=0\nRestart=always\nUser=redis\nGroup=redis\nRuntimeDirectory=redis\nRuntimeDirectoryMode=2755\n\nUMask=007\nPrivateTmp=yes\nLimitNOFILE=65535\nPrivateDevices=yes\nProtectHome=yes\nReadOnlyDirectories=/\nReadWriteDirectories=-/var/lib/redis\nReadWriteDirectories=-/var/log/redis\nReadWriteDirectories=-/var/run/redis\n\nNoNewPrivileges=true\nCapabilityBoundingSet=CAP_SETGID CAP_SETUID CAP_SYS_RESOURCE\nRestrictAddressFamilies=AF_INET AF_INET6 AF_UNIX\nMemoryDenyWriteExecute=true\nProtectKernelModules=true\nProtectKernelTunables=true\nProtectControlGroups=true\nRestrictRealtime=true\nRestrictNamespaces=true\n\n# redis-server can write to its own config file when in cluster mode so we\n# permit writing there by default. If you are not using this feature, it is\n# recommended that you replace the following lines with "ProtectSystem=full".\nProtectSystem=true\nReadWriteDirectories=-/etc/redis\n\n[Install]\nWantedBy=multi-user.target\nAlias=redis.service" | sudo tee /etc/systemd/system/redis.service

sudo systemctl daemon-reload
sudo systemctl restart redis.service

# Node
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash
source /home/vagrant/.bashrc
nvm install 15.8.0

