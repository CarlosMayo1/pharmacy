import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'

function Home() {
	return (
		<div className='App'>
			<div className='grid grid-cols-[300px,1fr]'>
				<div className='px-2'>
					<h2>Menú principal</h2>
					<nav>
						<ul>
							<li>
								<Link to='/'>Inicio</Link>
							</li>
							<li className='font-bold'>Almacen</li>
							<li className='ml-2'>
								<Link to='new-product'>Nuevo producto</Link>
							</li>
							<li className='ml-2'>
								<Link to='products'>Productos</Link>
							</li>
							<li className='ml-2'>
								<Link to='store-product-by-container'>Almacenar</Link>
							</li>
							<li className='ml-2'>
								<Link to='product-refill'>Rellenar producto</Link>
							</li>
							<li className='ml-2'>
								<Link to='product-refill-by-container'>
									Rellenar producto por contenedor
								</Link>
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
