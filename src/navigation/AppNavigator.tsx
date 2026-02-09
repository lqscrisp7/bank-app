import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HistoryScreen from '../screens/HistoryScreen';
import DetailScreen from '../screens/DetailScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="History"
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: '#fff' }
                }}
            >
                <Stack.Screen name="History" component={HistoryScreen} />
                <Stack.Screen name="Detail" component={DetailScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
