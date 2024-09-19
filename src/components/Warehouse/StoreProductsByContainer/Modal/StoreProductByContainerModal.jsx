import { useState, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { warehouseSliceAction } from '../../../../store/warehouseSlice/warehouseSlice'
import { Transition, Dialog } from '@headlessui/react'
import {
	fetchProducts,
	fetchProductsInSelectedContainer,
	fetchProductAmountInContainers,
	insertProductByContainer,
	updateProductAmountInSelectedContainer,
	updateStatusOfStoreProducts,
} from '../../../../utils/warehouse/warehouse'
import { useForm } from 'react-hook-form'
import ProductsInSelectedContainer from '../Table/ProductsInSelectedContainer'
import SmallSpinner from '../../../UI/Spinner/SmallSpinner'
import Spinner from '../../../UI/Spinner/Spinner'
import { FORM_MESSAGE } from '../../../../constants/constants'

const StoreProductByContainerModal = ({
	isOpen,
	setShowContainerModal,
	loadingModalContainer,
}) => {
	const productsToBeStored = useSelector(
		state => state.warehouseReducer.productsToBeStored,
	)
	const productsInSelectedContainer = useSelector(
		state => state.warehouseReducer.productsInSelectedContainer,
	)
	const selectedContainer = useSelector(
		state => state.warehouseReducer.selectedContainerInfo,
	)
	const formMessage = useSelector(state => state.warehouseReducer.formMessage)
	const dispatch = useDispatch()
	const [amountOfSelectedProduct, setAmountOfSelectedProduct] = useState(0)
	const [sendingData, setSendingData] = useState(false)
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm()

	// =========================
	// FUNCTIONS WITH SUPABASE
	// =========================
	const fetchProductAmountInContainersFromSupabase = async (
		productId,
		selectedProductAmount,
	) => {
		try {
			// fetch amount of selected product stored in all the containers
			const amountOfSelectedProduct = await fetchProductAmountInContainers(
				productId,
			)

			// calculates the current amount available
			const amount = amountOfSelectedProduct.reduce(
				(accumulator, currentValue) =>
					accumulator + currentValue.productContainerAmount,
				0,
			)

			const productsLeftToBeStored =
				selectedProductAmount[0].productAmount - amount

			setAmountOfSelectedProduct(productsLeftToBeStored)
		} catch (error) {
			console.log(error)
		}
	}

	const updateExistingProductAmountFromSupabase = async (
		existingProductInContainer,
		data,
	) => {
		try {
			const updatedAmount =
				Number(existingProductInContainer[0].productContainerAmount) +
				Number(data.productAmount)

			const error = await updateProductAmountInSelectedContainer(
				data.productToBeStored,
				selectedContainer.containerId,
				updatedAmount,
			)

			// if the update does not occur, then stops the process
			// ⚠️ mostrar un mensaje de error
			if (error !== null) {
				dispatch(
					warehouseSliceAction.showFormMessage({
						status: FORM_MESSAGE.error,
						message: FORM_MESSAGE.updateError,
					}),
				)
				return
			}

			// if the input amount is the same amount of the product selected
			if (Number(data.productAmount) === amountOfSelectedProduct) {
				// the product is stored
				const error = await updateStatusOfStoreProducts(
					1,
					data.productToBeStored,
				)

				if (error !== null) {
					dispatch(
						warehouseSliceAction.showFormMessage({
							status: FORM_MESSAGE.error,
							message: FORM_MESSAGE.updateError,
						}),
					)
					return
				}
			}

			const products = await fetchProducts()

			// updates products to be stored
			dispatch(warehouseSliceAction.productsToBeStored(products))

			//updates products in selected container
			const productsInSelectedContainer =
				await fetchProductsInSelectedContainer(selectedContainer.containerId)

			// fetch products one more time
			dispatch(
				warehouseSliceAction.productsInSelectedContainer(
					productsInSelectedContainer,
				),
			)

			dispatch(
				warehouseSliceAction.showFormMessage({
					status: FORM_MESSAGE.success,
					message: FORM_MESSAGE.insert,
				}),
			)

			// resets form
			reset()
			// set amount to zero
			setAmountOfSelectedProduct(0)
			setSendingData(false)
		} catch (error) {
			console.log(error)
		}
	}

	const insertProductInStoreFromSupabase = async data => {
		// proucto to be stored
		const storeProduct = {
			containerId: selectedContainer.containerId,
			productId: data.productToBeStored,
			productContainerAmount: data.productAmount,
		}

		const insertProduct = await insertProductByContainer(storeProduct)

		if (insertProduct !== null) {
			dispatch(
				warehouseSliceAction.showFormMessage({
					status: FORM_MESSAGE.error,
					message: FORM_MESSAGE.insertError,
				}),
			)
			return
		}

		// change the state of the product from 0 (not stored) to 1 (product stored)
		if (Number(data.productAmount) === amountOfSelectedProduct) {
			const error = await updateStatusOfStoreProducts(1, data.productToBeStored)

			if (error !== null) {
				dispatch(
					warehouseSliceAction.showFormMessage({
						status: FORM_MESSAGE.error,
						message: FORM_MESSAGE.updateError,
					}),
				)
				return
			}
		}

		// fetch products in selected container
		const productInSelectedContainer = await fetchProductsInSelectedContainer(
			selectedContainer.containerId,
		)
		dispatch(
			warehouseSliceAction.productsInSelectedContainer(
				productInSelectedContainer,
			),
		)

		// fetch stores
		const products = await fetchProducts()

		dispatch(warehouseSliceAction.productsToBeStored(products))

		dispatch(
			warehouseSliceAction.showFormMessage({
				status: FORM_MESSAGE.success,
				message: FORM_MESSAGE.insert,
			}),
		)
		// resets form
		reset()
		// set amount to zero
		setAmountOfSelectedProduct(0)
		setSendingData(false)
	}

	// =========================
	// APP FUNCTIONS
	// =========================
	const closeContainerModalHandler = () => {
		setShowContainerModal(false)
	}

	const onSelectProductHandler = e => {
		const productId = e.target.value
		// if it is empty, don't do anything
		if (!productId) {
			return
		}

		const selectedProductAmount = productsToBeStored.filter(
			product => product.productId === e.target.value, // id of the selected product
		)

		fetchProductAmountInContainersFromSupabase(productId, selectedProductAmount)
	}

	const stockByContainerHandler = handleSubmit(data => {
		setSendingData(true)

		// checks if the product already exits in the container
		const existingProductInContainer = productsInSelectedContainer.filter(
			product => product.productId === data.productToBeStored,
		)

		// exists a product in the container
		if (existingProductInContainer.length > 0) {
			updateExistingProductAmountFromSupabase(existingProductInContainer, data)
			return
		} else {
			insertProductInStoreFromSupabase(data)
		}
	})

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
								{loadingModalContainer ? (
									<div className='flex justify-center'>{<Spinner />}</div>
								) : (
									<div>
										{' '}
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
													<span>{selectedContainer?.containerCode}</span>
												</p>

												<div className='mb-2 flex flex-col'>
													<label
														id='productToBeStored'
														name='productToBeStored'
													>
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
												{amountOfSelectedProduct > 0 ? (
													<p>
														Producto disponible :{' '}
														<span className='font-semibold'>
															{amountOfSelectedProduct}
														</span>
													</p>
												) : null}
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

												<div className='text-center'>
													<button
														type='submit'
														className={`px-2 py-2 font-bold text-white ${
															sendingData ? 'bg-green-300' : 'bg-green-500'
														} text-sm rounded-md`}
														disabled={sendingData}
													>
														{sendingData && <SmallSpinner />}
														Almacenar
													</button>
												</div>
											</form>
											{productsInSelectedContainer.length > 0 ? (
												<ProductsInSelectedContainer />
											) : null}
										</div>
									</div>
								)}
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	)
}

export default StoreProductByContainerModal
