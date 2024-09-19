import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	productsToBeStored: [],
	availableContainers: [],
	productsInSelectedContainer: [],
	selectedContainerInfo: {},
	selectedProductToBeMoved: {},
	formMessage: {},
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
	},
})

export default warehouseSlice.reducer
export const warehouseSliceAction = warehouseSlice.actions
