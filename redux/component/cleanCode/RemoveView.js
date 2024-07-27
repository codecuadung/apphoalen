import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { useDispatch } from 'react-redux';
import { removeProduct } from '../../slices/CartSlice'; // Đảm bảo đường dẫn đúng

const RemoveView = ({ product, email }) => {
  const dispatch = useDispatch();

  const handleRemove = () => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn xóa sản phẩm này không?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Xóa',
          onPress: () => dispatch(removeProduct({ email, productId: product.id })),
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <TouchableOpacity onPress={handleRemove} style={styles.removeButton}>
      <Text style={styles.removeText}>Xóa</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  removeButton: {
    backgroundColor: '#F26398',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  removeText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default RemoveView;
