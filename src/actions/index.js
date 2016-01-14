import * as children from './children';
import * as contacts from './contacts';
import * as login from './login';

// Combine all into one Object
export default Object.assign({}, children, contacts, login);

export const backendURL = 'http://backend.speelsysteem.be';
