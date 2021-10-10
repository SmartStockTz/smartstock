#sudo dpkg -y --add-architecture i386
#wget -nc https://dl.winehq.org/wine-builds/winehq.key
#sudo apt-key add -y winehq.key
#sudo apt update
#sudo apt install -y --install-recommends winehq-stable

npm install -f
npm run build:mac
node ./upload.mac.js
