import { message } from 'antd'
import jsonp from 'jsonp'
import ajax from './ajax'

//登录
export const reqLogin = (username, password) => ajax('/login', { username, password }, 'POST')


//获取分类列表
export const reqCategories = (parentId) => ajax('/manage/category/list', { parentId })

//添加分类
export const reqAddCategory = (categoryName, parentId) => ajax('/manage/category/add', { categoryName, parentId }, 'POST')

//修改分类
export const reqUpdateCategory = (categoryName, categoryId) => ajax('/manage/category/update', { categoryName, categoryId }, 'POST')

//获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax('/manage/product/list', { pageNum, pageSize })

//删除上传的图片
export const reqDeleteImg = name => ajax('/manage/img/delete', { name }, 'POST')

//添加、更新商品信息
export const reqAddOrUpdateProduct = product => ajax(`/manage/product/${product._id ? 'update' : 'add'}`, product, 'POST')

//获取角色列表
export const reqRoles = () => ajax('/manage/role/list')

//获取角色列表
export const reqAddRole = roleName => ajax('/manage/role/add', { roleName }, 'POST')

//更新角色
export const reqUpdateRole = role => ajax('/manage/role/update', role, 'POST')

//删除用户
export const reqDeleteUser = userId => ajax('/manage/user/delete', { userId }, 'POST')

//添加用户
export const reqAddOrUpdateUser = user => ajax('/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')

//搜索商品分页列表 productType=productName/productDesc
export const reqSearchProducts = ({ pageNum, pageSize, searchType, searchName }) => ajax('/manage/product/search', {
    pageNum,
    pageSize,
    [searchType]: searchName

})

//根据ID获取商品名称
export const reqCategory = categoryId => ajax('/manage/category/info', { categoryId })

//更新商品 上架、下架
export const reqUpdateStatus = (productId, status) => ajax('/manage/product/updateStatus', { productId, status }, 'POST')

//获取所有用户列表
export const reqUsers = () => ajax('/manage/user/list')

//获取天气
export const reqWeather = (city) => {
    return new Promise((resolve, reject) => {
        const url = `https://www.yiketianqi.com/free/day?appid=29111377&appsecret=Fqbl7wwE&unescape=1&vue=1&city=${city}`
        jsonp(url, {}, (err, data) => {
            if (!err) {
                const { wea, wea_img } = data
                resolve({ wea, wea_img })
            } else {
                message.error('天气请求失败')
            }
        })
    })
}