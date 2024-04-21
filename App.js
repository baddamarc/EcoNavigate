import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginRegisterScreen from './components/LoginRegisterScreen';
import WelcomeScreen from './components/WelcomeScreen';
import RouteScreen from './components/RouteScreen';
import CarbonFootprints from './components/CarbonFootprints';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginRegisterScreen} options={{ title: 'Eco-Navigation' }} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ title: 'Welcome' }} />
        <Stack.Screen name="Route" component={RouteScreen} options={{ title: 'Route' }} />
        <Stack.Screen name="CarbonFootprint" component={CarbonFootprints} options={{title: 'CarbonFootprint'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
