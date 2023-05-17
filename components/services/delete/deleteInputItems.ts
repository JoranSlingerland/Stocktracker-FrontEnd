import { ApiWithMessage } from '../../utils/api';

interface DeleteInputItemsBody {
  itemIds: string[];
  container: 'input_invested' | 'input_transactions';
}

async function deleteInputItems({ body }: { body: DeleteInputItemsBody }) {
  return await ApiWithMessage(
    `/api/delete/delete_input_items`,
    'Deleting item',
    'Item deleted',
    'POST',
    body,
    'application/json'
  );
}

export { deleteInputItems };
