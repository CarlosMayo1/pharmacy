// 📘 TODO-LIST
// 1. Insertar productos para poder organizarlos dentro de las cajas o contenedores
// 2. Poder editar el product, elimar el product, funciones básicas de CRUD
// 3. Llevar registro de productos que salen, la fecha en que salen, la cantidad que salen y la razon por la que salen
// 4. Para este punto considero buena idea hacer una lista de razones por las que un producto puede salir
// 5. Historial de ingreso de productos, historial de salida de productos
import { useEffect } from 'react'
import { supabase } from './utils/supabase.client'

function App() {
	useEffect(() => {
		const getDataFromSupabase = async () => {
			const { error, data } = await supabase.from('products').select()
			return data
		}

		const allProducts = getDataFromSupabase()
		allProducts.then(response => {
			console.log(response)
		})
	}, [])
	return (
		<div className='App'>
			{/* container */}
			<div className='max-w-7xl p-2'>
				{/* Product form */}
				<section className='flex justify-evenly'>
					<form className='max-w-lg border border-black rounded-r p-2'>
						<h2 className='py-2 text-lg font-bold'>
							Ingreso de nuevo producto
						</h2>
						<div className='flex flex-col mb-1'>
							<label htmlFor='productName'>Nombre del producto</label>
							<input
								className='border border-black '
								type='text'
								name='productName'
								id='productName'
							/>
						</div>
						<div className='flex flex-col mb-1'>
							<label htmlFor='productType'>Tipo de producto</label>
							<select
								className='border border-black '
								type='select'
								name='productType'
								id='productType'
							>
								<option value=''>Seleccione el tipo de producto</option>
								<option value='Jarabe'>Jarabe</option>
								<option value='Tableta'>Tableta</option>
								<option value='Ampolla'>Ampolla</option>
							</select>
						</div>
						<div className='flex flex-col mb-1'>
							<label htmlFor='producCategory'>Categoría del producto</label>
							<select
								className='border border-black '
								type='select'
								name='productCategory'
								id='productCategory'
							>
								<option value=''>Seleccione la categoría del producto</option>
								<option value='Antibiótico'>Antibiótico</option>
								<option value='Antihestamínico'>Antihestamínico</option>
								<option value='Antigripal'>Antigripal</option>
							</select>
						</div>
						<div className='flex flex-col mb-1'>
							<label htmlFor='producBrand'>Marca del producto</label>
							<select
								className='border border-black '
								type='select'
								name='productBrand'
								id='productBrand'
							>
								<option value=''>Seleccione la marca del producto</option>
								<option value='Portugal'>Portugal</option>
								<option value='IQ Pharma'>IQ Pharma</option>
								<option value='Bayer'>Bayer</option>
							</select>
						</div>
						<div className='flex flex-col mb-1'>
							<label htmlFor='productExpirationDate'>
								Fecha de expiración del produto
							</label>
							<input
								className='border border-black '
								type='date'
								name='productExpirationDate'
								id='productExpirationDate'
							/>
						</div>
						<div className='flex flex-col mb-1'>
							<label htmlFor='productPrice'>Precio del producto</label>
							<input
								className='border border-black '
								type='number'
								name='productPrice'
								id='productPrice'
							/>
						</div>
						<div className='flex flex-col mb-1'>
							<label htmlFor='productSpecifications'>
								Especificaciones del producto
							</label>
							<textarea
								height={3}
								width={3}
								className='border border-black '
								type='text'
								name='productSpecifications'
								id='productSpecifications'
							/>
						</div>
						<div className='flex flex-col mb-1'>
							<label htmlFor='productIndications'>
								Indicicaciones del producto
							</label>
							<textarea
								height={3}
								width={3}
								className='border border-black '
								type='text'
								name='productIndications'
								id='productIndications'
							/>
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
							/>
						</div>
						<div className='text-center'>
							<button className='bg-blue-400 rounded-md px-1.5 py-1 text-white'>
								Agregar
							</button>
						</div>
					</form>
					{/* Store products */}
					<form className='max-w-lg border border-black rounded-r p-2 h-full'>
						<h2 className='py-2 text-lg font-bold'>Almacenar producto</h2>
						<div className='flex flex-col mb-1'>
							<label htmlFor='containerType'>Seleccionar contenedor</label>
							<select
								className='border border-black '
								type='select'
								name='containerType'
								id='containerType'
							>
								<option value=''>Seleccione el tipo de contenedor</option>
								<option value='DN000002'>DN000002</option>
								<option value='DN000001'>DN000001</option>
							</select>
						</div>
						<div className='flex flex-col mb-1'>
							<label htmlFor='product'>Seleccionar producto</label>
							<select
								className='border border-black '
								type='select'
								name='product'
								id='product'
							>
								<option value=''>Seleccione el producto</option>
								<option value='Amoxicilina 500mg'>Amoxicilina 500mg</option>
								<option value='Clorfenamina Meleato 2mg/5mL - 120mL'>
									Clorfenamina Meleato 2mg/5mL - 120mL
								</option>
								<option value='Paracetamol 120mg/5mL - 60mL'>
									Paracetamol 120mg/5mL - 60mL
								</option>
							</select>
						</div>
						<div className='flex flex-col mb-1'>
							<label htmlFor='productContainerAmount'>Cantidad</label>
							<input
								className='border border-black '
								type='number'
								name='productContainerAmount'
								id='productContainerAmount'
							/>
						</div>
						<div className='flex flex-col mb-1'>
							<label htmlFor='containerObservations'>
								¿Alguna observación?
							</label>
							<textarea
								height={3}
								width={3}
								className='border border-black '
								type='text'
								name='containerObservations'
								id='containerObservations'
							/>
						</div>
						{/* List of products added to the container */}
						<div className='mb-1'>
							<table className='border border-black'>
								<thead className='border border-black'>
									<tr>
										<th className='border border-black'>Producto</th>
										<th className='border border-black'>Cantidad</th>
										<th className='border border-black'>
											Fecha de vencimiento
										</th>
										<th>Acciones</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<th className='border border-black'>Amoxicilina 500mg</th>
										<th className='border border-black'>500</th>
										<th className='border border-black'>02/04/2025</th>
										<th className='border border-black'>
											<div>
												<button className='px-1.5 py-1 bg-blue-600 text-white rounded-sm text-sm'>
													Agregar
												</button>
												<button className='px-1.5 py-1 bg-red-600 text-white rounded-sm text-sm'>
													Agregar
												</button>
											</div>
										</th>
									</tr>
									<tr>
										<th className='border border-black'>
											Paracetamol 120mg/5mL - 60mL
										</th>
										<th className='border border-black'>40</th>
										<th className='border border-black'>04/02/2026</th>
										<th className='border border-black'>
											<div>
												<button className='px-1.5 py-1 bg-blue-600 text-white rounded-sm text-sm'>
													Agregar
												</button>
												<button className='px-1.5 py-1 bg-red-600 text-white rounded-sm text-sm'>
													Agregar
												</button>
											</div>
										</th>
									</tr>
									<tr>
										<th className='border border-black'>
											Clorfenamina Meleato 2mg/5mL - 120mL
										</th>
										<th className='border border-black'>20</th>
										<th className='border border-black'>03/02/2025</th>
										<th className='border border-black'>
											<div>
												<button className='px-1.5 py-1 bg-blue-600 text-white rounded-sm text-sm'>
													Agregar
												</button>
												<button className='px-1.5 py-1 bg-red-600 text-white rounded-sm text-sm'>
													Agregar
												</button>
											</div>
										</th>
									</tr>
								</tbody>
							</table>
						</div>
						<div className='text-center'>
							<button className='bg-gree-400 rounded-md px-1.5 py-1 text-white'>
								Completar
							</button>
						</div>
					</form>
					{/* Container form */}
					<form className='max-w-lg border border-black rounded-r p-2 h-full'>
						<h2 className='py-2 text-lg font-bold'>
							Ingreso de nuevo contenedor
						</h2>
						<div className='flex flex-col mb-1'>
							<label htmlFor='containerCode'>Código del contenedor</label>
							<input
								className='border border-black '
								type='text'
								name='containerCode'
								id='containerCode'
							/>
						</div>

						<div className='flex flex-col mb-1'>
							<label htmlFor='containerType'>Tipo de contenedor</label>
							<select
								className='border border-black '
								type='select'
								name='containerType'
								id='containerType'
							>
								<option value=''>Seleccione el tipo de contenedor</option>
								<option value='Caja de cartón'>Caja de cartón</option>
								<option value='Caja plástica'>Caja plástica</option>
							</select>
						</div>

						<div className='flex flex-col mb-1'>
							<label htmlFor='containerObservations'>
								¿Alguna observación?
							</label>
							<textarea
								height={3}
								width={3}
								className='border border-black '
								type='text'
								name='containerObservations'
								id='containerObservations'
							/>
						</div>
						<div className='text-center'>
							<button className='bg-blue-400 rounded-md px-1.5 py-1 text-white'>
								Insertar
							</button>
						</div>
					</form>
				</section>
			</div>
		</div>
	)
}

export default App
