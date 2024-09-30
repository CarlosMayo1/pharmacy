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

export const fetchProductsWithAllInfo = async () => {
	const { data, error } = await supabase
		.from('product_container')
		.select(
			'productContainerId, productContainerAmount, containers:containerId(containerId,containerCode), products:productId(productId, productName, productExpirationDate, productType(productTypeId, productTypeName), productCategory(productCategoryId, productCategoryName))',
		)
		.neq('productContainerAmount', 0)

	// orders data alphabetically
	const sortedData = data.sort((a, b) =>
		a.products.productName.localeCompare(b.products.productName),
	)
	return sortedData
}

export const fetchAvailableContainers = async () => {
	const { data, error } = await supabase
		.from('containers')
		.select('containerId, containerCode')
		.neq('status', 0)
	return data
}

export const fetchProductsInSelectedContainer = async containerId => {
	const { data, error } = await supabase
		.from('product_container')
		.select(
			'productContainerId, containerId, productId, products:productTypeId(productName, productExpirationDate), productContainerAmount',
		)
		.eq('containerId', containerId)
	return data
}

export const fectchProductInSelectedContainer = async (
	productId,
	containerId,
) => {
	const { data, error } = await supabase
		.from('product_container')
		.select(
			'productContainerId, containerId, products:productId(productId, productName, productExpirationDate), containers:containerId(containerId,containerCode), productContainerAmount',
		)
		.eq('containerId', containerId)
		.eq('productId', productId)
	return data
}

export const fetchProductAmountInContainers = async productId => {
	const { data, error } = await supabase
		.from('product_container')
		.select('productContainerAmount')
		.eq('productId', productId)
	return data
}

export const fetchWarehouseDispatchOrders = async () => {
	const { error } = await supabase.from('warehouseDispatchOrders').select()
	return error
}

export const fetchWarehouseDispatchDetail = async () => {
	const { data, error } = await supabase
		.from('warehouseDispatchOrderDetail')
		.select(
			'orderId, orderDetailId, products:productId(productId, productName, productExpirationDate), containers:containerId(containerId, containerCode), productAmount',
		)

	return data
}

export const fetchExistingDispatchedProduct = async (
	orderId,
	productId,
	containerId,
) => {
	const { data, error } = await supabase
		.from('warehouseDispatchOrderDetail')
		.select('orderDetailId, orderId, productId, containerId, productAmount')
		.eq('orderId', orderId)
		.eq('productId', productId)
		.eq('containerId', containerId)
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

export const insertDispatchOrder = async order => {
	const { data, error } = await supabase
		.from('warehouseDispatchOrders')
		.insert(order)
		.select()
	return data
}

export const insertDispatchOrderDetail = async detail => {
	const { data, error } = await supabase
		.from('warehouseDispatchOrderDetail')
		.insert(detail)
	return data
}

export const insertDispatchedProduct = async product => {
	const { data, error } = await supabase
		.from('dispatchedProducts')
		.insert(product)
	return data
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

export const updateExistingDispatchedProductAmount = async (
	orderId,
	productId,
	containerId,
	productAmount,
) => {
	const { data, error } = await supabase
		.from('warehouseDispatchOrderDetail')
		.update({ productAmount: productAmount })
		.eq('orderId', orderId)
		.eq('productId', productId)
		.eq('containerId', containerId)
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

export const deleteDispatchedProduct = async orderDetailId => {
	const response = await supabase
		.from('warehouseDispatchOrderDetail')
		.delete()
		.eq('orderDetailId', orderDetailId)
	return response
}
