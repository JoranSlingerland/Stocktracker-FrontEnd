import { ApiWithMessage } from '../utils/api';
import { UserSettings_Type } from '../types/types';

async function addItemToInput({ body }: { body: any }) {
  return await ApiWithMessage(
    `/api/add/add_item_to_input`,
    'Creating new items',
    'Items Created',
    'POST',
    body
  );
}

async function addUserData({ body }: { body: UserSettings_Type }) {
  return await ApiWithMessage(
    '/api/add/add_user_data',
    'Saving account settings...',
    'Account settings saved!',
    'POST',
    body
  );
}

export { addItemToInput, addUserData };
