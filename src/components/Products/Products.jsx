import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase.client'
import { useForm } from 'react-hook-form'
import Spinner from '../UI/Spinner'
import ProductContainerModal from './ProductContainerModal'

// Supabase
const fetchProducts = async () => {
	const { error, data } = await supabase
		.from('product_container')
		.select(
			'productContainerId, productId, products:productId(productName, productExpirationDate, productBrand:productBrandId(productBrandId, productBrandName), productType:productTypeId(productTypeId, productTypeName), productObservations), containers:containerId(containerId, containerCode), productContainerAmount',
		)
	return data
}

const fetchFilteredProductsByName = async productName => {
	const { error, data } = await supabase
		.from('product_container')
		.select(
			'productContainerId, productId, products:productId(productName, productExpirationDate, productBrand:productBrandId(productBrandId, productBrandName), productType:productTypeId(productTypeId, productTypeName), productObservations), containers:containerId(containerId, containerCode), productContainerAmount',
		)
		.ilike('products.productName', `%${productName}%`)
	// .eq('containerId', containerId)

	return data
}

const fetchFilteredProductsByCode = async containerId => {
	const { error, data } = await supabase
		.from('product_container')
		.select(
			'productContainerId, productId, products:productId(productName, productExpirationDate, productBrand:productBrandId(productBrandId, productBrandName), productType:productTypeId(productTypeId, productTypeName), productObservations), containers:containerId(containerId, containerCode), productContainerAmount',
		)
		.eq('containerId', containerId)

	return data
}

const fetchFilteredProductsByDate = async date => {
	const { error, data } = await supabase
		.from('product_container')
		.select(
			'productContainerId, productId, products:productId(productName, productExpirationDate, productBrand:productBrandId(productBrandId, productBrandName), productType:productTypeId(productTypeId, productTypeName), productObservations), containers:containerId(containerId, containerCode), productContainerAmount',
		)
		.lte('products.productExpirationDate', date)

	return data
}

const fetchFilteredProductsByAmount = async amount => {
	const { error, data } = await supabase
		.from('product_container')
		.select(
			'productContainerId, productId, products:productId(productName, productExpirationDate, productBrand:productBrandId(productBrandId, productBrandName), productType:productTypeId(productTypeId, productTypeName), productObservations), containers:containerId(containerId, containerCode), productContainerAmount',
		)
		.lte('productContainerAmount', amount)

	return data
}

const fetchFilteredProductsByCodeAndName = async (containerId, productName) => {
	const { error, data } = await supabase
		.from('product_container')
		.select(
			'productContainerId, productId, products:productId(productName, productExpirationDate, productBrand:productBrandId(productBrandId, productBrandName), productType:productTypeId(productTypeId, productTypeName), productObservations), containers:containerId(containerId, containerCode), productContainerAmount',
		)
		.eq('containerId', containerId)
		.ilike('products.productName', `%${productName}%`)

	return data
}

const fetchFilteredProductsByCodeAndDate = async (
	containerId,
	productExpirationDate,
) => {
	const { error, data } = await supabase
		.from('product_container')
		.select(
			'productContainerId, productId, products:productId(productName, productExpirationDate, productBrand:productBrandId(productBrandId, productBrandName), productType:productTypeId(productTypeId, productTypeName), productObservations), containers:containerId(containerId, containerCode), productContainerAmount',
		)
		.eq('containerId', containerId)
		.lte('products.productExpirationDate', productExpirationDate)

	return data
}

const fetchFilteredProductsByCodeAndAmount = async (
	containerId,
	productContainerAmount,
) => {
	const { error, data } = await supabase
		.from('product_container')
		.select(
			'productContainerId, productId, products:productId(productName, productExpirationDate, productBrand:productBrandId(productBrandId, productBrandName), productType:productTypeId(productTypeId, productTypeName), productObservations), containers:containerId(containerId, containerCode), productContainerAmount',
		)
		.eq('containerId', containerId)
		.lte('productContainerAmount', productContainerAmount)

	return data
}

