import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useForm } from 'react-hook-form'

// ====================
// SUPABASE FUNCTIONS
// ====================

const MoveProductOtADifferentContainerModal = ({
	isOpen,
	setIsOpen,
	availableContainers,
}) => {
	const { handleSubmit, register } = useForm()

	const onSubmitFormHandler = handleSubmit(data => {
		console.log(data)
	})

	const closeModal = () => {
		setIsOpen(false)
	}

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
											{...register('availableContainer', {
												required: {
													value: true,
													message: 'Se require este campo',
												},
											})}
										>
											<option>Seleccione contenedor</option>
											{availableContainers.map(container => (
												<option
													key={container.containerId}
													value={container.containerId}
												>
													{container.containerCode}
												</option>
											))}
										</select>
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
