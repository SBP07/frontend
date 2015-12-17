import * as children from './children';
import * as contactpersons from './contactpersons';
import * as login from './login';

// Combine all into one Object
export default Object.assign({}, children, contactpersons, login);

export const backendURL = 'http://backend.speelsysteem.be';
