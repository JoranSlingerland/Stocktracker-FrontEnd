import { ApiWithMessage } from '../../utils/api';
import { UserSettings } from './get';

async function addUserData({ body }: { body: UserSettings }) {
  return await ApiWithMessage({
    url: '/api/user/add',
    runningMessage: 'Saving account settings',
    successMessage: 'Account settings saved!',
    method: 'POST',
    body,
  });
}

export { addUserData };
