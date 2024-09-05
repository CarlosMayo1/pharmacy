import { Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import NewProduct from './components/NewProduct'
import StoreProductsByContainer from './components/StoreProductsByContainer/StoreProductsByContainer'
import Products from './components/Products/Products'
import ProductRefill from './components/ProductRefill'
import ProductRefillByContainer from './components/ProductRefillByContainer'

function App() {
	return (
		<div className='App'>
			<Routes>
				<Route path='/' element={<Home />}>
					<Route path='/new-product' element={<NewProduct />} />
					<Route
						path='/store-product-by-container'
						element={<StoreProductsByContainer />}
					/>
					<Route path='/products' element={<Products />} />
					<Route path='/product-refill' element={<ProductRefill />} />
					<Route
						path='/product-refill-by-container'
						element={<ProductRefillByContainer />}
					/>
				</Route>
			</Routes>
		</div>
	)
}

export default App
