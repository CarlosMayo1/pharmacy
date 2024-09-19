import { Fragment, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Dialog, Transition } from '@headlessui/react'
import { useForm } from 'react-hook-form'
import {
	fetchProductsInSelectedContainer,
	updateProductContainerCode,
	updateProductAmountInSelectedContainer,
	deleteProductStoreInContainer,
} from '../../../../utils/warehouse/warehouse'
import { warehouseSliceAction } from '../../../../store/warehouseSlice/warehouseSlice'
import { FORM_MESSAGE } from '../../../../constants/constants'
import SmallSpinner from '../../../UI/Spinner/SmallSpinner'

const MoveProductOtADifferentContainerModal = ({ isOpen, setIsOpen }) => {
	const availableContainers = useSelector(
		state => state.warehouseReducer.availableContainers,
	)
	const selectedContainer = useSelector(
		state => state.warehouseReducer.selectedContainerInfo,
	)
	const selectedProductToBeMoved = useSelector(
		state => state.warehouseReducer.selectedProductToBeMoved,
	)
	const [sendingData, setSendingData] = useState(false)
	const dispatch = useDispatch()
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm()

	// =========================
	// FUNCTIONS WITH SUPABASE
	// =========================
	const onMoveProductToADifferentContainer = async data => {
		// fetch all the products stored in the selected container
		const fetchProducts = await fetchProductsInSelectedContainer(data.container)

		// check if the product already exits in database
		const filteredProduct = fetchProducts.filter(
			product => product.productId === selectedProductToBeMoved.productId,
		)

		// if container is empty
		if (filteredProduct.length === 0) {
			const error = await updateProductContainerCode(
				data.container,
				selectedProductToBeMoved.productContainerId,
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
		} else {
			// amount to be updated
			const updatedAmount =
				selectedProductToBeMoved.productContainerAmount +
				filteredProduct[0].productContainerAmount

			const error = await updateProductAmountInSelectedContainer(
				filteredProduct[0].productId,
				filteredProduct[0].containerId,
				updatedAmount,
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

			// delete product once it has been moved
			const deleted = await deleteProductStoreInContainer(
				selectedProductToBeMoved.productContainerId,
			)
			if (deleted !== null) {
				dispatch(
					warehouseSliceAction.showFormMessage({
						status: FORM_MESSAGE.error,
						message: FORM_MESSAGE.deleteError,
					}),
				)
				return
			}
		}
		// fetch list of products again
		const products = await fetchProductsInSelectedContainer(
			selectedContainer.containerId,
		)
		dispatch(warehouseSliceAction.productsInSelectedContainer(products))
		dispatch(
			warehouseSliceAction.showFormMessage({
				status: FORM_MESSAGE.success,
				message: FORM_MESSAGE.insert,
			}),
		)

		setSendingData(false)
		setIsOpen(false)
	}

	const onSubmitFormHandler = handleSubmit(data => {
		// cleans any message in the form
		dispatch(warehouseSliceAction.showFormMessage(null))
		// prevents button to be clicked more than once
		setSendingData(true)
		onMoveProductToADifferentContainer(data)
	})

	const closeModal = () => {
		setIsOpen(false)
	}

	const listOfAvailableContainers = availableContainers.filter(
		item => item.containerId !== selectedContainer.containerId,
	)

	return (
		<Transition appear show={isOpen} as={Fragment}>
			<Dialog as='div' className='relative z-10' onClose={closeModal}>
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
							<Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
								<Dialog.Title
									as='h3'
									className='text-lg font-medium leading-6 text-gray-900 mb-2'
								>
									Cambiar Contendor
								</Dialog.Title>
								<form onSubmit={onSubmitFormHandler}>
									<div className='flex flex-col mb-2'>
										<label className='mb-1'>Seleccionar Contenedor</label>
										<select
											className='border border-black'
											{...register('container', {
												required: {
													value: true,
													message: 'Se require este campo',
												},
											})}
										>
											<option value=''>Seleccione contenedor</option>
											{listOfAvailableContainers.map(container => (
												<option
													key={container.containerId}
													value={container.containerId}
												>
													{container.containerCode}
												</option>
											))}
										</select>
										{errors.container && (
											<p className='text-xs text-red-500 font-bold'>
												{errors.container.message}
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
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	)
}

export default MoveProductOtADifferentContainerModal
