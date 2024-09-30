import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
	fetchProductsWithAllInfo,
	fetchWarehouseDispatchOrders,
	insertDispatchOrder,
} from '../../../utils/warehouse/warehouse'
import { warehouseSliceAction } from '../../../store/warehouseSlice/warehouseSlice'
import DispatchForm from './DispatchForm/DispatchForm'
import DispatchDetail from './Modal/DispatchDetail'

const Dispatches = () => {
	const [isAnOrderSetUp, setIsAnOrderSetUp] = useState(
		localStorage.getItem('dispatchOrder') === null ? true : false,
	)
	const listOfProducts = useSelector(state => state.warehouseReducer.products)
	const dispatchOrders = useSelector(
		state => state.warehouseReducer.dispatchOrders,
	)
	const productsToBeDispatched = useSelector(
		state => state.warehouseReducer.productsToBeDispatched,
	)
	const [isOpen, setIsOpen] = useState(false)
	const dispatch = useDispatch()

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

	const fetchDispatchOrdersFromSupabase = async () => {
		const orders = await fetchWarehouseDispatchOrders()

		dispatch(warehouseSliceAction.dispatchOrders(orders))
		// console.log(orders)
	}

	const createCode = () => {
		// gets current date
		const currentDate = new Date()

		let code = ''

		// gets current day of the week
		switch (currentDate.getDay()) {
			case 0:
				code += 'D'
				break
			case 1:
				code += 'L'
				break
			case 2:
				code += 'M'
				break
			case 3:
				code += 'Mi'
				break
			case 4:
				code += 'J'
				break
			case 5:
				code += 'V'
				break
			case 6:
				code += 'S'
				break
		}

		// gets current date (0 -31)
		code += currentDate.getDate()

		// gets current month
		switch (currentDate.getMonth()) {
			case 0:
				code += '01'
				break
			case 1:
				code += '02'
				break
			case 2:
				code += '03'
				break
			case 3:
				code += '04'
				break
			case 4:
				code += '05'
				break
			case 5:
				code += '06'
				break
			case 6:
				code += '07'
				break
			case 8:
				code += '09'
				break
			case 9:
				code += '10'
				break
			case 10:
				code += '11'
				break
			case 11:
				code += '12'
				break
		}

		// gets full year
		code += currentDate.getFullYear()

		return code
	}

	// =========================
	// APP FUNCTIONS
	// =========================
	const getDateAndTime = () => {
		let date = new Date(orders[0].date)
		let timezoneOffset = date.getTimezoneOffset()
		let pstOffset = -300 // this is the offset for the Lima timezone
		let adjustedTime = new Date(
			date.getTime() + (pstOffset + timezoneOffset) * 60 * 1000,
		)

		// display the date and time in PST timezone
		let options = {
			day: 'numeric',
			month: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
			timeZone: 'America/Lima',
		}
		let pstDateTime = adjustedTime.toLocaleString('es-PE', options)
		return pstDateTime // Output: 2/16/2022, 11:01:20 AM
	}

	const createDispatchOrder = async () => {
		const code = createCode()

		const dispatchOrder = {
			orderCode: code,
			date: new Date(),
		}

		const orderCode = await insertDispatchOrder(dispatchOrder)
		// store the code in localstorage once it has been created
		localStorage.setItem('dispatchOrder', JSON.stringify(orderCode))
		setIsAnOrderSetUp(false)
	}

	const availableAmountOfProduct = product => {
		let updatedAmount = product.productContainerAmount

		// search if the product is already added to the list
		const filteredProduct = productsToBeDispatched.filter(
			element =>
				element.products.productId === product.products.productId &&
				element.containers.containerId === product.containers.containerId,
		)

		// product is stored in the dispatch list
		if (filteredProduct.length > 0) {
			updatedAmount =
				product.productContainerAmount -
				filteredProduct[0].productContainerAmount
		}

		return updatedAmount
	}

	const onOpenDispatchDetailModalHandler = () => {
		setIsOpen(true)
	}

	useEffect(() => {
		// fetch all the products
		fetchProductsFromSupabase()

		// dispatch orders
		fetchDispatchOrdersFromSupabase()
	}, [])

	return (
		<div>
			<h1 className='text-lg font-bold'>Ordenes de salida de productos</h1>
			<p>
				Sección destinada a despachar productos fuera del almacen. Realizar
				orden de{' '}
				<button
					type='button'
					className='bg-none underline text-blue-500'
					onClick={createDispatchOrder}
				>
					salida
				</button>
			</p>
			<p>
				¿Has agregado productos? Miralos{' '}
				<button
					type='button'
					className='bg-none underline text-blue-500'
					onClick={onOpenDispatchDetailModalHandler}
				>
					aqui
				</button>{' '}
			</p>
			{isOpen && <DispatchDetail isOpen={isOpen} setIsOpen={setIsOpen} />}
			<div>
				<table>
					<thead>
						<tr>
							<th className='border border-black'>Nombre</th>
							<th className='border border-black'>Tipo</th>
							<th className='border border-black'>Categoría</th>
							<th className='border border-black'>Cantidad</th>
							<th className='border border-black'>Vencimiento</th>
							<th className='border border-black'>Contenedor</th>
							<th className='border border-black'>Acción</th>
						</tr>
					</thead>
					<tbody>
						{listOfProducts.map(product => (
							<tr key={product.productContainerId}>
								<td className='border border-black'>
									{product.products.productName}
								</td>
								<td className='border border-black'>
									{product.products.productType.productTypeName}
								</td>
								<td className='border border-black'>
									{product.products.productCategory.productCategoryName}
								</td>
								<td className='border border-black'>
									{product.productContainerAmount}
								</td>
								<td className='border border-black'>
									{product.products.productExpirationDate}
								</td>
								<td className='border border-black'>
									{product.containers.containerCode}
								</td>
								<td className='border border-black'>
									<DispatchForm
										product={product}
										isAnOrderSetUp={isAnOrderSetUp}
									/>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}

export default Dispatches

// 0 not stored
// 1 stored
