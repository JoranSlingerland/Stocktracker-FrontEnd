import { ApiWithMessage } from '../../utils/api';

interface DeleteInputItemsBody {
  itemIds: string[];
  container: 'input_invested' | 'input_transactions';
}

async function deleteInputItems({ body }: { body: DeleteInputItemsBody }) {
  return await ApiWithMessage(
    `/api/input/delete`,
    'Deleting item',
    'Item deleted',
    'DELETE',
    body
  );
}

export { deleteInputItems };
