import { useState, Fragment } from 'react'
import {
	Transition,
	TransitionChild,
	Dialog,
	DialogPanel,
	DialogTitle,
} from '@headlessui/react'
import { IconSettingsPlus } from '@tabler/icons-react'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import {
	fetchProducts,
	fetchExistingProduct,
	insertNewProduct,
	updateProduct,
} from '../../../utils/products/products'
import { productSliceAction } from '../../../store/productSlice/productSlice'
import ProductType from './ProductType'
import toast from 'react-hot-toast'
import ProductBrand from './ProductBrand'
import ProductCategory from './ProductCategory'

const NewProduct = ({ isOpen, setIsOpen }) => {
	const productTypes = useSelector(state => state.productReducer.productType)
	const productBrands = useSelector(state => state.productReducer.productBrand)
	const editProduct = useSelector(state => state.productReducer.editProduct)
	const productCategories = useSelector(
		state => state.productReducer.productCategory,
	)
	const [isOpenProductTypeModal, setIsOpenProductTypeModal] = useState(false)
	const [isOpenProductCategoryModal, setIsOpenProductCategoryModal] =
		useState(false)
	const [isOpenProductBrandModal, setIsOpenProductBrandModal] = useState(false)
	const dispatch = useDispatch()
	const {
		handleSubmit,
		register,
		reset,
		setError,
		formState: { errors },
	} = useForm({
		defaultValues: {
			productName: editProduct?.productName,
			productExpirationDate: editProduct?.productExpirationDate,
			productAmount: editProduct?.productAmount,
			productPrice: editProduct?.productPrice,
			productType: editProduct?.productType.productTypeId,
			productBrand: editProduct?.productBrand.productBrandId,
			productCategory: editProduct?.productCategory.productCategoryId,
			productSpecifications: editProduct?.productSpecifications,
			productIndications: editProduct?.productIndications,
			productObservations: editProduct?.productObservations,
		},
	})

	const closeModal = () => {
		dispatch(productSliceAction.editProduct(null))
		setIsOpen(false)
	}
	// ========================
	// SUPABASE FUNCTIONS
	// ========================
	const fetchCatalogOfProducts = async () => {
		try {
			const products = await fetchProducts()
			dispatch(productSliceAction.products(products))
		} catch (error) {
			throw new Error(error)
		}
	}

	const updateExistingProduct = async product => {
		try {
			const edit = {
				productId: editProduct.productId,
				productName: product.productName,
				productExpirationDate: product.productExpirationDate,
				productAmount: product.productAmount,
				productPrice: product.productPrice,
				productTypeId: product.productType,
				productBrandId: product.productBrand,
				productCategoryId: product.productCategory,
				productSpecifications: product.productSpecifications,
				productIndications: product.productIndications,
				productObservations: product.productObservations,
				isStored: 0,
				status: 1,
			}

			const update = await updateProduct(edit)
			if (update !== null) {
				toast.error('Error al editar el producto')
				return
			}

			toast.success('Producto editado correctamente')
			fetchCatalogOfProducts()
			setIsOpen(false)
		} catch (error) {
			throw new Error(error)
		}
	}

	const insertNewProductIntoSupabase = async product => {
		try {
			const newProduct = {
				productName: product.productName,
				productExpirationDate: product.productExpirationDate,
				productAmount: product.productAmount,
				productPrice: product.productPrice,
				productTypeId: product.productType,
				productBrandId: product.productBrand,
				productCategoryId: product.productCategory,
				productSpecifications: product.productSpecifications,
				productIndications: product.productIndications,
				productObservations: product.productObservations,
				isStored: 0,
				status: 1,
			}

			const existingProduct = await fetchExistingProduct(newProduct.productName)

			// if the product already exits
			if (existingProduct.length > 0) {
				toast.error('Este producto ya se encuentra registrado', {
					duration: 6000,
				})
				return
			}

			const error = await insertNewProduct(newProduct)
			if (error !== null) {
				toast.error('Error al ingresar nuevo producto')
				return
			}

			toast.success('Producto ingresado correctamente')
			reset()

			// refresh catalog of products
			fetchCatalogOfProducts()
		} catch (error) {
			throw new Error(error)
		}
	}

	// ========================
	// APP FUNCTIONS
	// ========================
	const onSubmitFormHandler = handleSubmit(data => {
		if (data.productAmount <= 0) {
			setError('productAmount', {
				type: 'custom',
				message: 'No se acepta zero ni números negativos',
			})
			return
		}

		if (data.productPrice <= 0) {
			setError('productPrice', {
				type: 'custom',
				message: 'No se acepta zero ni números negativos',
			})
			return
		}

		if (editProduct !== null) {
			updateExistingProduct(data)
		} else {
			console.log('sending a new product')
			insertNewProductIntoSupabase(data)
		}
	})

	const openProductTypeModalHandler = () => {
		setIsOpenProductTypeModal(true)
	}

	const openProductBrandModalHandler = () => {
		setIsOpenProductBrandModal(true)
	}

	const openProductCategoryModalHandler = () => {
		setIsOpenProductCategoryModal(true)
	}

	return (
		<Transition appear show={isOpen} as={Fragment}>
			{isOpenProductTypeModal && (
				<ProductType
					isOpen={isOpenProductTypeModal}
					setIsOpen={setIsOpenProductTypeModal}
				/>
			)}
			{isOpenProductBrandModal && (
				<ProductBrand
					isOpen={isOpenProductBrandModal}
					setIsOpen={setIsOpenProductBrandModal}
				/>
			)}
			{isOpenProductCategoryModal && (
				<ProductCategory
					isOpen={isOpenProductCategoryModal}
					setIsOpen={setIsOpenProductCategoryModal}
				/>
			)}
			<Dialog as='div' className='relative z-10' onClose={closeModal}>
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
							<DialogPanel className='w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
								<DialogTitle
									as='h3'
									className='text-xl font-medium leading-6 text-gray-900 mb-2'
								>
									Nuevo Producto / Editar Producto
								</DialogTitle>
								<div>
									<h1 className='font-medium mb-2'>Información General</h1>
									<form onSubmit={onSubmitFormHandler}>
										<div className='flex justify-between mb-2'>
											<div className='w-full mr-3 border border-black p-1'>
												<div className='flex flex-col mb-1.5'>
													<label
														name='productNameLabel'
														id='productNameLabel'
														htmlFor='productName'
													>
														Nombre del producto
													</label>
													<input
														type='text'
														id='productName'
														className='border border-black'
														placeholder='Ingresar el nombre del producto'
														{...register('productName', {
															required: {
																value: true,
																message: 'Completar este campo',
															},
														})}
													/>
													{errors.productName && (
														<p className='text-sm font-medium text-red-600'>
															{errors.productName.message}
														</p>
													)}
												</div>
												<div className='flex flex-col mb-1'>
													<label
														name='productExpirationDateLabel'
														id='productExpirationDateLabel'
														htmlFor='productExpirationDate'
													>
														Fecha de vencimiento
													</label>
													<input
														type='date'
														id='productExpirationDate'
														className='border border-black'
														{...register('productExpirationDate', {
															required: {
																value: true,
																message: 'Completar este campo',
															},
														})}
													/>
													{errors.productExpirationDate && (
														<p className='text-sm font-medium text-red-600'>
															{errors.productExpirationDate.message}
														</p>
													)}
												</div>
												<div className='flex flex-col mb-1'>
													<label
														name='productAmountLabel'
														id='productAmountLabel'
														htmlFor='productAmount'
													>
														Cantidad
													</label>
													<input
														type='number'
														id='productAmount'
														className='border border-black'
														placeholder='Cantidad de producto'
														{...register('productAmount', {
															required: {
																value: true,
																message: 'Completar este campo',
															},
														})}
													/>
													{errors.productAmount && (
														<p className='text-sm font-medium text-red-600'>
															{errors.productAmount.message}
														</p>
													)}
												</div>
												<div className='flex flex-col mb-1'>
													<label
														name='productPriceLabel'
														id='productPriceLabel'
														htmlFor='productPrice'
													>
														Precio
													</label>
													<input
														type='float'
														id='productPrice'
														className='border border-black w-full'
														placeholder='Precio del producto'
														{...register('productPrice', {
															required: {
																value: true,
																message: 'Completar este campo',
															},
														})}
													/>
													{errors.productPrice && (
														<p className='text-sm font-medium text-red-600'>
															{errors.productPrice.message}
														</p>
													)}
												</div>
											</div>

											{/* Select Options */}
											<div className='w-full border border-black p-1.5'>
												<div className='flex flex-col mb-1.5'>
													<label
														name='productTypeLabel'
														id='productTypeLabel'
														htmlFor='productType'
													>
														Tipo de producto
													</label>
													<div className='flex'>
														<select
															className='w-full border border-black mr-1'
															id='productType'
															{...register('productType', {
																required: {
																	value: true,
																	message: 'Completar este campo',
																},
															})}
														>
															<option value=''>Seleccione el tipo</option>
															{productTypes.map(type => (
																<option
																	key={type.productTypeId}
																	value={type.productTypeId}
																>
																	{type.productTypeName}
																</option>
															))}
														</select>
														<button
															type='button'
															className='bg-gray-400 rounded-md p-1'
															onClick={openProductTypeModalHandler}
														>
															<IconSettingsPlus className='text-white' />
														</button>
													</div>
													{errors.productType && (
														<p className='text-sm font-medium text-red-600'>
															{errors.productType.message}
														</p>
													)}
												</div>
												<div className='flex flex-col mb-1.5'>
													<label
														name='productBrandLabel'
														id='productBrandLabel'
														htmlFor='productBrand'
													>
														Marca del producto
													</label>
													<div className='flex'>
														<select
															className='w-full border border-black mr-1'
															id='productBrand'
															{...register('productBrand', {
																required: {
																	value: true,
																	message: 'Completar este campo',
																},
															})}
														>
															<option value=''>Seleccione la marca</option>
															{productBrands.map(brand => (
																<option
																	key={brand.productBrandId}
																	value={brand.productBrandId}
																>
																	{brand.productBrandName}
																</option>
															))}
														</select>
														<button
															type='button'
															className='bg-gray-400 rounded-md p-1'
															onClick={openProductBrandModalHandler}
														>
															<IconSettingsPlus className='text-white' />
														</button>
													</div>
													{errors.productBrand && (
														<p className='text-sm font-medium text-red-600'>
															{errors.productBrand.message}
														</p>
													)}
												</div>
												<div className='flex flex-col'>
													<label
														name='productCategoryLabel'
														id='productCategoryLabel'
														htmlFor='productCategory'
													>
														Categoría del producto
													</label>
													<div className='flex'>
														<select
															className='w-full border border-black mr-1'
															id='productCategory'
															{...register('productCategory', {
																required: {
																	value: true,
																	message: 'Completar este campo',
																},
															})}
														>
															<option value=''>Seleccione la categoría</option>
															{productCategories.map(category => (
																<option
																	key={category.productCategoryId}
																	value={category.productCategoryId}
																>
																	{category.productCategoryName}
																</option>
															))}
														</select>
														<button
															type='button'
															className='bg-gray-400 rounded-md p-1'
															onClick={openProductCategoryModalHandler}
														>
															<IconSettingsPlus className='text-white' />
														</button>
													</div>
													{errors.productCategory && (
														<p className='text-sm font-medium text-red-600'>
															{errors.productCategory.message}
														</p>
													)}
												</div>
											</div>
										</div>
										{/* Text area section */}
										<div className='mb-2'>
											<div className='flex flex-col'>
												<label
													name='productSpecificationsLabel'
													id='productSpecificationsLabel'
													htmlFor='productSpecifications'
												>
													Especificaciones del producto
												</label>
												<textarea
													id='productSpecifications'
													rows='4'
													col='3'
													className='border border-black'
													{...register('productSpecifications')}
												/>
											</div>
											<div className='flex flex-col'>
												<label
													name='productIndicationsLabel'
													id='productIndicationsLabel'
													htmlFor='productIndications'
												>
													Indicaciones del producto
												</label>
												<textarea
													id='productIndications'
													rows='4'
													col='3'
													className='border border-black'
													{...register('productIndications')}
												/>
											</div>
											<div className='flex flex-col'>
												<label
													name='productObservationsLabel'
													id='productObservationsLabel'
													htmlFor='productObservations'
												>
													¿Alguna observación?
												</label>
												<textarea
													id='productObservations'
													rows='4'
													col='3'
													className='border border-black'
													{...register('productObservations')}
												/>
											</div>
										</div>
										<div className='text-center'>
											<button
												type='submit'
												className='bg-blue-500 p-1.5 text-white font-bold rounded-md'
											>
												{editProduct !== null ? 'Editar' : 'Guardar'}
											</button>
										</div>
									</form>
								</div>
							</DialogPanel>
						</TransitionChild>
					</div>
				</div>
			</Dialog>
		</Transition>
	)
}

export default NewProduct
