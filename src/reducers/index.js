import { combineReducers } from 'redux';
import customerReducer from './customerReducer';

const rootReducer = combineReducers({
  customer: customerReducer,
  // Add other reducers here
});

export default rootReducer;