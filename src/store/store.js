import { configureStore } from '@reduxjs/toolkit'
import warehouseReducer from './warehouseSlice/warehouseSlice'
import productReducer from './productSlice/productSlice'

export default configureStore({
	reducer: {
		warehouseReducer,
		productReducer,
	},
})
