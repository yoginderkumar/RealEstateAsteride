import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen, HomeListScreen, HomeDetailsScreen } from '../screens';

export type RootStackParamList = {
    Login: undefined;
    HomeList: undefined;
    HomeDetails: { homeId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="HomeList" component={HomeListScreen} />
                <Stack.Screen name="HomeDetails" component={HomeDetailsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};


export default AppNavigator;