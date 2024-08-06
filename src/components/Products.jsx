import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase.client'

// Supabase
const fetchProducts = async () => {
	const { error, data } = await supabase
		.from('products')
		.select(
			'productId, productName, productAmount, productExpirationDate, productObservations, productCategory(productCategoryId, productCategoryName), productType(productTypeId, productTypeName), productBrand(productBrandId, productBrandName)',
		)
	return data
}

const Products = () => {
	const [products, setProducts] = useState([])

	useEffect(() => {
		fetchProducts().then(response => {
			console.log(response)
			setProducts(response)
		})
	}, [])

	return (
		<section>
			<h1 className='text-lg py-2 font-bold'>Lista de productos</h1>
			<div>
				<p>Cantidad de productos totales 21</p>
				<p>Productos pendientes por almacenar 4</p>
			</div>
			<table className='border border-black'>
				<thead>
					<tr>
						<th className='border border-black'>Nombre</th>
						<th className='border border-black'>Categoría</th>
						<th className='border border-black'>Tipo</th>
						<th className='border border-black'>Marca</th>
						<th className='border border-black'>Cantidad</th>
						<th className='border border-black'>Fecha de vencimiento</th>
						<th className='border border-black'>Observaciones</th>
					</tr>
				</thead>
				<tbody>
					{products.map(product => (
						<tr key={product.productId}>
							<td className='border border-black'>{product.productName}</td>
							<td className='border border-black'>
								{product.productCategory.productCategoryName}
							</td>
							<td className='border border-black'>
								{product.productType.productTypeName}
							</td>
							<td className='border border-black'>
								{product.productBrand.productBrandName}
							</td>
							<td className='border border-black'>{product.productAmount}</td>
							<td className='border border-black'>
								{product.productExpirationDate}
							</td>
							<td className='border border-black'>
								{product.productObservations}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</section>
	)
}

export default Products
