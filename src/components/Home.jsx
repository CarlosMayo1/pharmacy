import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'

function Home() {
	return (
		<div>
			<div className='grid grid-cols-[300px,1fr]'>
				<div className='px-2'>
					<h2>Menú principal</h2>
					<nav>
						<ul>
							<li>
								<Link to='/'>Inicio</Link>
							</li>
							<li className='font-bold'>Ventas</li>
							<li className='ml-2'>
								<Link to='sell'>Venta</Link>
							</li>
							<li className='font-bold'>Productos</li>
							<li className='ml-2'>
								<Link to='list-products'>Catálogo de productos</Link>
							</li>
							<li className='font-bold'>Almacen</li>
							<li className='ml-2'>
								<Link to='store-product'>Almacenar</Link>
							</li>
							<li className='ml-2'>
								<Link to='products'>Productos</Link>
							</li>
							<li className='ml-2'>
								<Link to='dispatches'>Salidas</Link>
							</li>
						</ul>
					</nav>
				</div>
				<main>
					<Outlet />
				</main>
			</div>
		</div>
	)
}

export default Home
