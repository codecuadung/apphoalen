import React, { useEffect, useState } from 'react';
import { StyleSheet, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import RevenueScreen from './RevenueScreen';
import CartScreen from './CartScreen';
import ProductScreen from './ProductScreen';
import OrderScreen from './OrderScreen';
import auth from '@react-native-firebase/auth';

const HometabScreen = ({ route }) => {
  const [role, setRole] = useState('none'); // Default role
  const [isReady, setIsReady] = useState(false); // To track if role is ready
  const email = route.params || '';
  const cart = route.params || '';

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = auth().currentUser;
        if (user) {
          const idTokenResult = await user.getIdTokenResult();
          setRole(idTokenResult.claims.role || 'user');
          console.log("User role:", idTokenResult.claims.role);
        } else {
          console.log("No user logged in.");
          setRole('user'); // Default to 'user' if no user is logged in
        }
      } catch (error) {
        console.error("Failed to fetch user role:", error);
        setRole('user'); // Default role in case of error
      } finally {
        setIsReady(true); // Mark as ready when role fetch is complete
      }
    };

    fetchUserRole();
  }, []);

  const Tab = createBottomTabNavigator();

  if (!isReady) {
    return null; // Or a loading spinner
  }

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: styles.tabBarStyle,
        tabBarItemStyle: styles.tabBarItemStyle,
        tabBarIconStyle: styles.tabBarIconStyle,
      }}
      initialRouteName="Home">
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{ cart: cart }}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={require('../img/home.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="Product"
        component={ProductScreen}
        initialParams={{ cart: cart }}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={require('../img/product.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
          headerShown: false,
          tabBarLabel: () => null,
        }}
      />
      {role === 'admin' && (
        <Tab.Screen
          name="Revenue"
          component={RevenueScreen}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Image
                source={require('../img/revenue.png')}
                style={{ width: size, height: size, tintColor: color }}
              />
            ),
            headerShown: false,
            tabBarLabel: () => null,
          }}
        />
      )}
      <Tab.Screen
        name="Order"
        component={OrderScreen}
        initialParams={{ email: email.replace(/@gmail\.com$/, ''), role: role }}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={require('../img/order.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        initialParams={{ email: email.replace(/@gmail\.com$/, '') }}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={require('../img/cart.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
          tabBarLabel: () => null,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    position: 'absolute',
    width: '60%',
    height: 70,
    marginLeft: '22%',
    borderRadius: 35,
    marginHorizontal: 20,
    marginBottom: 30,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: 'white',
  },
  tabBarItemStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarIconStyle: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HometabScreen;
