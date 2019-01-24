#!/bin/bash

export PROCESS_COUNT=$(grep -c "processor" /proc/cpuinfo)

sudo yum install epel-release yum-utils curl wget -y
sudo rpm --import "http://keyserver.ubuntu.com/pks/lookup?op=get&search=0x3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF"
curl https://download.mono-project.com/repo/centos7-stable.repo | sudo tee /etc/yum.repos.d/mono-centos7-stable.repo
curl --silent --location https://rpm.nodesource.com/setup_10.x | sudo bash -
sudo yum install nodejs git gcc gcc-c++ sqlite-devel readline-devel openssl-devel mono-complete -y
sudo npm install pm2 -g

mkdir lib
cd lib

wget http://download.redis.io/releases/redis-stable.tar.gz --no-check-certificate
tar xzfv redis-stable.tar.gz
cd redis-stable
make -j$PROCESS_COUNT
sudo make install
sudo cp -rf src/redis-server /usr/bin/
cd ..

wget -O - https://github.com/premake/premake-core/releases/download/v5.0.0-alpha13/premake-5.0.0-alpha13-linux.tar.gz | tar zfx -
cp -rf premake5 ~

wget 'https://github.com/libevent/libevent/releases/download/release-2.0.22-stable/libevent-2.0.22-stable.tar.gz' -O libevent-2.0.22-stable.tar.gz --no-check-certificate
tar xf libevent-2.0.22-stable.tar.gz
cd libevent-2.0.22-stable/
./configure
make -j$PROCESS_COUNT
sudo make install
sudo ln -s /usr/local/lib/libevent-2.0.so.5 /usr/lib/libevent-2.0.so.5
sudo ln -s /usr/local/lib/libevent-2.0.so.5 /usr/lib64/libevent-2.0.so.5
sudo ln -s /usr/local/lib/libevent_pthreads-2.0.so.5 /usr/lib/libevent_pthreads-2.0.so.5
sudo ln -s /usr/local/lib/libevent_pthreads-2.0.so.5 /usr/lib64/libevent_pthreads-2.0.so.5
cd ..

cd ..

git clone https://github.com/purerosefallen/ygopro --branch=server --recursive
cd ygopro/
git submodule foreach git checkout master
~/premake5 gmake
cd build/
make config=release -j$PROCESS_COUNT
cd ..
ln -s bin/release/ygopro ./
strip ygopro
cd ..

git clone https://github.com/purerosefallen/windbot
cd windbot
xbuild /property:Configuration=Release /property:TargetFrameworkVersion="v4.5"
ln -s bin/Release/WindBot.exe .
ln -s ../ygopro/cards.cdb .
cd ..

git clone https://github.com/purerosefallen/ygopro-server
cd ygopro-server
npm install
ln -s ../ygopro .
ln -s ../windbot .
mkdir config
cp data/default_config.json config/config.json
cd ..

