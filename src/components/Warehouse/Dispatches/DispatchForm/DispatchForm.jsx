import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { warehouseSliceAction } from '../../../../store/warehouseSlice/warehouseSlice'
import {
	fetchProductsWithAllInfo,
	fetchExistingDispatchedProduct,
	insertDispatchOrderDetail,
	insertDispatchedProduct,
	updateProductAmountInSelectedContainer,
	updateStatusOfStoreProducts,
	updateExistingDispatchedProductAmount,
} from '../../../../utils/warehouse/warehouse'

const DispatchForm = ({ product, isAnOrderSetUp }) => {
	const listOfProducts = useSelector(state => state.warehouseReducer.products)
	const disaptchedProducts = useSelector(
		state => state.warehouseReducer.dispatchedProducts,
	)
	const [productAmount, setProductAmount] = useState('')
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

	const insertDispatchOrderDetailFromSupabase = async product => {
		try {
			// gets the order created
			const dispatchOrder = JSON.parse(localStorage.getItem('dispatchOrder'))
			const id = dispatchOrder[0].orderId
			// create the detail to be inserted

			// looks for an existing product
			const existingDispatchedProduct = await fetchExistingDispatchedProduct(
				id,
				product.products.productId,
				product.containers.containerId,
			)

			// if it already exists
			if (existingDispatchedProduct.length > 0) {
				const updatedAmount =
					Number(existingDispatchedProduct[0].productAmount) +
					Number(productAmount)

				const update = await updateExistingDispatchedProductAmount(
					id,
					product.products.productId,
					product.containers.containerId,
					updatedAmount,
				)
				if (update !== null) return
			} else {
				const dispatchOrderDetail = {
					orderId: id,
					productId: product.products.productId,
					containerId: product.containers.containerId,
					productAmount: productAmount,
				}
				const detail = await insertDispatchOrderDetail(dispatchOrderDetail)

				if (detail !== null) return
			}

			// update amount of product
			const updatedAmount = product.productContainerAmount - productAmount

			const error = await updateProductAmountInSelectedContainer(
				product.products.productId,
				product.containers.containerId,
				updatedAmount,
			)

			// <------ TRY THIS SECTION TO SEE IF IT WORKS -------->

			// // gets all the products
			// const selectedProduct = listOfProducts.filter(
			// 	element => element.products.productId === product.products.productId,
			// )

			// const amountOfSelectedProduct = selectedProduct.reduce(
			// 	(accumulator, currentValue) =>
			// 		accumulator + currentValue.productContainerAmount,
			// 	0,
			// )

			// if (amountOfSelectedProduct === 0) {
			// 	const error = await updateStatusOfStoreProducts(
			// 		0,
			// 		product.products.productId,
			// 	)
			// }

			// console.log(error)

			fetchProductsFromSupabase()
		} catch (error) {
			throw new Error(error)
		}
	}

	// =========================
	// APP FUNCTIONS
	// =========================
	const onGetProductAmountHandler = e => {
		setProductAmount(e.target.value)
	}

	const addProductToBeDispatchedHandler = product => {
		// avoids empty field
		if (
			productAmount === '' ||
			productAmount < 0 ||
			productAmount > product.productContainerAmount
		)
			return

		// insert dispatch order detail into supabase
		insertDispatchOrderDetailFromSupabase(product)

		setProductAmount('')
	}

	return (
		<form>
			<div>
				<label>Cantidad</label>
				<input
					type='number'
					className='border border-black w-20'
					value={productAmount}
					onChange={onGetProductAmountHandler}
				/>
				<button
					type='button'
					className={`${
						isAnOrderSetUp ? 'bg-slate-400' : 'bg-blue-500'
					} rounded-md p-1 text-white font-bold`}
					onClick={() => addProductToBeDispatchedHandler(product)}
					disabled={isAnOrderSetUp}
				>
					Agregar
				</button>
			</div>
		</form>
	)
}

export default DispatchForm
