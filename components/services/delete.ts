import { ApiWithMessage } from '../utils/api';

async function deleteInputItems({
  body,
}: {
  body: {
    itemIds: string[];
    container: 'input_invested' | 'input_transactions';
    userId: string;
  };
}) {
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
