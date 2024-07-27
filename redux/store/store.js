import {configureStore} from '@reduxjs/toolkit';
import productReducer from '../slices/ProductSlice';
import CRUDSlice from '../slices/CRUDSlice';
import CartSlice from '../slices/CartSlice'
import userReducer from '../slices/HeaderSlice'
import OrderUser from '../slices/OrderUser';
import RevenueSlice from '../slices/RevenueSlice';
import SearchSlice from '../slices/SearchSlice'

const store = configureStore({
    reducer:{
        SanPham:productReducer,
        UDSanPham:CRUDSlice,
        cart: CartSlice,
        users: userReducer,
        order: OrderUser,
        revenue: RevenueSlice,
        search: SearchSlice
    }
})
export default store