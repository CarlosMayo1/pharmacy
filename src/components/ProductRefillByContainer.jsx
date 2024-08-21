import { supabase } from '../utils/supabase.client'

// supabase
const fetchProductsByContainer = async () => {
	const { error, data } = await supabase.from('product_container').select()
}

const ProductRefillByContainer = () => {
	return (
		<section>
			<h1 className='text-lg font-bold mb-2'>
				Rellenar producto por contendor
			</h1>
			<table>
				<thead>
					<tr>
						<th className='border border-black'>Producto</th>
						<th className='border border-black'>Tipo</th>
						<th className='border border-black'>Cantidad</th>
						<th className='border border-black'>Contenedor</th>
						<th className='border border-black'>Fecha de vencimiento</th>
						<th className='border border-black'>Observaciones</th>
						<th className='border border-black'>Acciones</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td className='border border-black'>Paracetamol 120mg/5mL</td>
						<td className='border border-black'>Jarabe</td>
						<td className='border border-black'>40</td>
						<td className='border border-black'>DN0001</td>
						<td className='border border-black'>05/04/2026</td>
						<td className='border border-black'>
							Hay dos productos que vencen para la fecha de 01/01/2025
						</td>
						<td className='border border-black'>Rellenar</td>
					</tr>
				</tbody>
			</table>
		</section>
	)
}

export default ProductRefillByContainer
