import { combineReducers } from '@reduxjs/toolkit';
import { appReducer } from '@entities/app';
import { userReducer } from '@entities/user';
import { walletReducer } from '@entities/wallet';
import { collectionReducer } from '@entities/collection';
import { characterReducer } from '@entities/character';
import { inventoryReducer } from '@entities/inventory';

export const rootReducer = combineReducers({
  app: appReducer,
  user: userReducer,
  wallet: walletReducer,
  collection: collectionReducer,
  character: characterReducer,
  inventory: inventoryReducer,
});
