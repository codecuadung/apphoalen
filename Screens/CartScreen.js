// Screens/CartScreen.js
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import CartComponent from '../redux/component/CartComponent';
import { fetchCart } from '../redux/slices/CartSlice';

const CartScreen = ({ route }) => {
  const dispatch = useDispatch();
  const email = route.params?.email; // Lấy email từ route params
  const cartState = useSelector(state => state.cart.status); // Thay đổi đây

  useEffect(() => {
    if (email) {
      dispatch(fetchCart(email));
    }
  }, [dispatch, email]);

  if (cartState.status === 'loading') {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (cartState.status === 'failed') {
    return (
      <View style={styles.container}>
        <Text>Error: {cartState.error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CartComponent email={email} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default CartScreen;
