import React, { Component } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Layout } from 'antd';

import memoryUtils from '../../utils/memoryUtils'
import Header from '../../components/header'
import LeftNav from '../../components/left-nav'
import Home from '../home/home'
import Category from '../category/category'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'

const { Footer, Sider, Content } = Layout;

export default class Admin extends Component {
    render() {
        const user = memoryUtils.user
        if (!user || !user._id) {
            return <Redirect to='/login' />
        }
        return (
            <Layout style={{minHeight: '100%'}}>
                <Sider><LeftNav /></Sider>
                <Layout>
                    <Header>Header</Header>
                    <Content style={{backgroundColor: 'white', margin: '20px'}}>
                        <Switch>
                            <Route path='/home' component={Home}/>
                            <Route path='/category' component={Category}/>
                            <Route path='/product' component={Product}/>
                            <Route path='/user' component={User}/>
                            <Route path='/role' component={Role}/>
                            <Route path='/charts/bar' component={Bar}/>
                            <Route path='/charts/line' component={Line}/>
                            <Route path='/charts/pie' component={Pie}/>
                            <Redirect to='/home' />
                        </Switch>
                    </Content>
                    <Footer style={{textAlign: 'center', color: '#ccc'}}>Footer</Footer>
                </Layout>
            </Layout>
        )
    }
}
