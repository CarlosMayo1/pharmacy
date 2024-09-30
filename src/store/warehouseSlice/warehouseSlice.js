import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	productsToBeStored: [],
	availableContainers: [],
	productsInSelectedContainer: [],
	selectedContainerInfo: {},
	selectedProductToBeMoved: {},
	formMessage: {},
	products: [],
	dispatchOrders: [],
	productsToBeDispatched: [],
	dispatchedProducts: [],
}

const warehouseSlice = createSlice({
	name: 'warehouse',
	initialState,
	reducers: {
		productsToBeStored(state, action) {
			state.productsToBeStored = action.payload
		},
		availableContainers(state, action) {
			state.availableContainers = action.payload
		},
		productsInSelectedContainer(state, action) {
			state.productsInSelectedContainer = action.payload
		},
		selectedContainerInfo(state, action) {
			state.selectedContainerInfo = action.payload
		},
		selectedProductToBeMoved(state, action) {
			state.selectedProductToBeMoved = action.payload
		},
		showFormMessage(state, action) {
			state.formMessage = action.payload
		},
		products(state, action) {
			state.products = action.payload
		},
		dispatchOrders(state, action) {
			state.dispatchOrders = action.payload
		},
		productsToBeDispatched(state, action) {
			const listOfProducts = [...state.productsToBeDispatched]
			listOfProducts.push(action.payload)
			state.productsToBeDispatched = listOfProducts
		},
		dispatchedProducts(state, action) {
			state.dispatchedProducts = action.payload
		},
	},
})

export default warehouseSlice.reducer
export const warehouseSliceAction = warehouseSlice.actions
