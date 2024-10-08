import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { warehouseSliceAction } from '../../../store/warehouseSlice/warehouseSlice'
import {
	fetchProducts,
	fetchAvailableContainers,
	fetchProductsInSelectedContainer,
} from '../../../utils/warehouse/warehouse'
import StoreProductByContainerModal from './Modal/StoreProductByContainerModal'

const StoreProductsByContainer = () => {
	const productsToBeStored = useSelector(
		state => state.warehouseReducer.productsToBeStored,
	)
	const availableContainers = useSelector(
		state => state.warehouseReducer.availableContainers,
	)
	const formMessage = useSelector(state => state.warehouseReducer.formMessage)
	const dispatch = useDispatch()
	const [showContainerModal, setShowContainerModal] = useState(false)
	const [loadingModalContainer, setLoadingModalContainer] = useState(false)

	// =========================
	// FUNCTIONS WITH SUPABASE
	// =========================
	const fetchProductsFromSupabase = async () => {
		try {
			// fetch all the products to be stored from supabase
			const products = await fetchProducts()

			// store products fetched from database
			dispatch(warehouseSliceAction.productsToBeStored(products))
		} catch (error) {
			console.log(error)
		}
	}

	const fetchAvailableContainerFromSupabase = async () => {
		try {
			// fetch available containers from supabase
			const containers = await fetchAvailableContainers()
			// store containers fetched from database
			dispatch(warehouseSliceAction.availableContainers(containers))
		} catch (error) {
			console.log(error)
		}
	}

	const fetchProductsInSelectedContainerFromSupabase = async container => {
		try {
			//fetch producs in selected container from supabase
			const productsInSelectedContainer =
				await fetchProductsInSelectedContainer(container.containerId)
			dispatch(
				warehouseSliceAction.productsInSelectedContainer(
					productsInSelectedContainer,
				),
			)
			// hides loading spinner
			setLoadingModalContainer(false)
		} catch (error) {
			console.log(error)
		}
	}

	// =========================
	// APP FUNCTIONS
	// =========================
	const pickContainerHandler = containerInfo => {
		setLoadingModalContainer(true)
		setShowContainerModal(true)
		// cleans form message
		dispatch(warehouseSliceAction.showFormMessage(null))
		// stores information of the selected container
		dispatch(warehouseSliceAction.selectedContainerInfo(containerInfo))

		fetchProductsInSelectedContainerFromSupabase(containerInfo)
	}

	useEffect(() => {
		// products
		fetchProductsFromSupabase()
		//containers
		fetchAvailableContainerFromSupabase()
	}, [])

	// it is working correctly
	useEffect(() => {
		setTimeout(() => {
			dispatch(warehouseSliceAction.showFormMessage(null))
		}, 5000)
	}, [formMessage])

	return (
		<section>
			<h1 className='text-lg font-bold my-2'>
				Almacenar productos por contenedor
			</h1>
			<div className='flex'>
				<div>
					<h2 className='font-bold '>Listado de productos pendientes</h2>
					<table>
						<thead>
							<tr>
								<th className='border border-black'>Producto</th>
								<th className='border border-black'>Cantidad</th>
								<th className='border border-black'>Fecha de vencimiento</th>
							</tr>
						</thead>
						<tbody>
							{productsToBeStored.map(product => (
								<tr key={product.productAmount}>
									<td className='border border-black'>{product.productName}</td>
									<td className='border border-black'>
										{product.productAmount}
									</td>
									<td className='border border-black'>
										{product.productExpirationDate}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div className='ml-4'>
					<h2 className='font-bold'>Contenedores disponibles</h2>
					<table>
						<thead>
							<tr>
								<th className='border border-black'>Contenedor</th>
								<th className='border border-black'>Accion</th>
							</tr>
						</thead>
						<tbody>
							{availableContainers.map(container => (
								<tr key={container.containerId}>
									<td className='border border-black'>
										{container.containerCode}
									</td>
									<td className='border border-black'>
										<div>
											<button
												type='button'
												className='px-2 py-2 rounded-md text-white bg-green-400 font-bold text-sm'
												onClick={() => pickContainerHandler(container)}
											>
												Almacenar
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				{/* Open different modals */}
				<div className='ml-4'>
					<h2 className='font-bold'>Crear:</h2>
					<ul className='flex flex-col border border-black p-2'>
						<li>Nueva Categoría </li>
						<li>Nueva Marca </li>
						<li>Nuevo Tipo de Producto </li>
						<li>Nuevo Contenedor </li>
						<li>Nuevo Tipo de Contenedor </li>
					</ul>
				</div>
				{showContainerModal && (
					<StoreProductByContainerModal
						isOpen={showContainerModal}
						setShowContainerModal={setShowContainerModal}
						loadingModalContainer={loadingModalContainer}
						setLoadingModalContainer={setLoadingModalContainer}
					/>
				)}
			</div>
		</section>
	)
}

export default StoreProductsByContainer
