@REM rm -r desktop/smartstock
@REM rm -r desktop/dist
@REM cp -r dist/smartstock desktop
node desktop-version.js
cd desktop || echo ""
npm install
npm run build:win
@REM npm install -g ipfs
@REM jsipfs init
@REM jsipfs daemon
@REM jsipfs add -r ./dist

@REM #snapcraft upload --release=stable,edge,beta dist/smartstock_${PACKAGE_VERSION}_amd64.snap
