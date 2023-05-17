import { ApiWithMessage } from '../../utils/api';

function createCosmosDbAndContainer() {
  ApiWithMessage(
    '/api/privileged/create_cosmosdb_and_container',
    'Creating Containers',
    'Containers created :)'
  );
}

export { createCosmosDbAndContainer };
