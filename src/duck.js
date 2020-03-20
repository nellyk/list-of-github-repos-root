import { resourcesReducer } from 'iguazu-rest';
import { combineReducers } from 'redux-immutable';
import { configureIguazu } from './config';

configureIguazu();

export default combineReducers({
    resources: resourcesReducer,
  });