import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase.client'
import StoreProductByContainerModal from './Modal/StoreProductByContainerModal'

// ====================
// SUPABASE FUNCTIONS
// ====================
const fetchProducts = async () => {
	const { data, error } = await supabase
		.from('products')
		.select('productId, productName, productAmount, productExpirationDate')
		.neq('isStored', 1)
	return data
}

const fetchAvailableContainers = async () => {
	const { data, error } = await supabase
		.from('containers')
		.select('containerId, containerCode')
		.neq('status', 0)
	return data
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

const StoreProductsByContainer = () => {
	const [productsToBeStored, setProductsToBeStored] = useState([])
	const [availableContainers, setAvailableContainers] = useState([])
	const [productsInSelectedContainer, setProductsInSelectedContainer] =
		useState([])
	const [container, setContainer] = useState(null)
	const [formMessage, setFormMessage] = useState({})
	const [showContainerModal, setShowContainerModal] = useState(false)
	const [loadingModalContainer, setLoadingModalContainer] = useState(false)

	const pickContainerHandler = containerInfo => {
		setLoadingModalContainer(true)
		setShowContainerModal(true)
		fetchProductsInSelectedContainer(containerInfo.containerId)
			.then(response => {
				setProductsInSelectedContainer(response)
			})
			.finally(() => {
				// gets containers information
				setContainer(containerInfo)
				setLoadingModalContainer(false)
			})
	}

	// Form message
	const FORM_MESSAGE = {
		success: 'SUCCESS',
		error: 'ERROR',
		emptyContainer: 'Es necesario un contenedor',
		insert: 'Producto insertado correctamente',
		update: 'Producto actualizado correctamente',
		delete: 'Producto eliminado correctamente',
	}

	useEffect(() => {
		fetchProducts().then(response => {
			console.log(response)
			setProductsToBeStored(response)
		})

		fetchAvailableContainers().then(response => {
			console.log(response)
			setAvailableContainers(response)
		})
	}, [])

	// it is working correctly
	useEffect(() => {
		setTimeout(() => {
			setFormMessage(null)
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
						productsInSelectedContainer={productsInSelectedContainer}
						setProductsInSelectedContainer={setProductsInSelectedContainer}
						container={container}
						formMessage={formMessage}
						setFormMessage={setFormMessage}
						productsToBeStored={productsToBeStored}
						setProductsToBeStored={setProductsToBeStored}
						FORM_MESSAGE={FORM_MESSAGE}
						loadingModalContainer={loadingModalContainer}
						availableContainers={availableContainers}
					/>
				)}
			</div>
		</section>
	)
}

export default StoreProductsByContainer
