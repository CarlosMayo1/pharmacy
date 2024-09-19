import { configureStore } from '@reduxjs/toolkit'
import warehouseReducer from './warehouseSlice/warehouseSlice'

export default configureStore({
	reducer: {
		warehouseReducer,
	},
})
