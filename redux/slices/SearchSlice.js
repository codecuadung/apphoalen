import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import firestore from '@react-native-firebase/firestore';

// Thunk để tìm kiếm sản phẩm
export const searchProduct = createAsyncThunk(
    'search/searchProduct',
    async (searchTerm, { rejectWithValue }) => {
        try {
            const snapshot = await firestore().collection('SanPham').get();
            const products = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id // Thêm id từ doc.id
            }));
            const filteredItems = products.filter(product => {
                console.log(product.id); // Log id để kiểm tra giá trị
                return product.tenSP.toLowerCase().startsWith(searchTerm.toLowerCase());
            });
            
            return filteredItems;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);


// Slice để quản lý trạng thái tìm kiếm
const searchSlice = createSlice({
    name: 'search',
    initialState: {
        products: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(searchProduct.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(searchProduct.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.products = action.payload;
            })
            .addCase(searchProduct.rejected, (state, action) => {  // Sửa lỗi ở đây
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default searchSlice.reducer;
