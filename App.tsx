import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from './Screens/HomeScreen'
import HelloScreen from './Screens/HelloScreen'
import LoginScreen from './Screens/LoginScreen'
import RegisterScreen from './Screens/RegisterScreen'
import HometabScreen from './Screens/HometabScreen'
import DetailScreen from './Screens/DetailScreen'
import CartScreen from './Screens/CartScreen'
import ProductScreen from './Screens/ProductScreen'
import RevenueScreen from './Screens/RevenueScreen'
import OrderScreen from './Screens/OrderScreen'
import OrderUserScreen from './Screens/OrderUserScreen'
import InforScreen from './Screens/InforScreen'
import { Provider } from 'react-redux'
import store from './redux/store/store'
const App = () => {
  const Stack = createNativeStackNavigator()
  return (
    <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName='HelloScreen'>
        <Stack.Screen name="HometabScreen" component={HometabScreen} options={{headerShown: false}}/>
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{headerShown: false}}/>
        <Stack.Screen name="HelloScreen" component={HelloScreen}options={{headerShown: false}} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{headerShown: false}}/>
        <Stack.Screen name="RegisterScreen" component={RegisterScreen}options={{headerShown: false}} />
        <Stack.Screen name="DetailScreen" component={DetailScreen}options={{headerShown: false}} />
        <Stack.Screen name="CartScreen" component={CartScreen}options={{headerShown: false}}/>
        <Stack.Screen name="ProductScreen" component={ProductScreen}options={{headerShown: false}}/>
        <Stack.Screen name="RevenueScreen" component={RevenueScreen}options={{headerShown: false}}/>
        <Stack.Screen name="OrderScreen" component={OrderScreen}options={{headerShown: false}}/>
        <Stack.Screen name="OrderUserScreen" component={OrderUserScreen}options={{headerShown: false}}/>
        <Stack.Screen name="InforScreen" component={InforScreen}options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  )
}

export default App

const styles = StyleSheet.create({})