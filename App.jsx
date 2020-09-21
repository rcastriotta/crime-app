import React, { useState } from 'react';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';

// NAVIGATOR
import SwitchNavigator from './navigation/SwitchNavigator';

// REDUX
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';
import { PersistGate } from 'redux-persist/integration/react'
import AsyncStorage from '@react-native-community/async-storage';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'

// reducers
import authReducer from './store/reducers/auth';
import userReducer from './store/reducers/user';
import crimeReportsReducer from './store/reducers/crimeReports';
import locationReducer from './store/reducers/location';

import { enableScreens } from 'react-native-screens';
enableScreens();

const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
}

const userPersistConfig = {
  key: 'user',
  storage: AsyncStorage,
}

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  user: persistReducer(userPersistConfig, userReducer),
  crimes: crimeReportsReducer,
  location: locationReducer
});
//redux thunk allows our redux actions to be asyncronous
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));
const persistor = persistStore(store)

const fetchFonts = () => {
  return Font.loadAsync({
    'TTN-Medium': require('./assets/fonts/TTN-Medium.otf'),
    'TTN-Bold': require('./assets/fonts/TTN-Bold.otf')
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false)

  if (!fontLoaded) {
    return (
      <AppLoading startAsync={fetchFonts} onFinish={() => setFontLoaded(true)} />
    );
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SwitchNavigator />
      </PersistGate>
    </Provider>
  );
}

