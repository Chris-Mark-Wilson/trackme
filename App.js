import 'react-native-gesture-handler';
import React from 'react';

import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { Header } from './components/Header';

import { RouteProvider } from './contexts/routeContext';
import { RouteMap } from './components/RouteMap';


const Drawer = createDrawerNavigator();

export default function App() {

  return (
    <RouteProvider>
    <NavigationContainer>
      <Header />
      <Drawer.Navigator initialRouteName="Map" screenOptions={{ headerTitleStyle: { color: 'gray' }, headerTintColor: 'gray' }}>
      <Drawer.Screen name="Map" component={RouteMap}/>
       
        </Drawer.Navigator>
     
      </NavigationContainer>
      </RouteProvider>
  );
}


