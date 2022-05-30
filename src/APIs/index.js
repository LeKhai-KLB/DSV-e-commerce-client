// auth APIs
export const loginAPI = '/api/user/login'
export const registerAPI = '/api/user/register'

// general APIs
export const getCategoriesByTreeLengthAPI = '/api/general/getCategoriesByTreeLength'
export const getCategoriesPassByParentAPI = '/api/general/getCategoriesPassByParent'
export const getCategoryPathByIdListAPI = '/api/general/getCategoryPathByIdList'
export const getAllBrandsAPI = '/api/general/getAllBrands'
export const getAllBrandPassByCategoryAPI = '/api/general/getAllBrandPassByCategory'
export const getAllColorsAPI = '/api/general/getAllColors'

// products APIs
export const getProductsByFilterAndSortValue = '/api/product/getProductsByFilterAndSortValue'
export const getProductsByBrandIdAPI = '/api/product/getProductsByBrandId'
export const getProductsByNestedRootCategoryAPI = '/api/product/getProductsByNestedRootCategory'
export const getProductByIdAPI = '/api/product/getProductById'
export const deleteProductAPI = '/api/product/admin/delete'
export const addProductAPI = '/api/product/admin/add'
export const updateProductAPI = '/api/product/admin/update'

// order APIs
export const addOrderAPI = '/api/order/add'
export const getOrdersByFilterAPI = '/api/order/admin/getOrdersByFilter'
export const setStatusAPI = '/api/order/admin/setStatus'