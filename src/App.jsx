// 📘 TODO-LIST
// 1. Insertar productos para poder organizarlos dentro de las cajas o contenedores
// 2. Poder editar el product, elimar el product, funciones básicas de CRUD
// 3. Llevar registro de productos que salen, la fecha en que salen, la cantidad que salen y la razon por la que salen
// 4. Para este punto considero buena idea hacer una lista de razones por las que un producto puede salir
// 5. Historial de ingreso de productos, historial de salida de productos
import { useState, useEffect } from 'react'
import { supabase } from './utils/supabase.client'
import { useForm } from 'react-hook-form'

// ===================
// SUPABASE FUNCTIONS
// ===================
// insert new producto
const insertNewProduct = async product => {
	const { error } = await supabase.from('products').insert(product)
	return error
}

// fetch a product by ID
const fetchProductId = async productId => {
	const { error, data } = await supabase
		.from('products')
		.select('productId, productName, productExpirationDate, productAmount')
		.eq('productId', productId)
	return data
}

// fetch containers data
const fetchContainers = async () => {
	const { error, data } = await supabase.from('containers').select()
	return data
}

// fetch products data
const fetchProduct = async () => {
	const { error, data } = await supabase
		.from('products')
		.select()
		.eq('isStored', 0)
	return data
}

// fetch products store
const fetchProductsStored = async () => {
	const { error, data } = await supabase
		.from('product_container')
		.select(
			'productContainerId, products(productId, productName, productExpirationDate), productContainerAmount, containerId',
		)
	return data
}

const fetchProductsStoredInSelectedContainer = async containerId => {
	const { error, data } = await supabase
		.from('product_container')
		.select(
			'productContainerId, products(productId, productName, productExpirationDate), productContainerAmount',
		)
		.eq('containerId', containerId)
	return data
}

// store products in a container
const insertProductsInContainer = async products => {
	const { error } = await supabase.from('product_container').insert(products)
	return error
}

// update availability of product from 0 (false) to 1 (true)
const updateAvailabilityOfProduct = async productId => {
	const { error } = await supabase
		.from('products')
		.update({ isStored: 1 })
		.eq('productId', productId)
	return error
}

// updates the amount of product in the container
const updateProductStored = async (productId, containerId, amount) => {
	const { error } = await supabase
		.from('product_container')
		.update({ productContainerAmount: amount })
		.eq('productId', productId)
		.eq('containerId', containerId)
}

