import { useState, Fragment } from 'react'
import { useDispatch } from 'react-redux'
import {
	Transition,
	TransitionChild,
	Dialog,
	DialogPanel,
	DialogTitle,
} from '@headlessui/react'
import { useForm } from 'react-hook-form'
import {
	fetchProductBrand,
	fetchExistingProductBrand,
	insertProductBrand,
} from '../../../utils/products/products'
import { productSliceAction } from '../../../store/productSlice/productSlice'
import toast from 'react-hot-toast'
import SmallSpinner from '../../UI/Spinner/SmallSpinner'

const ProductBrand = ({ isOpen, setIsOpen }) => {
	const dispatch = useDispatch()
	const {
		handleSubmit,
		register,
		reset,
		formState: { errors },
	} = useForm({
		formState: {
			productBrandName: '',
		},
	})
	const [isLoading, setIsLoading] = useState(false)

	const closeModal = () => {
		setIsOpen(false)
	}

	// ========================
	// SUPABASE FUNCTIONS
	// ========================
	const fetchProductBrands = async () => {
		try {
			const productBrands = await fetchProductBrand()
			dispatch(productSliceAction.productBrand(productBrands))
		} catch (error) {
			throw new Error(error)
		}
	}

	const insertProductBrandFromSupabase = async productBrandName => {
		try {
			setIsLoading(true)
			const existingBrand = await fetchExistingProductBrand(productBrandName)
			if (existingBrand.length > 0) {
				toast.error('Esta marca ya se encuentra registrada')
				setIsLoading(true)
				return
			}

			const insert = {
				productBrandName,
				status: 1,
			}

			const productBrand = await insertProductBrand(insert)

			if (productBrand !== null) {
				toast.error('Error al ingresar la marca')
				setIsLoading(true)
				return
			}

			toast.success('Ingreso correcto')
			reset()
			setIsOpen(false)
			fetchProductBrands()
			setIsLoading(false)
		} catch (error) {
			throw new Error(error)
		}
	}

	// ========================
	// APP FUNCTIONS
	// ========================

	const onSubmitFormHandler = handleSubmit(data => {
		insertProductBrandFromSupabase(data.productBrandName)
	})

	return (
		<Transition appear show={isOpen} as={Fragment}>
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
							<DialogPanel className='w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
								<DialogTitle
									as='h3'
									className='text-xl font-medium leading-6 text-gray-900 mb-2'
								>
									Crear marca
								</DialogTitle>
								<div>
									<h1 className='font-medium mb-2'>Información General</h1>
									<form onSubmit={onSubmitFormHandler}>
										<div className='flex flex-col mb-1.5'>
											<label
												name='productBrandLabel'
												id='productBrandLabel'
												htmlFor='productBrandName'
											>
												Marca del producto
											</label>
											<input
												type='text'
												id='productBrandName'
												className='border border-black'
												placeholder='Ingresar la marca de producto'
												{...register('productBrandName', {
													required: {
														value: true,
														message: 'Completar este campo',
													},
												})}
											/>
											{errors.productBrandName && (
												<p className='text-sm font-medium text-red-600'>
													{errors.productBrandName.message}
												</p>
											)}
										</div>
										<div className='text-center'>
											<button
												type='submit'
												className={`${
													isLoading ? 'bg-blue-300' : 'bg-blue-500'
												} p-1.5 text-white font-bold rounded-md`}
												disabled={isLoading}
											>
												{isLoading && <SmallSpinner />}
												Guardar
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

export default ProductBrand
