rm -r desktop/smartstock
rm -r desktop/dist
cp -r dist/smartstock desktop
node desktop-version.js
cd desktop
npm install
npm run build:win
npm install -g ipfs
jsipfs init
jsipfs daemon
jsipfs add -r ./dist

#snapcraft upload --release=stable,edge,beta dist/smartstock_${PACKAGE_VERSION}_amd64.snap
