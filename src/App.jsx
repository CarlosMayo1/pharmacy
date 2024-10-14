import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import StoreProductsByContainer from './components/Warehouse/StoreProductsByContainer/StoreProductsByContainer'
import Products from './components/Warehouse/Products/Products'
import ProductRefill from './components/ProductRefill'
import Dispatches from './components/Warehouse/Dispatches/Dispatches'
import CatalagOfProducts from './components/Products/Products'
import Shop from './components/Shop/Shop'
import { Toaster } from 'react-hot-toast'

function App() {
	return (
		<div className='App'>
			<Toaster position='top-center' />
			<Routes>
				<Route path='/' element={<Home />}>
					<Route path='/list-products' element={<CatalagOfProducts />} />
					<Route path='/sell' element={<Shop />} />
					<Route path='/products' element={<Products />} />
					<Route path='/product-refill' element={<ProductRefill />} />
					<Route path='/store-product' element={<StoreProductsByContainer />} />
					<Route path='/dispatches' element={<Dispatches />} />
				</Route>
			</Routes>
		</div>
	)
}

export default App
