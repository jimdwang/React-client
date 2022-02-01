import React, { Component } from 'react'
import {
    Form,
    Card,
    Input,
    Button,
    Cascader,
    message
} from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import { reqCategories, reqAddOrUpdateProduct } from '../../api'
import PicturesWall from './upload'
import RichTextEditor from './rich-text-editor'

const { Item } = Form
const { TextArea } = Input

export default class AddUpdate extends Component {
    myRef = React.createRef()
    pw = React.createRef()
    editor = React.createRef()

    state = {
        options: []
    }

    initOptions = async (categories) => {
        //初始化一级联动菜单
        const options = categories.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false,
        }))

        //如果有二级联动菜单
        const { isUpdate, product } = this
        const { pCategoryId, categoryId } = product
        if (isUpdate && pCategoryId !== '0') {
            const subCategories = await this.getCategories(pCategoryId)
            const cOptions = subCategories.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))

            const targetOption = options.find(option => option.value === pCategoryId)
            targetOption.children = cOptions
        }

        this.setState({ options })
    }

    getCategories = async parentId => {
        const result = await reqCategories(parentId)
        if (result.status === 0) {
            const categories = result.data
            if (parentId === '0') {
                this.initOptions(categories)
            } else {
                return categories
            }
        }
    }

    loadData = async selectedOptions => {
        const targetOption = selectedOptions[0]
        targetOption.loading = true

        const subCategories = await this.getCategories(targetOption.value)
        targetOption.loading = false

        if (subCategories && subCategories.length > 0) {
            const cOptions = subCategories.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            targetOption.children = cOptions
        } else {
            targetOption.isLeaf = true
        }
        this.setState({ options: [...this.state.options] })
    }

    submit = () => {
        this.myRef.current.validateFields()
            .then(async values => {
                const { price } = values
                if (price * 1 > 0) {
                    const { name, desc, categoryIds } = values
                    let pCategoryId, categoryId
                    if (categoryIds.length === 1) {
                        pCategoryId = '0'
                        categoryId = categoryIds[0]
                    } else {
                        pCategoryId = categoryIds[0]
                        categoryId = categoryIds[1]
                    }
                    const imgs = this.pw.current.getImgs()
                    const detail = this.editor.current.getDetail()

                    const product = { name, desc, price, pCategoryId, categoryId, imgs, detail }
                    if (this.isUpdate) {
                        product._id = this.product._id
                    }

                    const result = await reqAddOrUpdateProduct(product)
                    if (result.status === 0) {
                        message.success(`${this.isUpdate ? '更新' : '添加'}商品成功`)
                        this.props.history.goBack()
                    } else {
                        message.error(`${this.isUpdate ? '更新' : '添加'}商品失败`)
                    }
                    
                } else {
                    alert('价格输入必须大于0')
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    componentDidMount() {
        this.getCategories('0')
    }

    UNSAFE_componentWillMount() {
        const product = this.props.location.state
        this.isUpdate = !!product
        this.product = product || {}
    }

    render() {

        const { isUpdate, product } = this
        const { pCategoryId, categoryId, imgs, detail } = product
        const categoryIds = []
        if (isUpdate) {
            if (pCategoryId === '0') {
                categoryIds.push(categoryId)
            } else {
                categoryIds.push(categoryId)
                categoryIds.push(pCategoryId)
            }
        }

        const formItemLayout = {
            labelCol: {
                span: 2,
            },
            wrapperCol: {
                span: 8,
            }
        }





        const title = (
            <span>
                <Button type='link' onClick={() => this.props.history.goBack()}>
                    <ArrowLeftOutlined />
                </Button>
                <span>
                    {
                        isUpdate ? '修改商品' : '添加商品'
                    }

                </span>
            </span>
        )

        return (
            <Card title={title}>
                <Form {...formItemLayout} ref={this.myRef}>
                    <Item
                        label='商品名称'
                        name='name'
                        initialValue={product.name}
                        rules={[
                            { required: true, message: '商品名称必须输入！' }
                        ]}
                    >
                        <Input placeholder='请输入商品名称'></Input>
                    </Item>
                    <Item
                        label='商品描述'
                        name='desc'
                        initialValue={product.desc}
                        rules={[
                            { required: true, message: '商品描述必须输入！' }
                        ]}
                    >
                        <TextArea placeholder='请输入商品描述' autoSize={{ minRows: 2, maxRows: 6 }} />
                    </Item>
                    <Item
                        label='商品价格'
                        name='price'
                        initialValue={product.price}
                        rules={[
                            {
                                required: true,
                                message: '商品价格必须输入！'
                            }
                        ]}
                    >
                        <Input type='number' placeholder='请输入商品价格' addonAfter='元'></Input>
                    </Item>
                    <Item
                        label='商品分类'
                        name='categoryIds'
                        initialValue={categoryIds}
                        rules={[
                            { required: true, message: '商品分类必须指定！' }
                        ]}
                    >
                        <Cascader options={this.state.options} loadData={this.loadData} />
                    </Item>
                    <Item label='商品图片'>
                        <PicturesWall ref={this.pw} imgs={imgs} />
                    </Item>
                    <Item label='商品详情' labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
                        <RichTextEditor detail={detail} ref={this.editor} />
                    </Item>
                    <Item>
                        <Button type='primary' onClick={this.submit}>提交</Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}
