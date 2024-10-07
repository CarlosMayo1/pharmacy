import { supabase } from '../supabase.client'
// ==============================
// FETCH FUNCTIONS
// ==============================
export const fetchProducts = async () => {
	const { data, error } = await supabase
		.from('products')
		.select(
			'productId, productName, productType:productTypeId(productTypeId, productTypeName),productCategory:productCategoryId(productCategoryId, productCategoryName), productBrand:productBrandId(productBrandId, productBrandName), productExpirationDate,productObservations, productPrice, productAmount, productIndications, productSpecifications',
		)
		.order('productName', { ascending: true })
	return data
}

export const fetchProductType = async () => {
	const { data, error } = await supabase
		.from('productType')
		.select('productTypeId, productTypeName')
		.neq('status', 0)
		.order('productTypeName', { ascending: true })
	return data
}

export const fetchProductBrand = async () => {
	const { data, error } = await supabase
		.from('productBrand')
		.select('productBrandId, productBrandName')
		.neq('status', 0)
		.order('productBrandName', { ascending: true })
	return data
}

export const fetchProductCategory = async () => {
	const { data, error } = await supabase
		.from('productCategory')
		.select('productCategoryId, productCategoryName')
		.neq('status', 0)
		.order('productCategoryName', { ascending: true })
	return data
}

export const fetchExistingProduct = async productName => {
	const { data, error } = await supabase
		.from('products')
		.select('productId, productName')
		.eq('productName', productName)
	return data
}

export const fetchExistingProductBrand = async productBrandName => {
	const { data, error } = await supabase
		.from('productBrand')
		.select('productBrandId, productBrandName')
		.eq('productBrandName', productBrandName)
	return data
}

export const fetchExistingProductCategory = async productCategory => {
	const { data, error } = await supabase
		.from('productCategory')
		.select('productCategoryId, productCategoryName')
		.eq('productCategoryName', productCategory)
	return data
}

// ==============================
// INSERT FUNCTIONS
// ==============================
export const insertNewProduct = async product => {
	const { error } = await supabase.from('products').insert(product)
	return error
}

export const insertProductType = async productType => {
	const { error } = await supabase.from('productType').insert(productType)
	return error
}

export const insertProductBrand = async productBrand => {
	const { error } = await supabase.from('productBrand').insert(productBrand)
	return error
}

export const insertProductCategory = async productCategory => {
	const { error } = await supabase
		.from('productCategory')
		.insert(productCategory)
	return error
}

// ==============================
// UPDATE FUNCTIONS
// ==============================
export const updateProduct = async product => {
	const { error } = await supabase
		.from('products')
		.update({
			productName: product.productName,
			productExpirationDate: product.productExpirationDate,
			productAmount: product.productAmount,
			productPrice: product.productPrice,
			productTypeId: product.productTypeId,
			productBrandId: product.productBrandId,
			productCategoryId: product.productCategoryId,
			productSpecifications: product.productSpecifications,
			productIndications: product.productIndications,
			productObservations: product.productObservations,
		})
		.eq('productId', product.productId)
	return error
}
// ==============================
// DELETE FUNCTIONS
// ==============================
export const deleteProduct = async productId => {
	const error = await supabase
		.from('products')
		.delete()
		.eq('productId', productId)
	return error
}
