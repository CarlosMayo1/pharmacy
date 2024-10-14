import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	products: [],
}

const shopSlice = createSlice({
	name: 'shop',
	initialState,
	reducers: {
		products(state, action) {
			state.products = action.payload
		},
	},
})

export default shopSlice.reducer
export const shopSliceAction = shopSlice.actions
