import { supabase } from '../supabase.client'
// ==============================
// FETCH FUNCTIONS
// ==============================
export const fetchProducts = async () => {
	const { data, error } = await supabase
		.from('products')
		.select('productId, productName, productAmount, productExpirationDate')
		.neq('isStored', 1)
	return data
}

export const fetchAvailableContainers = async () => {
	const { data, error } = await supabase
		.from('containers')
		.select('containerId, containerCode')
		.neq('status', 0)
	return data
}

export const fetchProductsInSelectedContainer = async containerId => {
	const { error, data } = await supabase
		.from('product_container')
		.select(
			'productContainerId, containerId, productId, products(productName, productExpirationDate), productContainerAmount',
		)
		.eq('containerId', containerId)
	return data
}

export const fetchProductAmountInContainers = async productId => {
	const { error, data } = await supabase
		.from('product_container')
		.select('productContainerAmount')
		.eq('productId', productId)
	return data
}

// ==============================
// INSERT FUNCTIONS
// ==============================
export const insertProductByContainer = async storeProduct => {
	const { error } = await supabase
		.from('product_container')
		.insert(storeProduct)
	return error
}

// ==============================
// UPDATE FUNCTIONS
// ==============================
export const updateProductAmountInSelectedContainer = async (
	productId,
	containerId,
	productAmount,
) => {
	const { error } = await supabase
		.from('product_container')
		.update({ productContainerAmount: productAmount })
		.eq('productId', productId)
		.eq('containerId', containerId)
	return error
}

export const updateStatusOfStoreProducts = async (value, productId) => {
	const { error } = await supabase
		.from('products')
		.update({ isStored: value })
		.eq('productId', productId)
	return error
}

export const updateProductContainerCode = async (
	updatedContainerId,
	productContainerId,
) => {
	const { error } = await supabase
		.from('product_container')
		.update({ containerId: updatedContainerId })
		.eq('productContainerId', productContainerId)
	return error
}

// ==============================
// DELETE FUNCTIONS
// ==============================
export const deleteProductStoreInContainer = async productContainerId => {
	const response = await supabase
		.from('product_container')
		.delete()
		.eq('productContainerId', productContainerId)
	return response
}
