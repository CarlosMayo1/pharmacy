import { useState } from 'react'
import MoveProductOtADifferentContainerModal from '../Modal/MoveProductToADifferentContainerModal'

const ProductsInSelectedContainer = ({ productsInSelectedContainer }) => {
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
							<th className='border border-black text-sm'>Producto</th>
							<th className='border border-black text-sm'>Cantidad</th>
							<th className='border border-black text-sm'>Vencimiento</th>
							<th className='border border-black text-sm'>Acción</th>
						</tr>
					</thead>
					<tbody>
						{productsInSelectedContainer.map(product => (
							<tr key={product.productContainerId}>
								<td className='border border-black font-bold text-sm'>
									{product.products.productName}
								</td>
								<td className='border border-black text-sm'>
									{product.productContainerAmount}
								</td>
								<td className='border border-black text-sm'>
									{product.products.productExpirationDate}
								</td>
								<td className='border border-black'>
									<button
										type='button'
										onClick={onMoveToAnotherContainerHandler}
									>
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
					/>
				)}
			</div>
		</div>
	)
}

export default ProductsInSelectedContainer
