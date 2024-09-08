import { useState } from 'react'
import MoveProductOtADifferentContainerModal from '../Modal/MoveProductToADifferentContainerModal'
import { IconPackageExport } from '@tabler/icons-react'

const ProductsInSelectedContainer = ({
	productsInSelectedContainer,
	availableContainers,
}) => {
	const [isOpen, setIsOpen] = useState(false)

	const onMoveToAnotherContainerHandler = () => {
		setIsOpen(true)
	}

	return (
		<div className='mb-2'>
			<div>
				<h2 className='font-bold mb-2'>Productos Almacenados</h2>
				<table>
					<thead>
						<tr>
							<th className='border border-black text-sm p-1.5'>Producto</th>
							<th className='border border-black text-sm'>Cantidad</th>
							<th className='border border-black text-sm'>Vence</th>
							<th className='border border-black text-sm p-1.5'>Acción</th>
						</tr>
					</thead>
					<tbody>
						{productsInSelectedContainer.map(product => (
							<tr key={product.productContainerId}>
								<td className='border border-black font-bold text-xs p-1.5'>
									{product.products.productName}
								</td>
								<td className='border border-black text-sm'>
									{product.productContainerAmount}
								</td>
								<td className='border border-black text-sm'>
									{product.products.productExpirationDate}
								</td>
								<td className='border border-black p-1.5'>
									<button
										type='button'
										className='flex bg-indigo-500 text-white text-sm items-center p-1.5 rounded-md font-bold'
										onClick={onMoveToAnotherContainerHandler}
									>
										<IconPackageExport size={17} className='mr-1' />
										Mover
									</button>
									{/* <button
                className='bg-red-500 px-2 py-2 rounded-md text-white font-bold text-sm'
                onClick={() =>
                  onRemoveProductInContainer(
                    product.productContainerId,
                    product.productId,
                    product.containerId,
                  )
                }
              >
                Eliminar
              </button> */}
								</td>
							</tr>
						))}
					</tbody>
				</table>
				{isOpen && (
					<MoveProductOtADifferentContainerModal
						isOpen={isOpen}
						setIsOpen={setIsOpen}
						availableContainers={availableContainers}
					/>
				)}
			</div>
		</div>
	)
}

export default ProductsInSelectedContainer
