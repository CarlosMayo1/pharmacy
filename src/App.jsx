import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import NewProduct from './components/NewProduct'
import StoreProductsByContainer from './components/Warehouse/StoreProductsByContainer/StoreProductsByContainer'
import Products from './components/Warehouse/Products/Products'
import ProductRefill from './components/ProductRefill'
import ProductRefillByContainer from './components/ProductRefillByContainer'
import Dispatches from './components/Warehouse/Dispatches/Dispatches'

function App() {
	return (
		<div className='App'>
			<Routes>
				<Route path='/' element={<Home />}>
					<Route path='/new-product' element={<NewProduct />} />
					<Route path='/products' element={<Products />} />
					<Route path='/product-refill' element={<ProductRefill />} />
					<Route
						path='/product-refill-by-container'
						element={<ProductRefillByContainer />}
					/>
					<Route
						path='/store-product-by-container'
						element={<StoreProductsByContainer />}
					/>
					<Route path='/dispatches' element={<Dispatches />} />
				</Route>
			</Routes>
		</div>
	)
}

export default App
