import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useForm } from 'react-hook-form'
import { supabase } from '../../../utils/supabase.client'

// ====================
// SUPABASE FUNCTIONS
// ====================
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

// const updateAmountOfSelectedProductStoredInContainer = async (
// 	updateProductContainerAmount,
// 	productContainerId,
// ) => {
// 	const { error } = await supabase
// 		.from('product_container')
// 		.update({ productContainerAmount: updateProductContainerAmount })
// 		.eq('productContainerId', productContainerId)
// 	return error
// }

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

const deleteProductStoreInContainer = async productContainerId => {
	const response = await supabase
		.from('product_container')
		.delete()
		.eq('productContainerId', productContainerId)
	return response
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

const MoveProductOtADifferentContainerModal = ({
	isOpen,
	setIsOpen,
	container,
	availableContainers,
	productSelectedToBeMoved,
	setProductsInSelectedContainer,
}) => {
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm()

	const onSubmitFormHandler = handleSubmit(data => {
		// search in the selected container to see if the product already exists there
		fetchProductsInSelectedContainer(data.container).then(response => {
			const filteredProduct = response.filter(
				product => product.productId === productSelectedToBeMoved.productId,
			)

			console.log(filteredProduct)
			// container is empty
			if (filteredProduct.length === 0) {
				// probar cuando tienes otros productos
				updateProductContainer(
					data.container,
					productSelectedToBeMoved.productContainerId,
				).then(() => {
					fetchProductsInSelectedContainer(container.containerId).then(
						response => setProductsInSelectedContainer(response),
					)
				})
			} else {
				const updatedProductContainerAmount =
					productSelectedToBeMoved.productContainerAmount +
					filteredProduct[0].productContainerAmount
				updateProductAmountInSelectedContainer(
					filteredProduct[0].productId,
					filteredProduct[0].containerId,
					updatedProductContainerAmount,
				)
					.then(response => {
						if (response === null) {
							deleteProductStoreInContainer(
								productSelectedToBeMoved.productContainerId,
							)
								.then(response => console.log(response))
								.then(() => {
									fetchProductsInSelectedContainer(container.containerId).then(
										response => setProductsInSelectedContainer(response),
									)
								})
						}
					})
					.catch(e => console.log(e))
			}
		})
	})

	const closeModal = () => {
		setIsOpen(false)
	}

	const listOfAvailableContainers = availableContainers.filter(
		item => item.containerId !== container.containerId,
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
											className='bg-green-500 font-bold text-white text-sm rounded-md p-2'
										>
											Mover
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
