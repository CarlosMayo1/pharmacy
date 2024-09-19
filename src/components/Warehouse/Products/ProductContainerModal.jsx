import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { supabase } from '../../../utils/supabase.client'
import { useForm } from 'react-hook-form'

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

const ProductContainerModal = ({
	isOpen,
	selectedProduct,
	setShowContainerModal,
	containers,
	fetchProducts,
	setProducts,
}) => {
	const {
		handleSubmit,
		register,
		formState: { errors },
	} = useForm()

	const closeContainerModalHandler = () => {
		setShowContainerModal(false)
	}

	const moveContainerFormHandler = handleSubmit(data => {
		updateProductContainer(
			data.containerId,
			selectedProduct.productContainerId,
		).then(() => {
			fetchProducts().then(response => setProducts(response))
			setShowContainerModal(false)
		})
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
							<Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
								<Dialog.Title
									as='h3'
									className='text-lg font-medium leading-6 text-gray-900'
								>
									Cambiar Contenedor
								</Dialog.Title>
								<div className='mt-2'>
									<p>
										Producto Seleccionado:{' '}
										<span className='font-bold'>
											{selectedProduct.products.productName}
										</span>
									</p>
									<p>
										Cantidad:{' '}
										<span className='font-bold'>
											{selectedProduct.productContainerAmount}
										</span>
									</p>
								</div>
								<form onSubmit={moveContainerFormHandler}>
									<div className='flex flex-col'>
										<label>Elegir contenedor</label>
										<select
											className='border border-black'
											{...register('containerId', {
												required: {
													value: true,
													message: 'Seleccionar contenedor',
												},
											})}
										>
											<option value=''>Seleccione el contenedor</option>
											{containers.map(container => (
												<option
													key={container.containerId}
													value={container.containerId}
												>
													{container.containerCode}
												</option>
											))}
										</select>
										{errors.containerCode && (
											<p className='text-red-500 text-sm font-bold'>
												{errors.containerCode.message}
											</p>
										)}
									</div>
									<div className='mt-4'>
										<button
											type='submit'
											className='inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
										>
											Cambiar
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

export default ProductContainerModal
