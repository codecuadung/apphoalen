import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';

// Thêm sản phẩm
export const addProduct = createAsyncThunk(
  'SanPham/addProduct',
  async (product, { rejectWithValue }) => {
    try {
      await firestore().collection('SanPham').add(product);
      return product;
    } catch (error) {
      return rejectWithValue(error);
      console.log(error);
    }
  },
);

// Get all products
export const fetchProducts = createAsyncThunk(
  'SanPham/fetchProducts',
  async () => {
    const snapshot = await firestore().collection('SanPham').get();
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return products;
  },
);

// Get products by kieuSP
export const fetchProductsByKieuSP = createAsyncThunk(
  'SanPham/fetchProductsByKieuSP',
  async kieuSP => {
    const snapshot = await firestore()
      .collection('SanPham')
      .where('kieuSP', '==', kieuSP)
      .get();
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return products;
  },
);

// Get products by loaiSP
export const fetchProductsByLoaiSP = createAsyncThunk(
  'SanPham/fetchProductsByLoaiSP',
  async loaiSP => {
    const snapshot = await firestore()
      .collection('SanPham')
      .where('loaiSP', '==', loaiSP)
      .get();
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return products;
  },
);

const productSlice = createSlice({
  name: 'SanPham',
  initialState: {
    items: [],
    filteredItems: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    clearProducts(state) {
      state.items = [];
      state.filteredItems = [];
      state.status = 'idle';
    },
  },
  extraReducers: builder => {
    builder
      .addCase(addProduct.pending, state => {
        state.status = 'loading';
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchProducts.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchProductsByKieuSP.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchProductsByKieuSP.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.filteredItems = action.payload;
      })
      .addCase(fetchProductsByKieuSP.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchProductsByLoaiSP.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchProductsByLoaiSP.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.filteredItems = action.payload;
      })
      .addCase(fetchProductsByLoaiSP.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { clearProducts } = productSlice.actions;

export default productSlice.reducer;
