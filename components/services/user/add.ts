import { ApiWithMessage } from '../../utils/api';
import { UserSettings } from './get';

async function addUserData({ body }: { body: UserSettings }) {
  return await ApiWithMessage(
    '/api/user/add',
    'Saving account settings...',
    'Account settings saved!',
    'POST',
    body
  );
}

export { addUserData };
