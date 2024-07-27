import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';

// Sửa sản phẩm
export const updateProduct = createAsyncThunk(
  'UDSanPham/updateProduct',
  async (product, { rejectWithValue }) => {
    try {
      await firestore().collection('SanPham').doc(product.id).update(product);
      return product;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  },
);

// Xóa 1 sản phẩm
export const deleteProduct = createAsyncThunk(
  'UDSanPham/deleteProduct',
  async (productId, { rejectWithValue }) => {
    try {
      await firestore().collection('SanPham').doc(productId).delete();
      return productId;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  },
);

const CRUDSlice = createSlice({
  name: 'UDSanPham',
  initialState: {
    items: [], // Danh sách sản phẩm
    status: 'idle', // Trạng thái mặc định
    error: null, // Lỗi nếu có
  },
  reducers: {}, // Các reducers khác nếu có
  extraReducers: (builder) => {
    builder
      .addCase(updateProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default CRUDSlice.reducer;
