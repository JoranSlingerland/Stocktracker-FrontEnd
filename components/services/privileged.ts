import { ApiWithMessage } from '../utils/api';

function createCosmosDbAndContainer() {
  ApiWithMessage(
    '/api/privileged/create_cosmosdb_and_container',
    'Creating Containers',
    'Containers created :)'
  );
}

function deleteCosmosDbContainer({
  body,
}: {
  body: { containersToDelete: 'output_only' | 'all' };
}) {
  ApiWithMessage(
    '/api/privileged/delete_cosmosdb_container',
    'Deleting Containers',
    'Containers deleted :)',
    'POST',
    body,
    'multipart/form-data'
  );
}

export { createCosmosDbAndContainer, deleteCosmosDbContainer };
