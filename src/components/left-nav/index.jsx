import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu } from 'antd';



import './index.less'
import Logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
import memoryUtils from '../../utils/memoryUtils'


const { SubMenu } = Menu;

class LeftNav extends Component {

    hasAuth = item => {
        const { username } = memoryUtils.user
        const { key, isPublic } = item
        const { menus } = memoryUtils.user.role
        if (username === 'admin' || menus.indexOf(key) !== -1 || isPublic) {
            return true
        } else if (item.children) {
            return !!item.children.find(child => menus.indexOf(child.key) !== -1)
        }

        return false
    }

    /* getMenuNodes_map = menuList => {
        return menuList.map(item => {
            if (!item.children) {
                return (
                    <Menu.Item key={item.key} icon={item.icon}>
                        <Link to={item.key}>{item.title}</Link>
                    </Menu.Item>
                )
            } else {
                return (
                    <SubMenu key={item.key} icon={item.icon} title={item.title}>
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                )
            }

        })
    } */

    getMenuNodes = menuList => {
        return menuList.reduce((pre, item) => {
            if (this.hasAuth(item)) {
                if (!item.children) {
                    pre.push((
                        <Menu.Item key={item.key} icon={item.icon}>
                            <Link to={item.key}>{item.title}</Link>
                        </Menu.Item>
                    ))
                } else {
                    const cItem = item.children.find(cItem => this.props.location.pathname.indexOf(cItem.key) === 0)
                    if (cItem) {
                        this.openKey = item.key
                    }
                    pre.push((
                        <SubMenu key={item.key} icon={item.icon} title={item.title}>
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    ))
                }
            }

            return pre
        }, [])
    }

    UNSAFE_componentWillMount() {
        this.menuNodes = this.getMenuNodes(menuList)
    }

    render() {
        let path = this.props.location.pathname
        const openKey = this.openKey
        if (path.indexOf('/product') === 0) {
            path = '/product'
        }

        return (
            <div className='left-nav'>
                <Link to='/' className='left-nav-header'>
                    <img src={Logo} alt="logo" />
                    <h1>硅谷后台</h1>
                </Link>
                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                >
                    {this.menuNodes}
                </Menu>
            </div>
        )
    }
}

export default withRouter(LeftNav)