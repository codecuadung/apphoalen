import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';

// Thunk để tính toán doanh thu trong khoảng thời gian
export const calculateRevenue = createAsyncThunk(
  'revenue/calculateRevenue',
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      const usersSnapshot = await firestore().collection('OderUsers').get();
      let totalRevenue = 0;

      // Kiểm tra ngày đầu và ngày cuối
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error('Invalid date format');
      }

      usersSnapshot.forEach((userDoc) => {
        const userData = userDoc.data();
        if (userData.orders) {
          userData.orders.forEach((order) => {
            const orderDate = new Date(order.date);

            if (
              order.statusProduct === 'Hoàn thành' &&
              orderDate >= start &&
              orderDate <= end
            ) {
              order.items.forEach((item) => {
                if (item.count && item.giaSP) { // Kiểm tra sự tồn tại của thuộc tính count và giaSP
                  totalRevenue += item.count * item.giaSP;
                }
              });
            }
          });
        }
      });

      return totalRevenue.toFixed(2); // Đảm bảo định dạng chính xác với 2 chữ số thập phân
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
const RevenueSlice = createSlice({
    name: 'revenue',
    initialState: {
      totalRevenue: 0,
      status: 'idle',
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(calculateRevenue.pending, (state) => {
          state.status = 'loading';
          state.error = null;
        })
        .addCase(calculateRevenue.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.totalRevenue = parseFloat(action.payload); // Chuyển đổi string sang số
        })
        .addCase(calculateRevenue.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        });
    },
  });
  
  export default RevenueSlice.reducer;
  