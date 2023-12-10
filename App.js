import 'react-native-gesture-handler';
import React from 'react';

import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { SettingProvider } from './contexts/settingContext';

import { RouteProvider } from './contexts/routeContext';
import { RouteMap } from './Screens/RouteMap';
import { SavedJourneys } from './Screens/SavedJourneys';
import { Settings } from './Screens/Settings';


const Drawer = createDrawerNavigator();

export default function App() {

  return (
    <RouteProvider>
      <SettingProvider>
        <NavigationContainer>
          <Drawer.Navigator initialRouteName="Map" screenOptions={{ headerTitleStyle: { color: 'gray' }, headerTintColor: 'gray' }}>
            <Drawer.Screen name="Map" component={RouteMap} />
            <Drawer.Screen name="Saved Journeys" component={SavedJourneys} />
            <Drawer.Screen name="Settings" component={Settings} />
          </Drawer.Navigator>
        </NavigationContainer>
      </SettingProvider>
    </RouteProvider>
  );
}


