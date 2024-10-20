import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import MoveProductOtADifferentContainerModal from '../Modal/MoveProductToADifferentContainerModal'
import { IconPackageExport } from '@tabler/icons-react'
import { warehouseSliceAction } from '../../../../store/warehouseSlice/warehouseSlice'

const ProductsInSelectedContainer = () => {
	const [isOpen, setIsOpen] = useState(false)
	const productsInSelectedContainer = useSelector(
		state => state.warehouseReducer.productsInSelectedContainer,
	)
	const dispatch = useDispatch()

	const onMoveToAnotherContainerHandler = product => {
		dispatch(warehouseSliceAction.selectedProductToBeMoved(product))
		setIsOpen(true)
	}

	const getFormattedDate = date => {
		const newDate = date.split('-')
		const currentDate = [newDate[2], newDate[1], newDate[0]]
		return currentDate.join('/')
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
									{getFormattedDate(product.products.productExpirationDate)}
								</td>
								<td className='border border-black p-1.5'>
									<button
										type='button'
										className='flex bg-indigo-500 text-white text-sm items-center p-1.5 rounded-md font-bold'
										onClick={() => onMoveToAnotherContainerHandler(product)}
									>
										<IconPackageExport size={17} className='mr-1' />
										Mover
									</button>
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