const fetchFilteredProductsByNameAndDate = async (
	productName,
	productExpirationDate,
) => {
	const { error, data } = await supabase
		.from('product_container')
		.select(
			'productContainerId, productId, products:productId(productName, productExpirationDate, productBrand:productBrandId(productBrandId, productBrandName), productType:productTypeId(productTypeId, productTypeName), productObservations), containers:containerId(containerId, containerCode), productContainerAmount',
		)
		.ilike('products.productName', `%${productName}%`)
		.lte('products.productExpirationDate', productExpirationDate)

	return data
}

const fetchFilteredProductsByNameAndAmount = async (
	productName,
	productContainerAmount,
) => {
	const { error, data } = await supabase
		.from('product_container')
		.select(
			'productContainerId, productId, products:productId(productName, productExpirationDate, productBrand:productBrandId(productBrandId, productBrandName), productType:productTypeId(productTypeId, productTypeName), productObservations), containers:containerId(containerId, containerCode), productContainerAmount',
		)
		.ilike('products.productName', `%${productName}%`)
		.lte('productContainerAmount', productContainerAmount)

	return data
}

const fetchFilteredProductsByNameDateAndAmount = async (
	productName,
	productExpirationDate,
	productContainerAmount,
) => {
	const { error, data } = await supabase
		.from('product_container')
		.select(
			'productContainerId, productId, products:productId(productName, productExpirationDate, productBrand:productBrandId(productBrandId, productBrandName), productType:productTypeId(productTypeId, productTypeName), productObservations), containers:containerId(containerId, containerCode), productContainerAmount',
		)
		.ilike('products.productName', `%${productName}%`)
		.lte('products.productExpirationDate', productExpirationDate)
		.lte('productContainerAmount', productContainerAmount)

	return data
}

const fetchFilteredProductsByDateAndAmount = async (
	productExpirationDate,
	productContainerAmount,
) => {
	const { error, data } = await supabase
		.from('product_container')
		.select(
			'productContainerId, productId, products:productId(productName, productExpirationDate, productBrand:productBrandId(productBrandId, productBrandName), productType:productTypeId(productTypeId, productTypeName), productObservations), containers:containerId(containerId, containerCode), productContainerAmount',
		)
		.lte('products.productExpirationDate', productExpirationDate)
		.lte('productContainerAmount', productContainerAmount)

	return data
}

const fetchFilteredProductsByAllFilters = async (
	productContainerCode,
	productName,
	productExpirationDate,
	productContainerAmount,
) => {
	const { error, data } = await supabase
		.from('product_container')
		.select(
			'productContainerId, productId, products:productId(productName, productExpirationDate, productBrand:productBrandId(productBrandId, productBrandName), productType:productTypeId(productTypeId, productTypeName), productObservations), containers:containerId(containerId, containerCode), productContainerAmount',
		)
		.eq('containerId', productContainerCode)
		.ilike('products.productName', `%${productName}%`)
		.lte('products.productExpirationDate', productExpirationDate)
		.lte('productContainerAmount', productContainerAmount)

	return data
}

const fetchContainers = async () => {
	const { error, data } = await supabase.from('containers').select()
	return data
}

