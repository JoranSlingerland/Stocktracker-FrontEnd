import { ApiWithMessage } from '../../utils/api';

interface DeleteCosmosDbContainerBody {
  containersToDelete: 'output_only' | 'all';
}

function deleteCosmosDbContainer({
  body,
}: {
  body: DeleteCosmosDbContainerBody;
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

export { deleteCosmosDbContainer };
