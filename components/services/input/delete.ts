import { ApiWithMessage } from '../../utils/api';

interface DeleteInputItemsBody {
  itemIds: string[];
  container: 'input_invested' | 'input_transactions';
}

async function deleteInputItems({ body }: { body: DeleteInputItemsBody }) {
  return await ApiWithMessage({
    url: '/api/input/delete',
    runningMessage: 'Deleting item',
    successMessage: 'Item deleted',
    method: 'DELETE',
    body,
  });
}

export { deleteInputItems };
