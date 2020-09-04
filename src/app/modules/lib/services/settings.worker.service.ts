import {BFast} from 'bfastjs';
import {environment} from '../../../../environments/environment';

async function run() {
  // BFast.init({
  //   applicationId: environment.smartstock.applicationId,
  //   projectId: environment.smartstock.projectId,
  //   appPassword: environment.smartstock.pass
  // });
  // BFast.database().collection('categories')
  //   .query()
  //   .changes()
  //   .addListener(response => {
  //     console.log(response);
  //   });
}

addEventListener('message', async ({data}) => {
 // console.log('start settings worker');
  run().catch(_ => console.log(''));
});
