import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Modal, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, fetchUser, updateUser } from '../redux/slices/HeaderSlice';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const InforScreen = ({ route }) => {
    const { email } = route.params;
    const dispatch = useDispatch();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [fullName, setFullName] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const navigation = useNavigation();

    const { users, status, error } = useSelector((state) => state.users);
    const user = users[email];

    useEffect(() => {
        dispatch(fetchUser(email));
    }, [dispatch, email]);

    useEffect(() => {
        if (user) {
            setPhoneNumber(user.phoneNumber || '');
            setFullName(user.fullName || '');
            setAvatar(user.avatar || null);
            setIsEditing(true);
        }
    }, [user]);

    const handleChoosePhoto = () => {
        const options = {
            noData: true,
        };
        launchImageLibrary(options, response => {
            if (response.assets) {
                setAvatar(response.assets[0].uri);
            }
        });
    };

    const handleSave = () => {
        const userData = { phoneNumber, fullName, avatar, email };
        if (isEditing) {
            dispatch(updateUser({ email, userData }));
            Alert.alert('Cập nhật thành công');
        } else {
            dispatch(addUser({ email, userData }));
            Alert.alert('Đã hoàn thiện hồ sơ');
        }
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../img/back.png')} style={{ width: 20, height: 20, marginRight: 10 }} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
                <TouchableOpacity style={{ marginLeft: 'auto' }}
                            onPress={()=>navigation.navigate('LoginScreen')}
                        >
                            <Text style={styles.headerTitle}>Đăng xuất</Text>
                        </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <TouchableOpacity onPress={handleChoosePhoto} style={styles.avatarContainer}>
                    <Image
                        source={avatar ? { uri: avatar } : require('../img/person.png')}
                        style={styles.avatar}
                    />
                </TouchableOpacity>
                <View style={styles.infoCard}>
                    <TextInput
                        style={styles.input}
                        placeholder="Họ và tên"
                        value={fullName}
                        onChangeText={setFullName}
                        editable={false}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Số điện thoại"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
                        editable={false}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={`${email}@gmail.com`}
                        editable={false}
                        selectTextOnFocus={false}
                    />
                </View>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.editButtonText}>{isEditing ? 'Chỉnh sửa' : 'Hoàn thiện'}</Text>
                </TouchableOpacity>
            </View>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TextInput
                            style={styles.input}
                            placeholder="Họ và tên"
                            value={fullName}
                            onChangeText={setFullName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Số điện thoại"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            keyboardType="phone-pad"
                        />
                        <TouchableOpacity
                            style={styles.saveButton}
                            onPress={handleSave}
                        >
                            <Text style={styles.saveButtonText}>Lưu</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.cancelButtonText}>Hủy</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default InforScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    header: {
        backgroundColor: '#F26398',
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 16,
    },
    content: {
        flex: 1,
        padding: 16,
        alignItems: 'center',
    },
    avatarContainer: {
        marginBottom: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    infoCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 16,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        borderRadius: 5,
    },
    editButton: {
        backgroundColor: '#F26398',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
        width: '100%',
    },
    editButtonText: {
        color: 'white',
        fontSize: 18,
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
        width: 300,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    saveButton: {
        backgroundColor: '#F26398',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: 100,
        marginTop: 20,
    },
    
    cancelButton: {
        backgroundColor: 'gray',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: 100,
        marginTop: 10,
    },
    cancelButtonText: {
        color: 'white',
        fontSize: 18,
    },
});
