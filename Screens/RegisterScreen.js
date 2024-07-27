import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, KeyboardAvoidingView, Image, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import { Input } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Hàm để gọi API thiết lập Custom Claims
const setCustomClaims = async (uid, role) => {
  console.log(`Setting custom claims for UID: ${uid}, Role: ${role}`);
  try {
    const response = await fetch('http://10.0.2.2:3000/setCustomClaims', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uid, role }),
    });
    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.error('Error setting custom claims:', error);
  }
};

// Hàm đăng ký người dùng và thiết lập quyền
const signUpAndSetRole = async (email, password, setMessage) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    console.log('User registered successfully. UID:', userCredential.user.uid);
    await setCustomClaims(userCredential.user.uid, 'admin');
    setMessage('User registered successfully!');
    return true; // Trả về true nếu thành công
  } catch (error) {
    setMessage(error.message);
    return false; // Trả về false nếu thất bại
  }
};

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [message, setMessage] = useState('');

  const validate = () => {
    if (password !== confirmPassword) {
      Alert.alert('Mật khẩu phải trùng khớp!');
      return false; // Trả về false nếu có lỗi
    }
    if (email === "" || password === "" || confirmPassword === "") {
      Alert.alert('Vui lòng điền đầy đủ thông tin!');
      return false; // Trả về false nếu có lỗi
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      Alert.alert('Email không đúng định dạng!');
      return false; // Trả về false nếu có lỗi
    }
    if (password.length < 6) {
      Alert.alert('Mật khẩu phải có ít nhất 6 ký tự!');
      return false; // Trả về false nếu có lỗi
    }
    return true; // Trả về true nếu không có lỗi
  }

  const handleRegister = async () => {
    if (validate()) {
      const success = await signUpAndSetRole(email, password, setMessage);
      if (success) {
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('password', password);
        navigation.navigate('LoginScreen', { email, password });
      }
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center' }}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={{ uri: 'https://hoalenhandmade.com/wp-content/uploads/2023/06/cropped-logo-hoa-len-co-nem-trang.png.webp' }}
            style={{ width: 200, height: 200 }}
          />
          <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#FF714B', marginBottom: 20 }}>Đăng ký</Text>
        </View>
        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
          <Input
            onChangeText={setEmail}
            placeholder='Nhập email'
            style={styles.input}
          />
          <Input
            placeholder="Nhập mật khẩu"
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            rightIcon={
              <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                <Image source={passwordVisible ? require('../img/eyeOpen.png') : require('../img/eyeClose.png')} 
                  style={{ width: 24, height: 24,position: 'absolute', right: 10, top: 4 }} 
                />
              </TouchableOpacity>
            }
            style={styles.input}
          />
          <Input
            placeholder="Nhập lại mật khẩu"
            onChangeText={setConfirmPassword}
            secureTextEntry={!confirmPasswordVisible}
            rightIcon={
              <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                <Image source={confirmPasswordVisible ? require('../img/eyeOpen.png') : require('../img/eyeClose.png')} 
                  style={{ width: 24, height: 24,position: 'absolute', right: 10, top: 4 }} 
                />
              </TouchableOpacity>
            }
            style={styles.input}
          />
        </View>
        <View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={handleRegister} style={styles.button}>
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20 }}>Đăng ký</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center', justifyContent: 'center' }}>
            <View style={styles.line} />
            <Text style={styles.text}>or</Text>
            <View style={styles.line} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
            <Text>Bạn đã có tài khoản?</Text>
            <Text style={{ color: '#FF714B', marginLeft: 5 }} onPress={() => navigation.navigate('LoginScreen')}>Đăng nhập</Text>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  input: {
    width: 350,
    height: 60,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    marginTop: 10,
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 10,
    height: 50,
    backgroundColor: '#FF714B',
    width: 350,
  },
  line: {
    flex: 1,
    height: 1,
    marginTop: 15,
    backgroundColor: 'gray',
  },
  text: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
