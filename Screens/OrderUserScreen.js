import { StyleSheet, Text, View, ScrollView, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToOrder } from '../redux/slices/OrderUser';
import { useNavigation } from '@react-navigation/native';

const OrderUserScreen = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Chuyển đổi items thành mảng nếu không phải là mảng
  const items = Array.isArray(route.params?.itemOrder) ? route.params.itemOrder : [route.params?.itemOrder];

  const user = route.params?.user || {};

  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!address) {
      newErrors.address = 'Địa chỉ là bắt buộc';
    }

    if (address.length < 10) {
      newErrors.address = 'Địa chỉ quá ngắn';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (validate()) {
      const order = {
        items,
        address,
        note,
      };

      // Kiểm tra các thuộc tính của user
      const email = user.email ? user.email : 'unknown@example.com';

      dispatch(addToOrder({ email, order }))
        .unwrap()
        .then(() => {
          Alert.alert("Đặt hàng thành công");
          navigation.navigate('Order', { email });
        })
        .catch((error) => {
          Alert.alert("Có lỗi xảy ra", error.toString());
        });
    } else {
      Alert.alert("Vui lòng kiểm tra lại thông tin");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
      <TouchableOpacity style={{marginBottom: 10}} onPress={()=>navigation.goBack()}>
              <Image source={require('../img/back.png')} style={{ width: 20, height: 20, marginRight: 10 }} />
            </TouchableOpacity>
        <Text style={styles.header}>Thông tin đặt hàng</Text>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Họ và tên:</Text>
          <Text style={styles.info}>{user?.fullName || 'Không có tên'}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Số điện thoại:</Text>
          <Text style={styles.info}>{user?.phoneNumber || 'Không có số điện thoại'}</Text>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.info}>{user?.email ? user.email + '@gmail.com' : 'Không có email'}</Text>
        </View>

        <Text style={styles.label}>Địa chỉ:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập địa chỉ"
          value={address}
          onChangeText={setAddress}
        />
        {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

        <Text style={styles.label}>Ghi chú:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nếu có"
          value={note}
          onChangeText={setNote}
        />

        <Text style={styles.header}>Sản phẩm trong giỏ hàng</Text>

        {items.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <Image style={styles.image} source={{ uri: item?.image || 'default_image_url' }} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemText}>Tên sản phẩm: {item?.tenSP || 'Tên sản phẩm không có'}</Text>
              <Text style={styles.itemText}>Loại sản phẩm: {item?.loaiSP || 'Loại sản phẩm không có'}</Text>
              <Text style={styles.itemText}>Giá: {item?.giaSP ? `${item.giaSP}đ` : 'Giá không có'}</Text>
            </View>
          </View>
        ))}

        <TouchableOpacity onPress={handlePlaceOrder} style={styles.orderButton}>
          <Text style={styles.orderButtonText}>Đặt hàng</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default OrderUserScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  info: {
    fontSize: 18,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    fontSize: 18,
    borderRadius: 5,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
  },
  orderButton: {
    backgroundColor: '#F26398',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  orderButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
