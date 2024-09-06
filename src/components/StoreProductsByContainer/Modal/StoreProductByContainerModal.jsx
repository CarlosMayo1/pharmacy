import { useState, Fragment } from 'react'
import { Transition, Dialog } from '@headlessui/react'
import { supabase } from '../../../utils/supabase.client'
import { useForm } from 'react-hook-form'
import ProductsInSelectedContainer from '../Table/ProductsInSelectedContainer'

// ====================
// SUPABASE FUNCTIONS
// ====================
const fetchProducts = async () => {
	const { data, error } = await supabase
		.from('products')
		.select('productId, productName, productAmount, productExpirationDate')
		.neq('isStored', 1)
	return data
}

const fetchProductsInSelectedContainer = async containerId => {
	const { error, data } = await supabase
		.from('product_container')
		.select(
			'productContainerId, containerId, productId, products(productName, productExpirationDate), productContainerAmount',
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

const updateProductContainer = async (
	updatedContainerId,
	productContainerId,
) => {
	const { error } = await supabase
		.from('product_container')
		.update({ containerId: updatedContainerId })
		.eq('productContainerId', productContainerId)
	return error
}

const changeStateOfContainer = async (status, id) => {
	const { error } = await supabase
		.from('containers')
		.update({ status: status })
		.eq('containerId', id)
	return error
}

const StoreProductByContainerModal = ({
	isOpen,
	setShowContainerModal,
	productsInSelectedContainer,
	setProductsInSelectedContainer,
	container,
	formMessage,
	setFormMessage,
	productsToBeStored,
	setProductsToBeStored,
	FORM_MESSAGE,
}) => {
	const [amountOfSelectedProduct, setAmountOfSelectedProduct] = useState(0)
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setError,
		setValue,
	} = useForm()

	// ======================
	// MODAL FUNCTIONS
	// ======================

	const closeContainerModalHandler = () => {
		setShowContainerModal(false)
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
		// ⚠️ avoids sending multiples query to database, so put a loading and blocks the button when inserting, and updating
		// avoids to send info to database without container id

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
				.then(() => {})
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
					fetchProductsInSelectedContainer(container.containerId)
						.then(response => {
							setProductsInSelectedContainer(response)
						})
						.finally(() =>
							// updates state of the form
							setFormMessage({
								status: FORM_MESSAGE.success,
								message: FORM_MESSAGE.update,
							}),
						)

					// if the checkbox is clicked it means the container is full
					if (data.isContainerFull) {
						changeStateOfContainer(0, container.containerId)
							.then(response => console.log(response))
							.finally(() => {
								fetchAvailableContainers().then(response => {
									setAvailableContainers(response)
								})
							})
					}
				})
			// shows a message that the process was successful
			return
		}

		const storeProduct = {
			containerId: container.containerId,
			productId: data.productToBeStored,
			productContainerAmount: data.productAmount,
		}

		insertProductByContainer(storeProduct).finally(() => {
			// change the state of the product from 0 (not stored) to 1 (product stored)
			if (Number(data.productAmount) === amountOfSelectedProduct) {
				changeStatusOfStoreProducts(1, data.productToBeStored).finally(() => {
					// resets available products in the select
					fetchProducts().then(response => {
						setProductsToBeStored(response)
					})
				})
			}

			// updates products in selected container
			fetchProductsInSelectedContainer(container.containerId)
				.then(response => {
					setProductsInSelectedContainer(response)
				})
				.finally(() => {
					// updates form message
					setFormMessage({
						status: FORM_MESSAGE.success,
						message: FORM_MESSAGE.insert,
					})
				})

			// if the checkbox is clicked it means the container is full
			// if (data.isContainerFull) {
			// 	changeStateOfContainer(0, container.containerId)
			// 		.then(response => console.log(response))
			// 		.finally(() => {
			// 			fetchAvailableContainers().then(response => {
			// 				setAvailableContainers(response)
			// 			})
			// 		})
			// }
		})

		// resets the form
		reset()
		setAmountOfSelectedProduct(0) // resets to zero
	})

	const onRemoveProductInContainer = (
		productContainerId,
		productId,
		containerId,
	) => {
		console.log(containerId)
		deleteProductInContainer(productContainerId).then(() => {
			// I don't if it is necessary to add a conditional here
			changeStatusOfStoreProducts(0, productId).finally(() => {
				// updates products in selected container
				fetchProductsInSelectedContainer(container.containerId)
					.then(response => {
						setProductsInSelectedContainer(response)
					})
					.finally(() => {
						setFormMessage({
							status: FORM_MESSAGE.success,
							message: FORM_MESSAGE.delete,
						})
					})

				// updates products to be stored
				fetchProducts().then(response => {
					setProductsToBeStored(response)
				})
			})
		})

		// update the state of the container
		changeStateOfContainer(1, containerId)
			.then(response => console.log(response))
			.finally(() => {
				fetchAvailableContainers().then(response => {
					setAvailableContainers(response)
				})
			})
	}

	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog
				as='div'
				className='relative z-10'
				onClose={closeContainerModalHandler}
			>
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='fixed inset-0 bg-black/25' />
				</Transition.Child>

				<div className='fixed inset-0 overflow-y-auto'>
					<div className='flex min-h-full items-center justify-center p-4 text-center'>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 scale-95'
							enterTo='opacity-100 scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 scale-100'
							leaveTo='opacity-0 scale-95'
						>
							<Dialog.Panel className='w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
								<Dialog.Title
									as='h3'
									className='text-lg font-medium leading-6 text-gray-900'
								>
									Almacenar en Contenedor
								</Dialog.Title>
								<div>
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
											Codigo del contenedor:{' '}
											<span>{container?.containerCode}</span>
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
													<option
														key={product.productId}
														value={product.productId}
													>
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
											Producto disponible :{' '}
											<span>{amountOfSelectedProduct}</span>
										</p>
										<div className='flex flex-col mb-4'>
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
										{productsInSelectedContainer.length > 0 ? (
											<ProductsInSelectedContainer
												productsInSelectedContainer={
													productsInSelectedContainer
												}
											/>
										) : null}
										<div className='text-center'>
											<button
												type='submit'
												className='px-2 py-2 font-bold text-white bg-green-500 text-sm rounded-md mb-2'
											>
												Almacenar
											</button>
										</div>
									</form>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	)
}

export default StoreProductByContainerModal