const Products = () => {
	const [products, setProducts] = useState([])
	const [containers, setContainers] = useState([])
	const [selectedProduct, setSelectedProduct] = useState({})
	const [loading, setLoading] = useState(true)
	const [showContainerModal, setShowContainerModal] = useState(false)
	const { handleSubmit, register } = useForm()

	const onFilteredProductsHandler = handleSubmit(data => {
		setLoading(true)
		// fiilter by container code
		if (
			data.filterByCode !== '' &&
			data.filterByName === '' &&
			data.filterByAmount === '' &&
			data.filterByDate === ''
		) {
			fetchFilteredProductsByCode(data.filterByCode).then(response =>
				setProducts(response),
			)
		}

		// filter by name of the product
		if (
			data.filterByCode === '' &&
			data.filterByName !== '' &&
			data.filterByAmount === '' &&
			data.filterByDate === ''
		) {
			fetchFilteredProductsByName(data.filterByName).then(response => {
				// avoids fetching null products
				const listOfFilteredProducts = response.filter(
					product => product.products !== null,
				)
				setProducts(listOfFilteredProducts)
			})
		}

		// filter by date
		if (
			data.filterByCode === '' &&
			data.filterByName === '' &&
			data.filterByDate !== '' &&
			data.filterByAmount === ''
		) {
			fetchFilteredProductsByDate(data.filterByDate).then(response => {
				// avoids fetching null products
				const listOfFilteredProducts = response.filter(
					product => product.products !== null,
				)
				setProducts(listOfFilteredProducts)
			})
		}

		// filter by amount
		if (
			data.filterByCode === '' &&
			data.filterByName === '' &&
			data.filterByDate === '' &&
			data.filterByAmount !== ''
		) {
			fetchFilteredProductsByAmount(data.filterByAmount).then(response => {
				setProducts(response)
			})
		}

		// filter by code and product name
		if (
			data.filterByCode !== '' &&
			data.filterByName !== '' &&
			data.filterByAmount === '' &&
			data.filterByDate === ''
		) {
			fetchFilteredProductsByCodeAndName(
				data.filterByCode,
				data.filterByName,
			).then(response => {
				// avoids fetching null products
				const filteredListOfProducts = response.filter(
					product => product.products !== null,
				)
				setProducts(filteredListOfProducts)
			})
		}

		// filter by code and date
		if (
			data.filterByCode !== '' &&
			data.filterByDate !== '' &&
			data.filterByName === '' &&
			data.filterByAmount === ''
		) {
			fetchFilteredProductsByCodeAndDate(
				data.filterByCode,
				data.filterByDate,
			).then(response => {
				// console.log(response)
				const listOfFilteredProducts = response.filter(
					product => product.products !== null,
				)
				console.log(listOfFilteredProducts)
			})
		}

		// filter by code and amount
		if (
			data.filterByCode !== '' &&
			data.filterByAmount !== '' &&
			data.filterByName === '' &&
			data.filterByDate === ''
		) {
			fetchFilteredProductsByCodeAndAmount(
				data.filterByCode,
				data.filterByAmount,
			).then(response => {
				const listOfFilteredProducts = response.filter(
					product => product.products !== null,
				)
				console.log(listOfFilteredProducts)
			})
		}

		// filter by name and date
		if (
			data.filterByName !== '' &&
			data.filterByDate !== '' &&
			data.filterByAmount === '' &&
			data.filterByCode === ''
		) {
			fetchFilteredProductsByNameAndDate(
				data.filterByName,
				data.filterByDate,
			).then(response => {
				const listOfFilteredProducts = response.filter(
					product => product.products !== null,
				)
				console.log(listOfFilteredProducts)
			})
		}

		// filter by name and amount
		if (
			data.filterByName !== '' &&
			data.filterByAmount !== '' &&
			data.filterByCode === '' &&
			data.filterByDate === ''
		) {
			fetchFilteredProductsByNameAndAmount(
				data.filterByName,
				data.filterByAmount,
			).then(response => {
				const listOfFilteredProducts = response.filter(
					product => product.products !== null,
				)
				console.log(listOfFilteredProducts)
			})
		}

		// filter by name, date and amount
		if (
			data.filterByName !== '' &&
			data.filterByAmount !== '' &&
			data.filterByDate !== '' &&
			data.filterByCode === ''
		) {
			fetchFilteredProductsByNameDateAndAmount(
				data.filterByName,
				data.filterByDate,
				data.filterByAmount,
			).then(response => {
				const listOfFilteredProducts = response.filter(
					product => product.products !== null,
				)
				console.log(listOfFilteredProducts)
			})
		}

		// filter by date and amount
		if (
			data.filterByDate !== '' &&
			data.filterByAmount !== '' &&
			data.filterByCode === '' &&
			data.filterByName === ''
		) {
			fetchFilteredProductsByDateAndAmount(
				data.filterByDate,
				data.filterByAmount,
			).then(response => {
				const listOfFilteredProducts = response.filter(
					product => product.products !== null,
				)
				console.log(listOfFilteredProducts)
			})
		}

		// filter by all filters
		if (
			data.filterByCode !== '' &&
			data.filterByName !== '' &&
			data.filterByDate !== '' &&
			data.filterByAmount !== ''
		) {
			fetchFilteredProductsByAllFilters(
				data.filterByCode,
				data.filterByName,
				data.filterByDate,
				data.filterByAmount,
			).then(response => {
				const filteredProducts = response.filter(
					product => product.products !== null,
				)
				console.log(filteredProducts)
			})
		}

		setLoading(false)
	})

	const openContainerModalHandler = product => {
		console.log(product)
		// fetch all containers
		fetchContainers().then(response => {
			// fitlered different containers thant the selected one
			const filteredContainers = response.filter(
				container =>
					container.containerCode !== product.containers.containerCode,
			)
			setContainers(filteredContainers)
		})

		setShowContainerModal(true)
		setSelectedProduct(product)
	}

	useEffect(() => {
		fetchProducts().then(response => {
			setLoading(false)
			setProducts(response)
		})
	}, [])

	return (
		<section>
			<h1 className='text-lg py-2 font-bold'>Lista de productos</h1>
			<div className='mb-2'>
				<p>Cantidad de productos totales 21</p>
				<p>Productos pendientes por almacenar 4</p>
			</div>
			<div className='mb-2 border border-black p-2'>
				<form onSubmit={onFilteredProductsHandler}>
					<h2 className='font-bold text-lg'>Filtros</h2>
					<div className='flex mb-2'>
						<label id='filterByCode'>Filtrar por Codigo</label>
						<select
							className='border border-black'
							{...register('filterByCode')}
						>
							<option value=''>Seleccione el codigo</option>
							<option value='ffc5bfdb-786a-41f8-9500-f8d6dea4c606'>
								DN000001
							</option>
							<option value='eab40a52-617e-498b-8b94-aafb2fd13aa3'>
								DN000002
							</option>
						</select>
					</div>
					<div className='mb-2'>
						<label>Filtrar por nombre</label>
						<input
							type='text'
							className='border border-black'
							{...register('filterByName')}
						/>
					</div>
					<div className='mb-2'>
						<label>Filtrar por fecha</label>
						<input
							type='date'
							className='border border-black'
							{...register('filterByDate')}
						/>
					</div>
					<div>
						<label>Filtrar por cantidad</label>
						<input
							type='number'
							className='border border-black'
							{...register('filterByAmount')}
						/>
					</div>
					<div>
						<button
							type='submit'
							className='bg-blue-400 text-white font-bold px-2 py-2 rounded-md'
						>
							Filtrar
						</button>
					</div>
				</form>
				{showContainerModal && (
					<ProductContainerModal
						isOpen={showContainerModal}
						selectedProduct={selectedProduct}
						setShowContainerModal={setShowContainerModal}
						containers={containers}
						fetchProducts={fetchProducts}
						setProducts={setProducts}
					/>
				)}
			</div>
			{/* ⚠️ fix the appearance of this code */}
			{loading ? (
				<Spinner />
			) : products.length > 0 ? (
				<table className='border border-black'>
					<thead>
						<tr>
							<th className='border border-black'>Nombre</th>
							<th className='border border-black'>Tipo</th>
							<th className='border border-black'>Cantidad</th>
							<th className='border border-black'>Vencimiento</th>
							<th className='border border-black'>Observaciones</th>
							<th className='border border-black'>Contenedor</th>
							<th className='border border-black'>Acción</th>
						</tr>
					</thead>
					<tbody>
						{products.map(product => (
							<tr key={product.productContainerId}>
								<td className='border border-black'>
									{product.products.productName}
								</td>
								<td className='border border-black'>
									{product.products.productType.productTypeName}
								</td>
								<td className='border border-black'>
									{product.productContainerAmount}
								</td>
								<td className='border border-black'>
									{product.products.productExpirationDate}
								</td>
								<td className='border border-black'>
									{product.products.productObservations}
								</td>
								<td className='border border-black'>
									{product.containers.containerCode}
								</td>
								<td className='border border-black'>
									<div>
										<button
											className='bg-blue-400 px-2 py-1.5 text-sm text-white font-bold rounded-md'
											onClick={() => openContainerModalHandler(product)}
										>
											Mover
										</button>
										{/* <button>Eliminar</button> */}
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : (
				<p>No hay productos</p>
			)}
		</section>
	)
}

export default Products
