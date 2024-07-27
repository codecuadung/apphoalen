import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';

// Thêm sản phẩm vào giỏ hàng của mỗi email
export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ email, product }, { rejectWithValue }) => {
        try {
            const userCartRef = firestore().collection('carts').doc(email).collection(email).doc(product.id);
            const doc = await userCartRef.get();

            if (doc.exists) {
                // Nếu sản phẩm đã tồn tại, tăng số lượng
                await userCartRef.update({ count: firestore.FieldValue.increment(product.count) });
            } else {
                // Nếu sản phẩm chưa tồn tại, thêm mới
                await userCartRef.set(product);
            }

            return product;
        } catch (error) {
            return rejectWithValue(error.message); // Chuyển lỗi thành chuỗi
        }
    }
);


// Lấy toàn bộ sản phẩm trong giỏ hàng của người dùng
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (email, { rejectWithValue }) => {
        try {
            const userCartRef = firestore().collection('carts').doc(email).collection(email);
            const snapshot = await userCartRef.get();
            const cart = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return cart;
        } catch (error) {
            return rejectWithValue(error.message); // Chuyển lỗi thành chuỗi
        }
    }
);
export const increaseQuantity = createAsyncThunk(
    'cart/increaseQuantity',
    async ({ email, productId }, { rejectWithValue }) => {
        try {
            const userCartRef = firestore().collection('carts').doc(email).collection(email);

            // Tìm tài liệu trong collection với trường 'id' bằng 'productId'
            const querySnapshot = await userCartRef.where('id', '==', productId).get();

            if (querySnapshot.empty) {
                throw new Error('Product not found in cart');
            }

            // Giả sử chỉ có một tài liệu thỏa mãn truy vấn
            const doc = querySnapshot.docs[0];
            await doc.ref.update({ count: firestore.FieldValue.increment(1) });

            return { productId, increment: 1 };
        } catch (error) {
            return rejectWithValue(error.message); // Chuyển lỗi thành chuỗi
        }
    }
);

export const decreaseQuantity = createAsyncThunk(
    'cart/decreaseQuantity',
    async ({ email, productId }, { rejectWithValue }) => {
        try {
            const userCartRef = firestore().collection('carts').doc(email).collection(email);

            // Tìm tài liệu trong collection với trường 'id' bằng 'productId'
            const querySnapshot = await userCartRef.where('id', '==', productId).get();

            if (querySnapshot.empty) {
                throw new Error('Product not found in cart');
            }

            // Giả sử chỉ có một tài liệu thỏa mãn truy vấn
            const doc = querySnapshot.docs[0];
            const currentCount = doc.data()?.count || 1;

            if (currentCount <= 1) {
                throw new Error('Quantity cannot be less than zero');
            }

            await doc.ref.update({ count: firestore.FieldValue.increment(-1) });
            return { productId, decrement: 1 };
        } catch (error) {
            return rejectWithValue(error.message); // Chuyển lỗi thành chuỗi
        }
    }
);
export const removeProduct = createAsyncThunk(
    'cart/removeProduct',
    async ({ email, productId }, { rejectWithValue }) => {
        try {
            const userCartRef = firestore().collection('carts').doc(email).collection(email);

            // Tìm tài liệu trong collection với trường 'id' bằng 'productId'
            const querySnapshot = await userCartRef.where('id', '==', productId).get();

            if (querySnapshot.empty) {
                throw new Error('Product not found in cart');
            }

            // Giả sử chỉ có một tài liệu thỏa mãn truy vấn
            const doc = querySnapshot.docs[0];
            await doc.ref.delete();

            return productId;
        } catch (error) {
            return rejectWithValue(error.message); // Chuyển lỗi thành chuỗi
        }
    }
);
export const removeAll = createAsyncThunk(
    'cart/removeAll',
    async (email, { rejectWithValue }) => {
        try {
            const userCartRef = firestore().collection('carts').doc(email).collection(email);
            const snapshot = await userCartRef.get();

            const batch = firestore().batch();
            snapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });

            await batch.commit();
        } catch (error) {
            return rejectWithValue(error.message); // Chuyển lỗi thành chuỗi
        }
    }
);

const CartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(addToCart.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Thêm hoặc cập nhật sản phẩm trong giỏ hàng
                const existingItem = state.items.find(item => item.id === action.payload.id);
                if (existingItem) {
                    existingItem.count += action.payload.count;
                } else {
                    state.items.push(action.payload);
                }
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchCart.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(increaseQuantity.fulfilled, (state, action) => {
                const { productId, increment } = action.payload;
                const item = state.items.find(item => item.id === productId);
                if (item) {
                    item.count += increment;
                }
            })
            .addCase(decreaseQuantity.fulfilled, (state, action) => {
                const { productId, decrement } = action.payload;
                const item = state.items.find(item => item.id === productId);
                if (item) {
                    item.count -= decrement;
                }
            })
            .addCase(removeProduct.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(removeProduct.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Xóa sản phẩm khỏi giỏ hàng
                state.items = state.items.filter(item => item.id !== action.payload);
            })
            .addCase(removeProduct.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(removeAll.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(removeAll.fulfilled, (state) => {
                state.status = 'succeeded';
                // Xóa tất cả sản phẩm khỏi giỏ hàng
                state.items = [];
            })
            .addCase(removeAll.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const selectCartItems = (state) => state.cart.items;
export default CartSlice.reducer;
