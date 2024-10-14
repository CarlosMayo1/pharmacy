import { supabase } from '../supabase.client'
// ==============================
// FETCH FUNCTIONS
// ==============================
export const fetchStoreProducts = async () => {
	const { data, error } = await supabase
		.from('store')
		.select(
			'storeId, products:productId(productId, productName, productPrice,productExpirationDate,productSpecifications, productIndications, productBrand:productBrandId(productBrandId, productBrandName),productType:productType(productTypeId, productTypeName)), productAmount, observations',
		)

	// orders data alphabetically
	const sortedData = data.sort((a, b) =>
		a.products.productName.localeCompare(b.products.productName),
	)
	return sortedData
}

export const fetchExistingProductInStore = async productId => {
	const { data, error } = await supabase
		.from('store')
		.select('storeId, productId, productAmount')
		.eq('productId', productId)
	return data
}

// ==============================
// INSERT FUNCTIONS
// ==============================
export const insertProductInShop = async newProduct => {
	const { data, error } = await supabase.from('store').insert(newProduct)
	return data
}

// ==============================
// UPDATE FUNCTIONS
// ==============================
export const updateProductInShop = async (productId, productAmount) => {
	const { error } = await supabase
		.from('store')
		.update({ productAmount: productAmount })
		.eq('productId', productId)
	return error
}
