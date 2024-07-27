import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Modal ,Alert} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native'; 
import { fetchCart, increaseQuantity, decreaseQuantity, selectCartItems } from '../slices/CartSlice';
import { fetchUser } from '../slices/HeaderSlice';
import RemoveView from './cleanCode/RemoveView';

const CartComponent = ({ email }) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const items = useSelector(selectCartItems);
    const status = useSelector(state => state.cart.status);
    const error = useSelector(state => state.cart.error);

    const [modalVisible, setModalVisible] = useState(false);
    const [paymentOption, setPaymentOption] = useState(null);
    const [fetchUserStatus, setFetchUserStatus] = useState('idle');
    const [itemOrder, setItemOrder] = useState(null);

    useEffect(() => {
        if (email) {
            dispatch(fetchCart(email));
        }
    }, [email, dispatch]);

    useEffect(() => {
        if (fetchUserStatus === 'succeeded') {
            navigation.navigate('OrderUserScreen', { itemOrder, user });
        } else if (fetchUserStatus === 'failed') {
            Alert.alert('Vui lòng hoàn thiện hồ sơ trước khi đặt hàng');
            navigation.navigate('InforScreen', { email });
        }
    }, [fetchUserStatus, email, items, user, navigation]);

    const handleIncrease = (productId) => {
        dispatch(increaseQuantity({ email, productId }));
    };

    const handleDecrease = (productId) => {
        dispatch(decreaseQuantity({ email, productId }));
    };

    const handleOrderPress = (item) => {
        setItemOrder(item); 
        setModalVisible(true);
    };
    

    const handleCloseModal = () => {
        setModalVisible(false);
        setPaymentOption(null);
    };

    const { users } = useSelector(state => state.users);
    const user = users[email];

    const handlePlaceOrder = async () => {
        setFetchUserStatus('loading');
        try {
            await dispatch(fetchUser(email)).unwrap();
            setFetchUserStatus('succeeded');
            navigation.navigate('OrderUserScreen', { itemOrder, user });
        } catch (error) {
            setFetchUserStatus('failed');
        }
        setModalVisible(false);
    };
    

    const renderItem = ({ item }) => {
        const thanhTien = item.giaSP * item.count;
    
        return (
            <View style={styles.itemContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <Image style={styles.image} source={{ uri: item.image }} />
                    <Text style={[{ marginLeft: 10, width: 190, color: '#F26398' }, styles.text]}>{item.tenSP}</Text>
                </View>
                <Text style={[ styles.text]}>Giá: {item.giaSP}đ</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', color: '#F26398', fontSize: 20 }}>Số lượng:</Text>
                        <TouchableOpacity onPress={() => handleDecrease(item.id)} style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }}>
                            <Image style={{ width: 20, height: 20 }} source={require('../../img/tru.png')} />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', marginHorizontal: 10, width: 24, textAlign: 'center' }}>{item.count}</Text>
                        <TouchableOpacity onPress={() => handleIncrease(item.id)} style={{ width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }}>
                            <Image style={{ width: 20, height: 20 }} source={require('../../img/cong.png')} />
                        </TouchableOpacity>
                    </View>
                    <RemoveView product={item} email={email} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={styles.text}>Thành tiền: {thanhTien}đ</Text>
                    <TouchableOpacity onPress={() => handleOrderPress(item)} style={{ backgroundColor: '#F26398', padding: 10, borderRadius: 5, alignItems: 'center' }}>
                        <Text style={[styles.text, { color: 'white' }]}>Đặt hàng</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    
    return (
        <View style={styles.container}>
            {status === 'loading' && <Text>Loading...</Text>}
            {status === 'failed' && <Text>Error: {error || 'Something went wrong'}</Text>}
            {status === 'succeeded' && (
                <>
                    <Text style={{ fontSize: 24, fontWeight: 'bold',marginBottom: 16,textAlign: 'center'}}>Danh sách giỏ hàng</Text>
                    <FlatList
                        data={items}
                        keyExtractor={item => item.id}
                        renderItem={renderItem}
                    />
                </>
            )}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {paymentOption === null ? (
                            <>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={() => setPaymentOption('online')}
                                >
                                    <Text style={styles.modalButtonText}>Thanh toán online</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={handlePlaceOrder}
                                >
                                    <Text style={styles.modalButtonText}>Thanh toán sau</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            paymentOption === 'online' ? (
                                <Image style={styles.qrCodeImage} source={require('../../img/qrcode.png')} />
                            ) : (
                                <Text style={styles.modalButtonText}>Chọn thanh toán sau.</Text>
                            )
                        )}
                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: 'red' }]}
                            onPress={handleCloseModal}
                        >
                            <Text style={styles.modalButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    itemContainer: {
        marginBottom: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        backgroundColor: 'white',
    },
    text: {
        fontSize: 18,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalButton: {
        backgroundColor: '#F26398',
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        alignItems: 'center',
        width: 200,
    },
    modalButtonText: {
        color: 'white',
        fontSize: 18,
    },
    qrCodeImage: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
});

export default CartComponent;
