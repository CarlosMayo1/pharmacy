import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { supabase } from '../utils/supabase.client'

// supabase
const fetchProducts = async () => {
	const { data, error } = await supabase
		.from('products')
		.select('productId, productName, productAmount, productExpirationDate')
		.neq('isStored', 1)
	return data
}

const fetchAvailableContainers = async () => {
	const { data, error } = await supabase
		.from('containers')
		.select('containerId, containerCode')
	return data
}

const fetchProductsInSelectedContainer = async containerId => {
	const { error, data } = await supabase
		.from('product_container')
		.select(
			'productContainerId, productId, products(productName, productExpirationDate), productContainerAmount',
		)
		.eq('containerId', containerId)
	return data
}

const insertProductByContainer = async storeProduct => {
	const { error } = await supabase
		.from('product_container')
		.insert(storeProduct)
	return error
}

const changeStatusOfStoreProducts = async (value, productId) => {
	const { error } = await supabase
		.from('products')
		.update({ isStored: value })
		.eq('productId', productId)
	return error
}

const updateProductAmountInSelectedContainer = async (
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

const productAmountInContainer = async productId => {
	const { error, data } = await supabase
		.from('product_container')
		.select()
		.eq('productId', productId)
	return data
}

const deleteProductInContainer = async productContainerId => {
	const { error } = await supabase
		.from('product_container')
		.delete()
		.eq('productContainerId', productContainerId)
	return error
}

const StoreProductsByContainer = () => {
	const [productsToBeStored, setProductsToBeStored] = useState([])
	const [availableContainers, setAvailableContainers] = useState([])
	const [amountOfSelectedProduct, setAmountOfSelectedProduct] = useState(0)
	const [productsInSelectedContainer, setProductsInSelectedContainer] =
		useState([])
	const [container, setContainer] = useState(null)
	const [formMessage, setFormMessage] = useState({})

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setError,
		setValue,
	} = useForm({
		defaultValues: {
			productsToBeStored: '',
			productAmount: '',
		},
	})

	const pickContainerHandler = containerInfo => {
		fetchProductsInSelectedContainer(containerInfo.containerId)
			.then(response => {
				setProductsInSelectedContainer(response)
			})
			.finally(() => {
				// gets containers information
				setContainer(containerInfo)
			})
		setFormMessage(null)
	}

	const onSelectProductHandler = e => {
		// if it is empty, don't do anything
		if (!e.target.value) {
			return
		}

		const selectedProductAmount = productsToBeStored.filter(
			product => product.productId === e.target.value, // id of the selected product
		)

		productAmountInContainer(e.target.value).then(response => {
			// reduces the amount of the product existing in all containers
			const productAmountOfProductStored = response.reduce(
				(accumulator, currentValue) =>
					accumulator + currentValue.productContainerAmount,
				0,
			)
			const productLeftToBeStored =
				selectedProductAmount[0].productAmount - productAmountOfProductStored
			setAmountOfSelectedProduct(productLeftToBeStored)
		})
	}

	const stockByContainerHandler = handleSubmit(data => {
		// avoids to send info to database without container id
		if (!container) {
			setFormMessage({
				status: 'ERROR',
				message: 'Se necesita incluir un contenedor',
			})
			return
		}

		if (!data.productAmount) {
			// It doesn't allow an empty field in the amount
			setError('productAmount', {
				type: 'custom',
				message: 'Este campo no puede estar vacío',
			})
			return
		}

		// checks if the product already exits in the container
		const existingProductInContainer = productsInSelectedContainer.filter(
			product => product.productId === data?.productToBeStored,
		)

		// exists a product in the container
		if (existingProductInContainer.length > 0) {
			const updatedAmount =
				Number(existingProductInContainer[0].productContainerAmount) +
				Number(data.productAmount)
			updateProductAmountInSelectedContainer(
				data.productToBeStored,
				container.containerId,
				updatedAmount,
			)
				.then(response => console.log(response))
				.finally(() => {
					// resets the form
					reset()
					// resets to zero
					setAmountOfSelectedProduct(0) // resets to zero
					if (Number(data.productAmount) === amountOfSelectedProduct) {
						changeStatusOfStoreProducts(1, data.productToBeStored)
							.then(response => console.log(response))
							.finally(() => {
								// resets available products in the select
								fetchProducts().then(response => {
									console.log(response)
									setProductsToBeStored(response)
								})
							})
					}

					// updates products in selected container
					fetchProductsInSelectedContainer(container.containerId).then(
						response => {
							setProductsInSelectedContainer(response)
						},
					)
				})
			// shows a message that the process was successful
			return
		}

		const storeProduct = {
			containerId: container.containerId,
			productId: data.productToBeStored,
			productContainerAmount: data.productAmount,
		}

		insertProductByContainer(storeProduct)
			.then(() => {
				// shows an alert saying that the product was inserted successfully
			})
			.finally(() => {
				// change the state of the product from 0 (not stored) to 1 (product stored)
				if (Number(data.productAmount) === amountOfSelectedProduct) {
					changeStatusOfStoreProducts(1, data.productToBeStored)
						.then(response => console.log(response))
						.finally(() => {
							// resets available products in the select
							fetchProducts().then(response => {
								console.log(response)
								setProductsToBeStored(response)
							})
						})
				}
				// resets the form
				reset()
				setAmountOfSelectedProduct(0) // resets to zero
				// updates products in selected container
				fetchProductsInSelectedContainer(container.containerId).then(
					response => {
						setProductsInSelectedContainer(response)
					},
				)
			})
	})

	const onRemoveProductInContainer = (productContainerId, productId) => {
		console.log(productContainerId)
		deleteProductInContainer(productContainerId).then(() => {
			// I don't if it is necessary to add a conditional here
			changeStatusOfStoreProducts(0, productId).then(() => {
				// updates products in selected container
				fetchProductsInSelectedContainer(container.containerId).then(
					response => {
						setProductsInSelectedContainer(response)
					},
				)
			})
		})
	}

	useEffect(() => {
		fetchProducts().then(response => {
			console.log(response)
			setProductsToBeStored(response)
		})
		fetchAvailableContainers().then(response => {
			console.log(response)
			setAvailableContainers(response)
		})
	}, [])

	return (
		<section>
			<h1 className='text-lg font-bold my-2'>
				Almacenar productos por contenedor
			</h1>
			<div className='flex'>
				<div>
					<h2 className='font-bold '>Listado de productos pendientes</h2>
					<table>
						<thead>
							<tr>
								<th className='border border-black'>Producto</th>
								<th className='border border-black'>Cantidad</th>
								<th className='border border-black'>Fecha de vencimiento</th>
							</tr>
						</thead>
						<tbody>
							{productsToBeStored.map(product => (
								<tr key={product.productAmount}>
									<td className='border border-black'>{product.productName}</td>
									<td className='border border-black'>
										{product.productAmount}
									</td>
									<td className='border border-black'>
										{product.productExpirationDate}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div className='ml-4'>
					<h2 className='font-bold'>Contenedores disponibles</h2>
					<table>
						<thead>
							<tr>
								<th className='border border-black'>Contenedor</th>
								<th className='border border-black'>Accion</th>
							</tr>
						</thead>
						<tbody>
							{availableContainers.map(container => (
								<tr key={container.containerId}>
									<td className='border border-black'>
										{container.containerCode}
									</td>
									<td className='border border-black'>
										<div>
											{/* <button
												type='button'
												className='px-2 py-2 rounded-md text-white bg-blue-400 font-bold text-sm'
											>
												Detalle
											</button> */}
											<button
												type='button'
												className='px-2 py-2 rounded-md text-white bg-green-400 font-bold text-sm'
												onClick={() => pickContainerHandler(container)}
											>
												Almacenar
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div className='ml-4 border border-black p-2'>
					<h2 className='font-bold mb-2'>Almacenar en contenedor</h2>
					<h3
						className={`mb-2 font-bold ${
							formMessage?.status === 'ERROR'
								? 'text-red-500'
								: 'text-green-500'
						}`}
					>
						{formMessage?.message}
					</h3>
					<form onSubmit={stockByContainerHandler}>
						<p>
							Codigo del contenedor: <span>{container?.containerCode}</span>
						</p>

						<div className='mb-2 flex flex-col'>
							<label id='productToBeStored' name='productToBeStored'>
								Almacenar Producto
							</label>
							<select
								className='border border-black'
								{...register('productToBeStored', {
									required: {
										value: 'true',
										message: 'Se debe completar este campo',
									},
								})}
								onChange={onSelectProductHandler}
							>
								<option value=''>Seleccione un producto</option>
								{productsToBeStored.map(product => (
									<option key={product.productId} value={product.productId}>
										{product.productName}
									</option>
								))}
							</select>
							{errors.productToBeStored && (
								<p className='text-xs text-red-500 font-bold'>
									{errors.productToBeStored.message}
								</p>
							)}
						</div>
						<p>
							Producto disponible : <span>{amountOfSelectedProduct}</span>
						</p>
						<div className='flex flex-col mb-2'>
							<label id='productAmount' name='productAmount'>
								Cantidad del producto
							</label>
							<input
								type='number'
								className='border border-black'
								{...register('productAmount', {
									required: {
										value: 'true',
										message: 'Se debe completar este campo',
									},
									validate: value =>
										value <= amountOfSelectedProduct ||
										'Debe ser menor a la cantidad disponible',
								})}
							/>
							{errors.productAmount && (
								<p className='text-xs text-red-500 font-bold'>
									{errors.productAmount.message}
								</p>
							)}
						</div>

						<div className='text-center'>
							<button className='px-2 py-2 font-bold text-white bg-green-500 text-sm rounded-md mb-2'>
								Almacenar
							</button>
						</div>
					</form>
					{/* This is experimental */}
					<div>
						<div>
							<table>
								<thead>
									<tr>
										<th className='border border-black'>Producto</th>
										<th className='border border-black'>Cantidad</th>
										<th className='border border-black'>Vencimiento</th>
										<th className='border border-black'>Acción</th>
									</tr>
								</thead>
								<tbody>
									{productsInSelectedContainer.map(product => (
										<tr key={product.productContainerId}>
											<td className='border border-black'>
												{product.products.productName}
											</td>
											<td className='border border-black'>
												{product.productContainerAmount}
											</td>
											<td className='border border-black'>
												{product.products.productExpirationDate}
											</td>
											<td className='border border-black'>
												<button
													className='bg-red-500 px-2 py-2 rounded-md text-white font-bold'
													onClick={() =>
														onRemoveProductInContainer(
															product.productContainerId,
															product.productId,
														)
													}
												>
													Eliminar
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default StoreProductsByContainer
