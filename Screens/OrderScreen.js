import React, { useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrder, fetchAllOrders, updateOrderStatus } from '../redux/slices/OrderUser';

const OrderScreen = ({ route }) => {
  const { email, role } = route.params || {};
  console.log("OrderScreen received email:", email);
  console.log("OrderScreen received role:", role);

  const dispatch = useDispatch();
  const { orders, status, error } = useSelector((state) => state.order);

  useEffect(() => {
    console.log("Dispatching fetch action with role:", role, "and email:", email);

    if (role === 'admin') {
      dispatch(fetchAllOrders());
    } else if (role === 'user') {
      dispatch(fetchOrder({ email }));
    }
  }, [dispatch, email, role]);

  const handleConfirm = (orderId) => {
    dispatch(updateOrderStatus({ orderId, statusProduct: 'Hoàn thành' }));
  };

  useEffect(() => {
    // Lắng nghe thay đổi trong orders và cập nhật giao diện
  }, [orders]);

  if (status === 'loading') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (status === 'failed') {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Error: {error}</Text>
      </View>
    );
  }

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderText}>Thời gian đặt hàng: {item.date}</Text>
      <Text style={styles.orderText}>Địa chỉ: {item.address}</Text>
      <Text style={styles.orderText}>Trạng thái: {item.statusProduct}</Text>
      <FlatList
        data={item.items}
        keyExtractor={(product, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Text style={styles.productText}>Tên sản phẩm: {item.tenSP}</Text>
            <Text style={styles.productText}>Số lượng: {item.count}</Text>
            <Text style={styles.productText}>Giá: {item.giaSP}đ</Text>
          </View>
        )}
      />
      {role === 'admin' && item.statusProduct !== 'Hoàn thành' && (
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={() => handleConfirm(item.id)}
        >
          <Text style={styles.confirmButtonText}>Xác nhận hoàn thành</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {role === 'admin' && <Text style={styles.text}>Danh sách đơn hàng</Text>}
      {role === 'user' && <Text style={styles.text}>Lịch sử đặt hàng</Text>}
      <FlatList
        data={orders}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderOrderItem}
        extraData={orders} // Thêm thuộc tính này để đảm bảo FlatList được cập nhật
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
  },
  orderItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  orderText: {
    fontSize: 16,
  },
  productItem: {
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  productText: {
    fontSize: 14,
  },
  error: {
    fontSize: 18,
    color: 'red',
  },
  confirmButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#28a745',
    borderRadius: 5,
  },
  confirmButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default OrderScreen;
