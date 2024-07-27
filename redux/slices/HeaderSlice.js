import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';

// Async thunk để thêm thông tin người dùng vào collection 'Persons'
export const addUser = createAsyncThunk(
  'users/addUser',
  async ({ email, userData }, { rejectWithValue }) => {
    try {
      await firestore().collection('Persons').doc(email).set(userData);
      return { email, userData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk để cập nhật thông tin người dùng vào collection 'Persons'
export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ email, userData }, { rejectWithValue }) => {
    try {
      await firestore().collection('Persons').doc(email).update(userData);
      return { email, userData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk để lấy thông tin người dùng từ collection 'Persons'
export const fetchUser = createAsyncThunk(
  'users/fetchUser',
  async (email, { rejectWithValue }) => {
    try {
      const userDoc = await firestore().collection('Persons').doc(email).get();
      if (userDoc.exists) {
        return { email, userData: userDoc.data() };
      } else {
        throw new Error('User does not exist');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: {},
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addUser.fulfilled, (state, action) => {
        const { email, userData } = action.payload;
        state.users[email] = userData;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const { email, userData } = action.payload;
        state.users[email] = userData;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        const { email, userData } = action.payload;
        state.users[email] = userData;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
