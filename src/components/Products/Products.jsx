import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProducts } from '../../utils/products/products'
import { productSliceAction } from '../../store/productSlice/productSlice'
import NewProduct from './Modal/NewProduct'
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react'
import {
	fetchProductType,
	fetchProductBrand,
	fetchProductCategory,
	deleteProduct,
} from '../../utils/products/products'
import toast from 'react-hot-toast'

const Products = () => {
	const catalogOfProducts = useSelector(state => state.productReducer.products)
	const [isOpen, setIsOpen] = useState()
	const dispatch = useDispatch()
	// =======================
	// SUPABASE FUNCTIONS
	// =======================
	const fetchFormSelectOptionsFromSupabase = async () => {
		try {
			// fetch product type
			const productTypes = await fetchProductType()
			dispatch(productSliceAction.productType(productTypes))

			const productBrands = await fetchProductBrand()
			dispatch(productSliceAction.productBrand(productBrands))

			const productCategories = await fetchProductCategory()
			dispatch(productSliceAction.productCategory(productCategories))
		} catch (error) {
			throw new Error(error)
		}
	}

	const fetchCatalogOfProducts = async () => {
		try {
			const products = await fetchProducts()
			dispatch(productSliceAction.products(products))
		} catch (error) {
			throw new Error(error)
		}
	}

	const deleteProductFromSupabase = async productId => {
		try {
			const error = await deleteProduct(productId)

			if (error.error !== null) {
				toast.error('Error al eliminar el producto')
				return
			}
			toast.success('Eliminado correctamente')
			fetchCatalogOfProducts()
		} catch (error) {
			throw new Error(error)
		}
	}

	// =======================
	// APP FUNCTIONS
	// =======================
	const onNewProductModal = () => {
		setIsOpen(true)
	}

	const onEditProductHandler = product => {
		console.log(product)
		dispatch(productSliceAction.editProduct(product))
		setIsOpen(true)
	}

	const onDeleteProductHandler = productId => {
		deleteProductFromSupabase(productId)
	}

	const getFormattedDate = date => {
		const newDate = date.split('-')
		const currentDate = [newDate[2], newDate[1], newDate[0]]
		return currentDate.join('/')
	}

	useEffect(() => {
		fetchCatalogOfProducts()
		fetchFormSelectOptionsFromSupabase()
	}, [])

	return (
		<section>
			<h1 className='font-bold text-lg mb-2'>Catálogo de productos</h1>
			<div className='mb-2'>
				<button
					className='bg-blue-700 p-1.5 rounded-md text-white font-medium flex'
					onClick={onNewProductModal}
				>
					<IconPlus className='mr-1.5' /> Nuevo producto
				</button>
			</div>
			{isOpen && <NewProduct isOpen={isOpen} setIsOpen={setIsOpen} />}
			<table>
				<thead>
					<tr>
						<th className='border border-black text-sm font-medium'>Nombre</th>
						<th className='border border-black text-sm font-medium'>
							Categoría
						</th>
						<th className='border border-black text-sm font-medium'>Tipo</th>
						<th className='border border-black text-sm font-medium'>
							Vencimiento
						</th>
						<th className='border border-black text-sm font-medium'>Precio</th>
						<th className='border border-black text-sm font-medium'>
							Cantidad
						</th>
						<th className='border border-black text-sm font-medium'>
							Observaciones
						</th>
						<th className='border border-black text-sm font-medium'>
							Acciones
						</th>
					</tr>
				</thead>
				<tbody>
					{catalogOfProducts.map(product => (
						<tr key={product.productId}>
							<td className='border border-black text-sm font-medium p-1 w-44'>
								{product.productName}
							</td>
							<td className='border border-black text-sm p-1 w-36'>
								{product.productCategory.productCategoryName}
							</td>
							<td className='border border-black text-sm p-1 w-36'>
								{product.productType.productTypeName}
							</td>
							<td className='border border-black text-sm p-1'>
								{getFormattedDate(product.productExpirationDate)}
							</td>
							<td className='border border-black text-sm p-1'>
								{product.productPrice}
							</td>
							<td className='border border-black text-sm p-1'>
								{product.productAmount}
							</td>
							<td className='border border-black text-sm p-1 w-96'>
								{product.productObservations}
							</td>
							<td className='border border-black text-center p-1'>
								<button
									className='mr-1'
									onClick={() => onEditProductHandler(product)}
								>
									<IconEdit />
								</button>
								<button
									onClick={() => onDeleteProductHandler(product.productId)}
								>
									<IconTrash />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</section>
	)
}
export default Products
