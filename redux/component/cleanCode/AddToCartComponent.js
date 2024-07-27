import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ToastAndroid } from 'react-native'; 
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../slices/CartSlice';

const removeDomainFromEmail = (email) => {
    return email.replace(/@gmail\.com$/, '');
};

const AddToCartComponent = ({ product, cart }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const handleAddToCart = async () => {
    try {
      // Loại bỏ phần @gmail.com từ cart (email)
      const emailWithoutDomain = removeDomainFromEmail(cart);
      console.log('Email:', emailWithoutDomain);
      
      // Dispatch action addToCart với thông tin sản phẩm và email đã xử lý
      await dispatch(addToCart({ email: emailWithoutDomain, product }));
      console.log('Đã thêm vào giỏ hàng:', emailWithoutDomain);

      // Hiển thị thông báo khi thêm vào giỏ hàng thành công
      ToastAndroid.show('Đã thêm sản phẩm vào giỏ hàng!', ToastAndroid.SHORT);
      
      // Điều hướng người dùng đến trang giỏ hàng hoặc trang cần thiết khác
      navigation.navigate('Cart', { email: emailWithoutDomain }); // Thay 'CartScreen' bằng tên màn hình giỏ hàng của bạn
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
      // Xử lý lỗi nếu cần thiết
    }
  };

  return (
    <TouchableOpacity onPress={handleAddToCart} style={styles.button}>
      <Text style={styles.buttonText}>Thêm vào giỏ hàng</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#F26398',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default AddToCartComponent;
