import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';

// Thunk để thêm đơn hàng
export const addToOrder = createAsyncThunk(
    'order/addToOrder',
    async ({ email, order }, { rejectWithValue }) => {
        try {
            const currentDate = new Date().toISOString(); // Ngày tháng năm hiện tại
            const orderWithDateAndStatus = {
                ...order,
                id: firestore().collection('OderUsers').doc().id, // Tạo ID duy nhất cho đơn hàng
                date: currentDate,
                statusProduct: 'Đang giao',
            };

            await firestore().collection('OderUsers').doc(email).set({
                orders: firestore.FieldValue.arrayUnion(orderWithDateAndStatus),
            }, { merge: true });

            return orderWithDateAndStatus;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Thunk để cập nhật trạng thái đơn hàng
export const updateOrderStatus = createAsyncThunk(
    'order/updateOrderStatus',
    async ({ orderId, statusProduct }, { rejectWithValue }) => {
        try {
            const ordersSnapshot = await firestore().collection('OderUsers').get();
            
            let email = null;
            let orderToUpdate = null;

            ordersSnapshot.forEach((userDoc) => {
                const orders = userDoc.data().orders;
                const foundOrder = orders.find((order) => order.id === orderId);
                if (foundOrder) {
                    email = userDoc.id;
                    orderToUpdate = foundOrder;
                }
            });

            if (!email || !orderToUpdate) {
                throw new Error('Order not found');
            }

            const updatedOrder = { ...orderToUpdate, statusProduct };

            await firestore().collection('OderUsers').doc(email).update({
                orders: firestore.FieldValue.arrayRemove(orderToUpdate)
            });

            await firestore().collection('OderUsers').doc(email).update({
                orders: firestore.FieldValue.arrayUnion(updatedOrder)
            });

            return { orderId, statusProduct };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Thunk để lấy đơn hàng theo email
export const fetchOrder = createAsyncThunk(
    'order/fetchOrder',
    async ({ email, role }, { dispatch, rejectWithValue }) => {
        try {
            if (role === 'admin') {
                const allOrders = await dispatch(fetchAllOrders()).unwrap();
                return allOrders;
            }

            const userOrderRef = firestore().collection('OderUsers').doc(email);
            const snapshot = await userOrderRef.get();
            const data = snapshot.data();
            const orders = data ? data.orders : [];
            return orders;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Thunk để lấy tất cả đơn hàng
export const fetchAllOrders = createAsyncThunk(
    'order/fetchAllOrders',
    async (_, { rejectWithValue }) => {
        try {
            const usersSnapshot = await firestore().collection('OderUsers').get();
            const allOrders = [];

            usersSnapshot.forEach((userDoc) => {
                const userData = userDoc.data();
                if (userData.orders) {
                    allOrders.push(...userData.orders);
                }
            });

            return allOrders;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        orders: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addToOrder.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(addToOrder.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.orders.push(action.payload);
            })
            .addCase(addToOrder.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchOrder.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchOrder.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.orders = action.payload; // action.payload là mảng đơn hàng
            })
            .addCase(fetchOrder.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchAllOrders.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.orders = action.payload; // action.payload là mảng tất cả đơn hàng
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(updateOrderStatus.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const { orderId, statusProduct } = action.payload;
                const existingOrder = state.orders.find((order) => order.id === orderId);
                if (existingOrder) {
                    existingOrder.statusProduct = statusProduct;
                }
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default orderSlice.reducer;
