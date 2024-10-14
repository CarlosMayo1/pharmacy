import { configureStore } from '@reduxjs/toolkit'
import warehouseReducer from './warehouseSlice/warehouseSlice'
import productReducer from './productSlice/productSlice'
import shopReducer from './shop/shopSlice'

export default configureStore({
	reducer: {
		warehouseReducer,
		productReducer,
		shopReducer,
	},
})
