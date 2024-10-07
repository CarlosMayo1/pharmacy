import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	products: [],
	productType: [],
	productBrand: [],
	productCategory: [],
	editProduct: null,
}
const productSlice = createSlice({
	name: 'product',
	initialState,
	reducers: {
		products(state, action) {
			state.products = action.payload
		},
		productType(state, action) {
			state.productType = action.payload
		},
		productBrand(state, action) {
			state.productBrand = action.payload
		},
		productCategory(state, action) {
			state.productCategory = action.payload
		},
		editProduct(state, action) {
			state.editProduct = action.payload
		},
	},
})

export default productSlice.reducer
export const productSliceAction = productSlice.actions
