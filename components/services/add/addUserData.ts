import { ApiWithMessage } from '../../utils/api';
import { UserSettings } from '../data/getUserData';

async function addUserData({ body }: { body: UserSettings }) {
  return await ApiWithMessage(
    '/api/add/add_user_data',
    'Saving account settings...',
    'Account settings saved!',
    'POST',
    body
  );
}

export { addUserData };
