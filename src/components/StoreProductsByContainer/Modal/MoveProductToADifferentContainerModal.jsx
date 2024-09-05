import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'

const MoveProductOtADifferentContainerModal = ({ isOpen, setIsOpen }) => {
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
								<div>
									{/* <h3
										className={`mb-2 font-bold ${
											formMessage?.status === 'ERROR'
												? 'text-red-500'
												: 'text-green-500'
										}`}
									></h3> */}

									<div className='flex flex-col mb-2'>
										<label className='mb-1'>Contenedor</label>
										<select className='border border-black'>
											<option>Seleccione contenedor</option>
											<option>DV0001</option>
											<option>DV0002</option>
										</select>
									</div>
									<div className='text-center'>
										<button className='bg-blue-400 font-bold text-white text-sm rounded-md p-2'>
											Mover
										</button>
									</div>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	)
}

export default MoveProductOtADifferentContainerModal