function App() {
	const [containers, setContainers] = useState([])
	const [products, setProducts] = useState([])
	const [listOfProductsStored, setListOfProductsStored] = useState([])
	const [productAvailable, setProductAvailable] = useState('')
	const [
		productsStoredInSelectedContainer,
		setproductsStoredInSelectedContainer,
	] = useState([])

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()

	// insert new product
	const insertProductForm = handleSubmit(data => {
		// getting data from the form
		const newProduct = {
			productName: data.productName,
			productBrandId: data.productBrandId,
			productCategoryId: data.productCategoryId,
			productExpirationDate: data.productExpirationDate,
			productIndications: data.productIndications,
			productSpecification: data.productSpecification,
			productObservations: data.productObservations,
			productPrice: Number(data.productPrice),
			productAmount: Number(data.productAmount),
			productTypeId: data.productTypeId,
			isStored: 0,
			status: 1,
		}
		// defining the columns to be inserted in the database
		insertNewProduct(newProduct)
	})

	const storeNewProduct = handleSubmit(data => {
		// search for an specific product inside the container
		const productInContainer = listOfProductsStored.filter(
			item => item.products.productId === data.productId,
		)

		console.log(productInContainer)

		// already exists a product in the selected container
		if (
			productInContainer.length > 0 &&
			productInContainer[0].containerId === data.containerId
		) {
			const updateProductContainerAmount =
				Number(data.productContainerAmount) +
				Number(productInContainer[0].productContainerAmount)

			updateProductStored(
				data.productId,
				data.containerId,
				updateProductContainerAmount,
			)
		} else {
			const storeProduct = {
				productId: data.productId,
				containerId: data.containerId,
				productContainerAmount: data.productContainerAmount,
			}

			insertProductsInContainer(storeProduct)
		}

		// ⚠️ execute this function after saving
		if (Number(data.productContainerAmount) === productAvailable) {
			// changes state of the product from 0 (false) to 1 (true)
			updateAvailabilityOfProduct(data.productId)
		}

		// [
		//  {productId: 1235, containerId: 129321, productAmount: 20}
		//  {productId: 1238, containerId: 129321, productAmount: 10}
		//  {productId: 1236, containerId: 129322, productAmount: 30}
		//  {productId: 1237, containerId: 129322, productAmount: 40}
		//  {productId: 1235, containerId: 129322, productAmount: 40}
		// ]
	})

	const selectContainerHandler = e => {
		console.log(e.target.value)
		fetchProductsStoredInSelectedContainer(e.target.value).then(response => {
			setproductsStoredInSelectedContainer(response)
		})
	}

	// const storeListOfProducts = () => {
	// 	storeProductsInContainer(productsStored)
	// }

	const selectProductHandler = e => {
		const selectedProductId = e.target.value
		const filterSelectedProducts = listOfProductsStored.filter(
			item => item.products.productId === e.target.value,
		)

		console.log(filterSelectedProducts)

		const amountOfProductsStored = filterSelectedProducts.reduce(
			(accumulator, currentValue) =>
				accumulator + currentValue.productContainerAmount,
			0,
		)

		fetchProductId(selectedProductId).then(response => {
			const totalAmountOfSelectedProduct = response[0].productAmount
			const availability = totalAmountOfSelectedProduct - amountOfProductsStored
			setProductAvailable(availability)
		})
	}

	useEffect(() => {
		fetchProduct().then(response => {
			console.log(response)
			setProducts(response)
		})

		fetchContainers().then(response => {
			console.log(response)
			setContainers(response)
		})

		fetchProductsStored().then(response => {
			console.log(response)
			setListOfProductsStored(response)
		})
	}, [])

	return (
		<div className='App'>
			{/* container */}
			<div className='max-w-7xl p-2'>
				{/* Product form */}
				<section className='flex justify-evenly'>
					<form
						className='max-w-lg border border-black rounded-r p-2'
						onSubmit={insertProductForm}
					>
						<h2 className='py-2 text-lg font-bold'>
							Ingreso de nuevo producto
						</h2>
						<div className='flex flex-col mb-1'>
							<label htmlFor='productName'>Nombre del producto</label>
							<input
								className='border border-black '
								type='text'
								name='productName'
								id='productName'
								{...register('productName')}
							/>
						</div>

						<div className='flex flex-col mb-1'>
							<label htmlFor='productType'>Tipo de producto</label>
							<select
								className='border border-black '
								type='select'
								name='productType'
								id='productType'
								{...register('productTypeId')}
							>
								<option value=''>Seleccione el tipo de producto</option>
								<option value='9500cecd-f171-4edd-b02a-2908d327909e'>
									Jarabe
								</option>
								<option value='ca5b6a80-e285-485e-b276-1d39b9ba83f9'>
									Tableta
								</option>
								<option value='3d3df0a7-d424-46c3-8b59-9cf614e761c6'>
									Ampolla
								</option>
							</select>
						</div>
						<div className='flex flex-col mb-1'>
							<label htmlFor='producCategory'>Categoría del producto</label>
							<select
								className='border border-black '
								type='select'
								name='productCategory'
								id='productCategory'
								{...register('productCategoryId')}
							>
								<option value=''>Seleccione la categoría del producto</option>
								<option value='254d9f0e-f81f-40c6-aeef-66171638a634'>
									Antibiótico
								</option>
								<option value='b833140e-c969-49ec-a374-062478e414cd'>
									Antihestamínico
								</option>
								<option value='dd9cc274-a30a-4227-be7b-9886762686d3'>
									Antigripal
								</option>
							</select>
						</div>
						<div className='flex flex-col mb-1'>
							<label htmlFor='producBrand'>Marca del producto</label>
							<select
								className='border border-black '
								type='select'
								name='productBrand'
								id='productBrand'
								{...register('productBrandId')}
							>
								<option value=''>Seleccione la marca del producto</option>
								<option value='26d6d87b-d4ad-431b-9b34-f868dad25ffb'>
									Portugal
								</option>
								<option value='IQ b10a8769-8b8c-4bf5-8e6c-f2519de4dfe6'>
									IQ Pharma
								</option>
								<option value='d9ac537d-bcf3-4406-bfba-85b22a6bd8b2'>
									Bayer
								</option>
							</select>
						</div>
						<div className='flex flex-col mb-1'>
							<label htmlFor='productExpirationDate'>
								Fecha de expiración del produto
							</label>
							<input
								className='border border-black '
								type='date'
								name='productExpirationDate'
								id='productExpirationDate'
								{...register('productExpirationDate')}
							/>
						</div>
						<div className='flex flex-col mb-1'>
							<label htmlFor='productAmount'>Cantidad de producto</label>
							<input
								className='border border-black '
								type='number'
								name='productAmount'
								id='productAmount'
								{...register('productAmount')}
							/>
						</div>
						<div className='flex flex-col mb-1'>
							<label htmlFor='productPrice'>Precio del producto</label>
							<input
								className='border border-black '
								type='number'
								name='productPrice'
								id='productPrice'
								step={'0.01'}
								{...register('productPrice')}
							/>
						</div>
						<div className='flex flex-col mb-1'>
							<label htmlFor='productSpecification'>
								Especificaciones del producto
							</label>
							<textarea
								height={3}
								width={3}
								className='border border-black '
								type='text'
								name='productSpecification'
								id='productSpecification'
								{...register('productSpecification')}
							/>
						</div>
						<div className='flex flex-col mb-1'>
							<label htmlFor='productIndications'>
								Indicicaciones del producto
							</label>
							<textarea
								height={3}
								width={3}
								className='border border-black '
								type='text'
								name='productIndications'
								id='productIndications'
								{...register('productIndications')}
							/>
						</div>
						<div className='flex flex-col mb-1'>
							<label htmlFor='productObservations'>¿Alguna observación?</label>
							<textarea
								height={3}
								width={3}
								className='border border-black '
								type='text'
								name='productObservations'
								id='productObservations'
								{...register('productObservations')}
							/>
						</div>
						<div className='text-center'>
							<button
								type='submit'
								className='bg-blue-400 rounded-md px-1.5 py-1 text-white'
								name='productForm'
								id='productForm'
							>
								Agregar
							</button>
						</div>
					</form>
					{/* Store products */}
					<div className='max-w-lg border border-black rounded-r p-2 h-full'>
						<form onSubmit={storeNewProduct}>
							<h2 className='py-2 text-lg font-bold'>Almacenar producto</h2>
							<div className='flex flex-col mb-1'>
								<label htmlFor='containerId'>Seleccionar contenedor</label>
								<select
									className='border border-black '
									type='select'
									name='containerId'
									id='containerId'
									{...register('containerId')}
									onChange={selectContainerHandler}
								>
									<option value=''>Seleccione el tipo de contenedor</option>
									{containers.map(container => (
										<option
											key={container?.containerId}
											value={container?.containerId}
										>
											{container?.containerCode}
										</option>
									))}
								</select>
							</div>
							<div className='flex flex-col mb-1'>
								<label htmlFor='productId'>Seleccionar producto</label>
								<select
									className='border border-black '
									type='select'
									name='productId'
									id='productId'
									{...register('productId')}
									onChange={selectProductHandler}
								>
									<option value=''>Seleccione el producto</option>
									{products.map(product => (
										<option key={product?.productId} value={product?.productId}>
											{product?.productName}
										</option>
									))}
								</select>
							</div>
							<div className='my-1'>
								<p>
									Producto disponible para almacenar:{' '}
									<span className='font-bold'>{productAvailable}</span>
								</p>
							</div>
							<div className='flex flex-col mb-1'>
								<label htmlFor='productContainerAmount'>Cantidad</label>
								<input
									className='border border-black '
									type='number'
									name='productContainerAmount'
									id='productContainerAmount'
									{...register('productContainerAmount')}
								/>
							</div>
							<div className='text-center'>
								<button className='bg-blue-600 text-white text-sm rounded-md px-2 py-1.5'>
									Almacenar producto
								</button>
							</div>
						</form>
						{/* List of products added to the container */}
						<div className='mb-1'>
							<h2 className='font-bold text-lg py-1 text-center'>
								Productos agregados
							</h2>
							<table className='border border-black'>
								<thead className='border border-black'>
									<tr>
										<th className='border border-black'>Producto</th>
										<th className='border border-black'>Cantidad</th>
										<th className='border border-black'>
											Fecha de vencimiento
										</th>
										<th>Acciones</th>
									</tr>
								</thead>
								<tbody>
									{productsStoredInSelectedContainer.map(product => (
										<tr key={product?.productContainerId}>
											<th className='border border-black'>
												{product.products.productName}
											</th>
											<th className='border border-black'>
												{product.productContainerAmount}
											</th>
											<th className='border border-black'>
												{product.products.productExpirationDate}
											</th>
											<th className='border border-black'>
												<div>
													<button className='px-1.5 py-1 bg-blue-600 text-white rounded-sm text-sm'>
														Agregar
													</button>
													<button className='px-1.5 py-1 bg-red-600 text-white rounded-sm text-sm'>
														Agregar
													</button>
												</div>
											</th>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<div className='text-center'>
							<button
								className='bg-gray-400 rounded-md px-1.5 py-1 text-white'
								// onClick={storeListOfProducts}
							>
								Completar
							</button>
						</div>
					</div>
					{/* Container form */}
					<form className='max-w-lg border border-black rounded-r p-2 h-full'>
						<h2 className='py-2 text-lg font-bold'>
							Ingreso de nuevo contenedor
						</h2>
						<div className='flex flex-col mb-1'>
							<label htmlFor='containerCode'>Código del contenedor</label>
							<input
								className='border border-black '
								type='text'
								name='containerCode'
								id='containerCode'
							/>
						</div>

						<div className='flex flex-col mb-1'>
							<label htmlFor='containerType'>Tipo de contenedor</label>
							<select
								className='border border-black '
								type='select'
								name='containerType'
								id='containerType'
							>
								<option value=''>Seleccione el tipo de contenedor</option>
								<option value='Caja de cartón'>Caja de cartón</option>
								<option value='Caja plástica'>Caja plástica</option>
							</select>
						</div>

						<div className='flex flex-col mb-1'>
							<label htmlFor='containerObservations'>
								¿Alguna observación?
							</label>
							<textarea
								height={3}
								width={3}
								className='border border-black '
								type='text'
								name='containerObservations'
								id='containerObservations'
							/>
						</div>
						<div className='text-center'>
							<button className='bg-blue-400 rounded-md px-1.5 py-1 text-white'>
								Insertar
							</button>
						</div>
					</form>
				</section>
			</div>
		</div>
	)
}

export default App
