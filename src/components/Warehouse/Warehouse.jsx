import { Outlet, Link } from 'react-router-dom'

const Warehouse = () => {
	return (
		<div>
			Almacen
			<li className='ml-2'>
				<Link to='store-product-by-container'>
					Almacenar producto por contenedor
				</Link>
			</li>
			<Outlet />
		</div>
	)
}

export default Warehouse
