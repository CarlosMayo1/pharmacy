import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchStoreProducts } from '../../utils/shop/shop'
import { shopSliceAction } from '../../store/shop/shopSlice'

const Shop = () => {
	const products = useSelector(state => state.shopReducer.products)
	const dispatch = useDispatch()

	// ==============================
	// SUPABASE FUNCTIONS
	// ==============================
	const fetchProductsFromTheShop = async () => {
		try {
			const products = await fetchStoreProducts()
			console.log(products)
			dispatch(shopSliceAction.products(products))
		} catch (error) {
			throw new Error(error)
		}
	}

	// ==============================
	// APP FUNCTIONS
	// ==============================

	const getFormattedDate = date => {
		const newDate = date.split('-')
		const currentDate = [newDate[2], newDate[1], newDate[0]]
		return currentDate.join('/')
	}

	useEffect(() => {
		fetchProductsFromTheShop()
	}, [])

	return (
		<section>
			<h1 className='font-bold text-lg mb-2'>Ventas</h1>
			<table className='border-collapse table-fixed'>
				<thead>
					<tr>
						<th className='border border-black text-sm w-96'>Nombre</th>
						<th className='border border-black text-sm w-72'>Tipo</th>
						<th className='border border-black text-sm w-32'>Precio</th>
						<th className='border border-black text-sm w-32'>Marca</th>
						<th className='border border-black text-sm w-72'>
							Especificaciones
						</th>
						<th className='border border-black text-sm w-96'>Indicaciones</th>
						<th className='border border-black text-sm w-24'>Vencimiento</th>
						<th className='border border-black text-sm w-24'>Disponible</th>
						<th className='border border-black text-sm w-72'>Observaciones</th>
						<th className='border border-black text-sm'>Acción</th>
					</tr>
				</thead>
				<tbody>
					{products.map(product => (
						<tr key={product.storeId}>
							<td className='border border-black text-sm p-1 font-mediumtext-center'>
								{product.products.productName}
							</td>
							<td className='border border-black text-sm p-1 text-center'>
								{product.products.productType.productTypeName}
							</td>

							<td className='border border-black text-sm p-1 text-center'>
								{product.products.productBrand.productBrandName}
							</td>
							<td className='border border-black text-sm p-1 font-medium'>
								S/ {product.products.productPrice.toFixed(2)}
							</td>
							<td className='border border-black text-sm p-1'>
								{product.products.productSpecifications}
							</td>
							<td className='border border-black text-sm p-1'>
								{product.products.productIndications}
							</td>

							<td className='border border-black p-1 text-sm text-center'>
								{getFormattedDate(product.products.productExpirationDate)}
							</td>
							<td className='border border-black p-2 text-sm text-center'>
								{product.productAmount}
							</td>
							<td className='border border-black text-sm p-1 '>
								{product.observations}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</section>
	)
}

export default Shop
