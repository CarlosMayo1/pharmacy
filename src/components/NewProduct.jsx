import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { supabase } from '../utils/supabase.client'

// supbase functions
const checkProductInDatabase = async productName => {
	const { error, data } = await supabase
		.from('products')
		.select()
		.eq('productName', productName)
	return data
}

// insert new producto
const insertNewProduct = async product => {
	const { error } = await supabase.from('products').insert(product)
	return error
}

const SuccessfulProductInsertedMessage = () => {
	return (
		<h3 className='text-green-500 font-bold'>
			El producto se ha insertado correctamente
		</h3>
	)
}

const NewProduct = () => {
	const [isInserted, setIsInserted] = useState(false)
	const {
		register,
		handleSubmit,
		setError,
		reset,
		formState: { errors },
	} = useForm()

	const insertProductForm = handleSubmit(data => {
		checkProductInDatabase(data.productName).then(response => {
			// it doesn't allow to insert the product if it already exits
			if (response.length > 0) {
				setError('registeredProduct', {
					type: 'custom',
					message: 'Este producto ya se encuentra registrado',
				})
				return
			}

			const newProduct = {
				productName: data.productName,
				productBrandId: data.productBrandId,
				productCategoryId: data.productCategoryId,
				productExpirationDate: formatInputDate(data.productExpirationDate),
				productIndications: data.productIndications,
				productSpecification: data.productSpecification,
				productObservations: data.productObservations,
				productPrice: Number(data.productPrice),
				productAmount: Number(data.productAmount),
				productTypeId: data.productTypeId,
				isStored: 0,
				status: 1,
			}
			console.log(newProduct)
			// defining the columns to be inserted in the database
			insertNewProduct(newProduct)
				.then(() => {
					// reset form to default values
					reset()
				})
				.finally(() => {
					setIsInserted(true)
				})
		})
	})

	const formatInputDate = date => {
		const newDate = date.split('-')
		const currentDate = [newDate[2], newDate[1], newDate[0]]
		const formatedDate = currentDate.join('-')
		return formatedDate
	}

	useEffect(() => {
		setTimeout(() => {
			setIsInserted(false)
		}, 3000)
	}, [isInserted])

	return (
		<section className='px-4 flex justify-center py-4'>
			<div className=''>
				<h1 className='text-lg font-bold'>Sección de Productos</h1>

				<form
					className='w-96 border border-black rounded-r p-2'
					onSubmit={insertProductForm}
				>
					<h2 className='py-2 text-lg font-bold'>Ingreso de nuevo producto</h2>
					{isInserted ? <SuccessfulProductInsertedMessage /> : ''}
					{errors.registeredProduct && (
						<h3 className=' text-red-600 font-bold'>
							{errors.registeredProduct.message}
						</h3>
					)}
					<div className='flex flex-col mb-1'>
						<label htmlFor='productName'>Nombre del producto</label>
						<input
							className='border border-black '
							type='text'
							name='productName'
							id='productName'
							{...register('productName', { required: true })}
						/>
						{errors.productName && (
							<p className='text-xs text-red-600 font-bold'>
								Colocar el nombre del producto
							</p>
						)}
					</div>

					<div className='flex flex-col mb-1'>
						<label htmlFor='productType'>Tipo de producto</label>
						<select
							className='border border-black '
							type='select'
							name='productType'
							id='productType'
							{...register('productTypeId', { required: true })}
						>
							<option value=''>Seleccione el tipo de producto</option>
							<option value='9500cecd-f171-4edd-b02a-2908d327909e'>
								Jarabe
							</option>
							<option value='ca5b6a80-e285-485e-b276-1d39b9ba83f9'>
								Tableta
							</option>
							<option value='3d3df0a7-d424-46c3-8b59-9cf614e761c6'>
								Ampolla
							</option>
						</select>
						{errors.productTypeId && (
							<p className='text-xs text-red-600 font-bold'>
								Seleccionar el tipo de producto
							</p>
						)}
					</div>
					<div className='flex flex-col mb-1'>
						<label htmlFor='producCategory'>Categoría del producto</label>
						<select
							className='border border-black '
							type='select'
							name='productCategory'
							id='productCategory'
							{...register('productCategoryId', { required: true })}
						>
							<option value=''>Seleccione la categoría del producto</option>
							<option value='254d9f0e-f81f-40c6-aeef-66171638a634'>
								Antibiótico
							</option>
							<option value='b833140e-c969-49ec-a374-062478e414cd'>
								Antihestamínico
							</option>
							<option value='dd9cc274-a30a-4227-be7b-9886762686d3'>
								Antigripal
							</option>
						</select>
						{errors.productCategoryId && (
							<p className='text-xs text-red-600 font-bold'>
								Seleccionar categoría del producto
							</p>
						)}
					</div>
					<div className='flex flex-col mb-1'>
						<label htmlFor='producBrand'>Marca del producto</label>
						<select
							className='border border-black '
							type='select'
							name='productBrand'
							id='productBrand'
							{...register('productBrandId', { required: true })}
						>
							<option value=''>Seleccione la marca del producto</option>
							<option value='26d6d87b-d4ad-431b-9b34-f868dad25ffb'>
								Portugal
							</option>
							<option value='b10a8769-8b8c-4bf5-8e6c-f2519de4dfe6'>
								IQ Pharma
							</option>
							<option value='d9ac537d-bcf3-4406-bfba-85b22a6bd8b2'>
								Bayer
							</option>
						</select>
						{errors.productBrandId && (
							<p className='text-xs text-red-600 font-bold'>
								Seleccionar la marca del producto
							</p>
						)}
					</div>
					<div className='flex flex-col mb-1'>
						<label htmlFor='productExpirationDate'>
							Fecha de expiración del produto
						</label>
						<input
							className='border border-black '
							type='text'
							name='productExpirationDate'
							id='productExpirationDate'
							placeholder='dd-mm-yyyy'
							// pattern='\d{4}-\d{2}-\d{2}'
							{...register('productExpirationDate', {
								required: true,
								pattern: /\d{2}-\d{2}-\d{4}/,
							})}
						/>
						{errors.productExpirationDate && (
							<p className='text-xs text-red-600 font-bold'>
								Colocar la fecha de expiración
							</p>
						)}
					</div>
					<div className='flex flex-col mb-1'>
						<label htmlFor='productAmount'>Cantidad de producto</label>
						<input
							className='border border-black '
							type='number'
							name='productAmount'
							id='productAmount'
							{...register('productAmount', { required: true })}
						/>
						{errors.productAmount && (
							<p className='text-xs text-red-600 font-bold'>
								Colocar la cantidad de producto
							</p>
						)}
					</div>
					<div className='flex flex-col mb-1'>
						<label htmlFor='productPrice'>Precio del producto</label>
						<input
							className='border border-black '
							type='number'
							name='productPrice'
							id='productPrice'
							step={'0.01'}
							{...register('productPrice', { required: true })}
						/>
						{errors.productAmount && (
							<p className='text-xs text-red-600 font-bold'>
								Colocar la Precio de producto
							</p>
						)}
					</div>
					<div className='flex flex-col mb-1'>
						<label htmlFor='productSpecification'>
							Especificaciones del producto
						</label>
						<textarea
							height={3}
							width={3}
							className='border border-black '
							type='text'
							name='productSpecification'
							id='productSpecification'
							{...register('productSpecification', { required: true })}
						/>
						{errors.productSpecification && (
							<p className='text-xs text-red-600 font-bold'>
								Colocar especificaciones del producto
							</p>
						)}
					</div>
					<div className='flex flex-col mb-1'>
						<label htmlFor='productIndications'>
							Indicaciones del producto
						</label>
						<textarea
							height={3}
							width={3}
							className='border border-black '
							type='text'
							name='productIndications'
							id='productIndications'
							{...register('productIndications', { required: true })}
						/>
						{errors.productIndications && (
							<p className='text-xs text-red-600 font-bold'>
								Colocar indicaciones del producto
							</p>
						)}
					</div>
					<div className='flex flex-col mb-1'>
						<label htmlFor='productObservations'>¿Alguna observación?</label>
						<textarea
							height={3}
							width={3}
							className='border border-black '
							type='text'
							name='productObservations'
							id='productObservations'
							{...register('productObservations')}
						/>
					</div>
					<div className='text-center'>
						<button
							type='submit'
							className='bg-blue-400 rounded-md px-1.5 py-1 text-white'
							name='productForm'
							id='productForm'
						>
							Agregar
						</button>
					</div>
				</form>
			</div>
			<div className='ml-4'>
				<div>
					<p>Productos ingresados: 100</p>
					<p>Productos pendientes por almacenar: 4</p>
				</div>
			</div>
		</section>
	)
}

export default NewProduct
