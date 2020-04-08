function _syncSales(i) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log(i);
      resolve();
    }, 5000);
  })
}

async function run() {
  let wait = false;
  let i = 1;
  while (true) {
    if (wait) {
      console.log('in wait mode');
    } else {
      wait = true;
      await _syncSales(i);
      i += 1;
      wait = false;
    }
  }
}

run().then(_ => console.log('test start'));
