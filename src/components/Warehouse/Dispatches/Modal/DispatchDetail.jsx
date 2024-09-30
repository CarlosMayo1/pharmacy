import { Fragment, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Transition, Dialog } from '@headlessui/react'
import {
	fetchProductsWithAllInfo,
	fetchWarehouseDispatchDetail,
	fectchProductInSelectedContainer,
	updateProductAmountInSelectedContainer,
	deleteDispatchedProduct,
} from '../../../../utils/warehouse/warehouse'
import { warehouseSliceAction } from '../../../../store/warehouseSlice/warehouseSlice'

const DispatchDetail = ({ isOpen, setIsOpen }) => {
	const listOfProducts = useSelector(state => state.warehouseReducer.products)
	const listOfDispatchedProducts = useSelector(
		state => state.warehouseReducer.dispatchedProducts,
	)
	const dispatch = useDispatch()
	// gets the order created
	const dispatchOrder = JSON.parse(localStorage.getItem('dispatchOrder'))
	const orderCode = dispatchOrder[0].orderCode

	// =========================
	// FUNCTIONS WITH SUPABASE
	// =========================
	const fetchProductsFromSupabase = async () => {
		try {
			const products = await fetchProductsWithAllInfo()

			// console.log(products)

			if (products === null) return
			dispatch(warehouseSliceAction.products(products))
		} catch (error) {
			throw new Error(error)
		}
	}

	const fetchListOfDispatchedProducts = async () => {
		try {
			const products = await fetchWarehouseDispatchDetail()
			dispatch(warehouseSliceAction.dispatchedProducts(products))
			console.log(products)
		} catch (error) {
			throw Error(error)
		}
	}

	const deleteDispatchedProductFromSupabase = async product => {
		try {
			console.log(product)
			// delete record
			const deletedProduct = await deleteDispatchedProduct(
				product.orderDetailId,
			)

			console.log(deletedProduct)

			// if (deletedProduct !== null) return

			// I think the best idea is to fetch from database directly
			const selectedProduct = await fectchProductInSelectedContainer(
				product.products.productId,
				product.containers.containerId,
			)

			console.log(selectedProduct)

			const updatedAmount =
				Number(selectedProduct[0].productContainerAmount) +
				Number(product.productAmount)

			console.log(updatedAmount)

			const updateProductAmount = await updateProductAmountInSelectedContainer(
				product.products.productId,
				product.containers.containerId,
				updatedAmount,
			)

			if (updateProductAmount !== null) return

			fetchListOfDispatchedProducts()
			fetchProductsFromSupabase()

			// console.log(deletedProduct)
		} catch (error) {
			throw new Error(error)
		}
	}

	// =========================
	// APP FUNCTIONS
	// =========================
	const closeModal = () => {
		setIsOpen(false)
	}

	const onDeleteDispatchedProduct = product => {
		console.log(product)
		deleteDispatchedProductFromSupabase(product)
	}

	useEffect(() => {
		fetchListOfDispatchedProducts()
	}, [])

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
							<Dialog.Panel className='w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
								<Dialog.Title
									as='h3'
									className='text-lg font-medium leading-6 text-gray-900 mb-2'
								>
									Orden #{orderCode}
								</Dialog.Title>
								<div>
									<h1 className='font-medium mb-2'>
										Detalle de la orden de salida
									</h1>
									<table>
										<thead>
											<tr>
												<th className='border border-black'>Nombre</th>
												<th className='border border-black'>Cantidad </th>
												<th className='border border-black'>Vencimiento</th>
												<th className='border border-black'>Contenedor</th>
												<th className='border border-black'>Acciones</th>
											</tr>
										</thead>
										<tbody>
											{listOfDispatchedProducts.map(product => (
												<tr key={product.orderDetailId}>
													<td className='border border-black font-bold text-sm'>
														{product.products.productName}
													</td>
													<td className='border border-black'>
														{product.productAmount}
													</td>
													<td className='border border-black'>
														{product.products.productExpirationDate}
													</td>
													<td className='border border-black'>
														{product.containers.containerCode}
													</td>
													<td className='border border-black'>
														<button
															className='bg-red-500 text-white text-sm font-bold px-2 py-2 rounded-md'
															onClick={() => onDeleteDispatchedProduct(product)}
														>
															Eliminar
														</button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	)
}

export default DispatchDetail
