import React, { Component } from 'react'
import { Card, List, Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import { BASE_IMG_URL } from '../../utils/constants'
import { reqCategory } from '../../api'

const { Item } = List

export default class Detail extends Component {

    state = { 
        cName1: '', 
        cName2: ''
    }

    async componentDidMount() {
        const { pCategoryId, categoryId } = this.props.location.state

        if (pCategoryId === '0') {
            const result = await reqCategory(categoryId)
            const cName1 = result.data.name
            this.setState({cName1})
        } else {
            /* const result1 = await reqCategory(pCategoryId)
            const result2 = await reqCategory(categoryId)
            const cName1 = result1.data.name
            const cName2 = result2.data.name */

            const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
            const cName1 = results[0].data.name
            const cName2 = results[1].data.name
            this.setState({cName1, cName2})
        }
        
    }

    render() {

        const { name, desc, price, detail, imgs } = this.props.location.state
        const { cName1, cName2 } = this.state

        const title = (
            <span>
                <Button type='link' onClick={() => this.props.history.goBack()}>
                    <ArrowLeftOutlined style={{ marginRight: 10, fontSize: 20 }} />
                </Button>
                <span>商品详情</span>
            </span>
        )

        return (
            <Card title={title} className='product-detail'>
                <List>
                    <Item className='item'>
                        <span className='left'>商品名称：</span>
                        <span>{ name }</span>
                    </Item>
                    <Item className='item'>
                        <span className='left'>商品描述：</span>
                        <span>{ desc }</span>
                    </Item>
                    <Item className='item'>
                        <span className='left'>商品价格：</span>
                        <span>{ price }元</span>
                    </Item>
                    <Item className='item'>
                        <span className='left'>所属分类：</span>
                        <span>{cName1} {cName2 ? ' --> ' + cName2 : null }</span>
                    </Item>
                    <Item className='item'>
                        <span className='left'>所属分类：</span>
                        {
                            imgs.map(url => <img key={url} src={BASE_IMG_URL + url} alt="" />)
                        }
                    </Item>
                    <Item className='item'>
                        <span className='left'>商品详情：</span>
                        <span dangerouslySetInnerHTML={{ __html: detail }}></span>
                    </Item>
                </List>
            </Card>
        )
    }
}
