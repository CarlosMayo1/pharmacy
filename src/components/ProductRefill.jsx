import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase.client'
import { useForm } from 'react-hook-form'

const REPLACE_IN_THRESHOLD = {
	high: 300,
	medium: 150,
	low: 80,
}

// supabase
const fetchProductsToRefill = async (min, max) => {
	const { error, data } = await supabase
		.from('products')
		.select(
			`productId, productName, productAmount, productCategory:productCategoryId(productCategoryName, replaceInTreshold)`,
		)
		.gte('productAmount', min)
		.lte('productAmount', max)
	return data
}

const updateProduct = async (productId, productAmount) => {
	const { error } = await supabase
		.from('products')
		.update({ productAmount: productAmount })
		.eq('productId', productId)
	return error
}

const ProductRefill = () => {
	const [minProductAmount, setMinProductAmount] = useState(0)
	const [maxProductAmount, setMaxProductAmount] = useState(300)
	const [productsToRefill, setProductToRefill] = useState([])
	const [productToBeRefill, setProductToBeRefill] = useState(null)
	const { handleSubmit, register } = useForm()

	const minProductAmountHandler = e => {
		console.log(e.target.value)
		setMinProductAmount(e.target.value)
	}

	const maxProductAmountHandler = e => {
		console.log(e.target.value)
		setMaxProductAmount(e.target.value)
	}

	const onFilterProductsByAmount = e => {
		e.preventDefault()
		console.log('filtring')
		fetchProductsToRefill(minProductAmount, maxProductAmount).then(response => {
			console.log(response)
			setProductToRefill(response)
		})
	}

	const pickAProductToBeRefill = product => {
		console.log(product)
		setProductToBeRefill(product)
	}

	const refillProductInSupabase = handleSubmit(data => {
		// update total amount in products table
		updateProduct(productToBeRefill.productId, data.refillAmount).then(
			response => console.log(response),
		)
	})

	useEffect(() => {
		fetchProductsToRefill(minProductAmount, maxProductAmount).then(response => {
			console.log(response)
			setProductToRefill(response)
		})
	}, [])

	return (
		<section>
			<h1 className='text-lg py-2 font-bold'>Rellenar producto</h1>
			<form className='py-2 mb-2' onSubmit={onFilterProductsByAmount}>
				<h2 className='font-bold mb-2'>Filtrar por cantidad</h2>
				<div className='flex items-center'>
					<div>
						<label>Cantidad mínima</label>
						<input
							type='number'
							className='w-20 border border-black ml-2'
							name='minAmount'
							id='minAmount'
							min={0}
							value={minProductAmount}
							onChange={minProductAmountHandler}
						/>
					</div>
					<div className='ml-4'>
						<label>Cantidad máxima</label>
						<input
							type='number'
							className='w-20 border border-black ml-2'
							name='maxAmount'
							id='maxAmount'
							value={maxProductAmount}
							onChange={maxProductAmountHandler}
						/>
					</div>
					<div className='ml-2'>
						<button
							type='submit'
							className='px-2 py-2 bg-slate-400 font-bold text-white text-sm rounded-md'
						>
							Buscar
						</button>
					</div>
				</div>
			</form>
			<div className='flex justify-between'>
				<div>
					<h2 className='mb-2'>Productos para ser rellenados</h2>
					<table className='border border-black'>
						<thead className='border border-black'>
							<tr>
								<th className='border border-black'>Producto</th>
								<th className='border border-black'>Cantidad</th>
								<th className='border border-black'>Acción</th>
							</tr>
						</thead>
						<tbody>
							{productsToRefill.map(product => (
								<tr key={product.productId}>
									<td className='border border-black'>{product.productName}</td>
									<td className='border border-black text-center'>
										{product.productAmount}
									</td>
									<td className='border border-black'>
										<button
											className='px-2 py-1 bg-blue-500 text-white rounded-md'
											onClick={() => pickAProductToBeRefill(product)}
										>
											Agregar
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<div className='mx-2'>
					<h2 className='mb-2'>Rellenar producto</h2>
					<form
						className='px-2 py-2 border border-black'
						onSubmit={refillProductInSupabase}
					>
						<div className='flex flex-col mb-2'>
							<label>Producto</label>
							<p>{productToBeRefill?.productName}</p>
						</div>
						<div className='flex flex-col mb-2'>
							<label>Rellenar</label>
							<input
								type='text'
								className='border border-black'
								id='refill'
								name='refill'
								{...register('refillAmount')}
							/>
						</div>
						<button
							type='submit'
							className='px-2 py-2 rounded-md font-bold text-white bg-blue-500'
						>
							Rellenar
						</button>
					</form>
				</div>
			</div>
		</section>
	)
}

export default ProductRefill
