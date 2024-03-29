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
  items: TransactionInput[] | StockInput[];
}

async function addItemToInput({ body }: { body: AddItemToInputBody }) {
  return await ApiWithMessage({
    url: '/api/input/add',
    runningMessage: 'Creating new items',
    successMessage: 'Items Created',
    method: 'POST',
    body,
  });
}

export { addItemToInput };
