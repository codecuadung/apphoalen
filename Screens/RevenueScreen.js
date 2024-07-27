import React, { useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Button, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { useDispatch, useSelector } from 'react-redux';
import { calculateRevenue } from '../redux/slices/RevenueSlice';
import { Image } from 'react-native-elements';

const RevenueScreen = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [openEndDatePicker, setOpenEndDatePicker] = useState(false);
  const dispatch = useDispatch();
  const { totalRevenue, status, error } = useSelector((state) => state.revenue);

  const handleCalculateRevenue = () => {
    dispatch(calculateRevenue({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    }));
  };

  if (status === 'loading') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#FF714B" />
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

  return (
    <View style={styles.container}>
      <Image source={require('../img/revenue2.png')} style={styles.logo}/>
      <Text style={styles.text}>Doanh thu</Text>
      <TouchableOpacity style={styles.dateButton} onPress={() => setOpenStartDatePicker(true)}>
        <Text style={styles.buttonText}>{`Từ ngày: ${startDate.toISOString().split('T')[0]}`}</Text>
      </TouchableOpacity>
      <DatePicker
        modal
        mode="date"
        open={openStartDatePicker}
        date={startDate}
        onConfirm={(date) => {
          setOpenStartDatePicker(false);
          setStartDate(date);
        }}
        onCancel={() => setOpenStartDatePicker(false)}
      />
      <TouchableOpacity style={styles.dateButton} onPress={() => setOpenEndDatePicker(true)}>
        <Text style={styles.buttonText}>{`Đến ngày: ${endDate.toISOString().split('T')[0]}`}</Text>
      </TouchableOpacity>
      <DatePicker
        modal
        mode="date"
        open={openEndDatePicker}
        date={endDate}
        onConfirm={(date) => {
          setOpenEndDatePicker(false);
          setEndDate(date);
        }}
        onCancel={() => setOpenEndDatePicker(false)}
      />
      <TouchableOpacity style={styles.calculateButton} onPress={handleCalculateRevenue}>
        <Text style={styles.buttonText}>Xác nhận doanh thu</Text>
      </TouchableOpacity>
      {status === 'succeeded' && (
        <Text style={styles.revenue}>{`$${totalRevenue.toFixed(2)}`}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF714B',
    marginBottom: 20,
  },
  dateButton: {
    backgroundColor: '#FF714B',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  calculateButton: {
    backgroundColor: '#FF714B',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  revenue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#28a745',
    marginTop: 20,
  },
  error: {
    fontSize: 18,
    color: 'red',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});

export default RevenueScreen;
