import { useState, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { warehouseSliceAction } from '../../../../store/warehouseSlice/warehouseSlice'
import {
	Transition,
	Dialog,
	DialogPanel,
	DialogTitle,
	TransitionChild,
} from '@headlessui/react'
import {
	fetchExistingProductInStore,
	insertProductInShop,
	updateProductInShop,
} from '../../../../utils/shop/shop'
import {
	fetchProducts,
	fetchProductsWithAllInfo,
	fetchProductsInSelectedContainer,
	insertProductByContainer,
	updateProductAmountInSelectedContainer,
	updateStatusOfStoreProducts,
	updateAmountOfSelectedProduct,
} from '../../../../utils/warehouse/warehouse'
import { useForm } from 'react-hook-form'
// import ProductsInSelectedContainer from '../Table/ProductsInSelectedContainer'
import SmallSpinner from '../../../UI/Spinner/SmallSpinner'
import Spinner from '../../../UI/Spinner/Spinner'
import toast from 'react-hot-toast'

const DispatchProductModal = ({
	isOpen,
	setShowDispatchModal,
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
	const fetchProductsFromSupabase = async () => {
		try {
			const products = await fetchProductsWithAllInfo()
			dispatch(warehouseSliceAction.productsToBeStored(products))
			// setLoading(false)
		} catch (error) {
			throw new Error(error)
		}
	}

	const onDispatchProductHandler = async product => {
		try {
			const existingProductInStore = await fetchExistingProductInStore(
				product.productId,
			)

			// if the product already exits in the store
			if (existingProductInStore.length > 0) {
				updateProductIntoShopFromSupabase(existingProductInStore, product)
			} else {
				insertProductIntoShopFromSupabase(product)
			}
		} catch (error) {
			throw new Error(error)
		}
	}

	const insertProductIntoShopFromSupabase = async product => {
		try {
			const newProduct = {
				productId: product.productId,
				productAmount: product.productAmount,
				observations: product.observations,
				status: 1,
			}

			const insert = await insertProductInShop(newProduct)

			if (insert !== null) {
				toast.error('Error al despachar el producto')
				return
			}

			// pick the selected product to be dispatched
			const selectedProduct = productsToBeStored.filter(
				item => item.products.productId === product.productId,
			)
			const updatedAmount =
				Number(selectedProduct[0].productContainerAmount) -
				Number(product.productAmount)

			// updates the amount when dispatches the product
			const update = await updateProductAmountInSelectedContainer(
				selectedProduct[0].products.productId,
				selectedProduct[0].containers.containerId,
				updatedAmount,
			)

			if (update !== null) {
				toast.error('Error al actualizar la cantidad de producto despachado')
				return
			}

			toast.success('Producto despachado correctamente')

			// refresh products
			fetchProductsFromSupabase()
			setAmountOfSelectedProduct(0)
			// reset
			reset()
		} catch (error) {
			throw new Error(error)
		}
	}

	const updateProductIntoShopFromSupabase = async (
		existingProduct,
		product,
	) => {
		try {
			const updateAmount =
				Number(existingProduct[0].productAmount) + Number(product.productAmount)

			const updateProductAmountInStore = await updateProductInShop(
				product.productId,
				updateAmount,
			)

			if (updateProductAmountInStore !== null) {
				toast.error('Error al despachar producto')
				return
			}

			// pick the selected product to be dispatched
			const selectedProduct = productsToBeStored.filter(
				item => item.products.productId === product.productId,
			)

			const updatedAmount =
				Number(selectedProduct[0].productContainerAmount) -
				product.productAmount

			// updates the amount when dispatches the product
			const updateProductAmount = await updateProductAmountInSelectedContainer(
				selectedProduct[0].products.productId,
				selectedProduct[0].containers.containerId,
				updatedAmount,
			)

			if (updateProductAmount !== null) {
				toast.error('Error al actualizar la cantidad de producto despachado')
				return
			}

			toast.success('Producto despachado correctamente')

			// refresh products
			fetchProductsFromSupabase()
			//reset
			reset()
			setAmountOfSelectedProduct(0)
		} catch (error) {
			throw new Error(error)
		}
	}

	// =========================
	// APP FUNCTIONS
	// =========================
	const closeModalHandler = () => {
		setShowDispatchModal(false)
	}

	const onSelectProductHandler = e => {
		const productId = e.target.value
		// if it is empty, don't do anything
		if (!productId) {
			setAmountOfSelectedProduct(0)
			return
		}

		const selectedProductAmount = productsToBeStored.filter(
			product => product.products.productId === e.target.value, // id of the selected product
		)

		setAmountOfSelectedProduct(selectedProductAmount[0].productContainerAmount)

		// fetchProductAmountInContainersFromSupabase(productId, selectedProductAmount)
	}

	const stockByContainerHandler = handleSubmit(data => {
		onDispatchProductHandler(data)
		// determines if the product already exists in the store
		// setSendingData(true)
		// insertProductIntoShopFromSupabase(data)
	})

	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as='div' className='relative z-10' onClose={closeModalHandler}>
				<TransitionChild
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='fixed inset-0 bg-black/25' />
				</TransitionChild>

				<div className='fixed inset-0 overflow-y-auto'>
					<div className='flex min-h-full items-center justify-center p-4 text-center'>
						<TransitionChild
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 scale-95'
							enterTo='opacity-100 scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 scale-100'
							leaveTo='opacity-0 scale-95'
						>
							<DialogPanel className='w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
								{loadingModalContainer ? (
									<div className='flex justify-center'>{<Spinner />}</div>
								) : (
									<div>
										{' '}
										<DialogTitle
											as='h3'
											className='text-lg font-medium leading-6 text-gray-900'
										>
											Despachar productos
										</DialogTitle>
										<div>
											<form onSubmit={stockByContainerHandler}>
												<div className='mb-2 flex flex-col'>
													<label id='productIdLabel' name='productId'>
														Productos
													</label>
													<select
														className='border border-black'
														{...register('productId', {
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
																key={product.products.productId}
																value={product.products.productId}
															>
																{product.products.productName}
															</option>
														))}
													</select>
													{errors.productId && (
														<p className='text-xs text-red-500 font-bold'>
															{errors.productId.message}
														</p>
													)}
												</div>
												{amountOfSelectedProduct > 0 ? (
													<p>
														Cantidad disponible :{' '}
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
												<div className='flex flex-col mb-2'>
													<label id='observationsLabel' htmlFor='observations'>
														¿El producto tiene alguna observación?
													</label>
													<textarea
														row='3'
														cols='3'
														className='border border-black'
														id='observations'
														{...register('observations')}
													/>
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
														Despachar
													</button>
												</div>
											</form>
											{/* {productsInSelectedContainer.length > 0 ? (
												<ProductsInSelectedContainer />
											) : null} */}
										</div>
									</div>
								)}
							</DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</Dialog>
		</Transition>
	)
}

export default DispatchProductModal
