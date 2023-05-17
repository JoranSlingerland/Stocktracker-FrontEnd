import { ApiWithMessage } from '../../utils/api';

interface TransactionInput {
  transaction_type: string;
  date: string;
  amount: number;
}

interface StockInput {
  symbol: string;
  date: string;
  transaction_type: string;
  cost_per_share: number;
  quantity: number;
  transaction_cost: number;
  currency: string;
  domain: string;
}

interface AddItemToInputBody {
  type: 'stock' | 'transaction';
  items: (TransactionInput[] & { 0?: never }) | (StockInput[] & { 0?: never });
}

async function addItemToInput({ body }: { body: AddItemToInputBody }) {
  return await ApiWithMessage(
    `/api/add/add_item_to_input`,
    'Creating new items',
    'Items Created',
    'POST',
    body
  );
}

export { addItemToInput };
