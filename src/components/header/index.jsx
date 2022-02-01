import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Modal, Button } from 'antd';
import './index.less'
import { reqWeather } from '../../api'
import formatDate from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import menuList from '../../config/menuConfig'

import Bingbao from './icons/bingbao.png'
import Lei from './icons/lei.png'
import Qing from './icons/qing.png'
import Shachen from './icons/shachen.png'
import Wu from './icons/wu.png'
import Xue from './icons/xue.png'
import Yin from './icons/yin.png'
import Yu from './icons/yu.png'
import Yun from './icons/yun.png'

class Header extends Component {
    state = {
        wea: '',
        wea_img: '',
        currentTime: formatDate(Date.now())
    }

    getTime = () => {
        this.timer = setInterval(() => {
            const currentTime = formatDate(Date.now())
            this.setState({ currentTime })
        }, 1000)
    }

    getWeather = async () => {
        const { wea, wea_img } = await reqWeather('西安')
        this.setState({ wea, wea_img })
    }

    logout = () => {
        Modal.confirm({
            content: '确定要退出吗？',
            okText: '确定',
            cancelText: '取消',
            onOk: () => {
                memoryUtils.user = {}
                storageUtils.removeUser()

                this.props.history.replace('/login')
            },
        })
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    componentDidMount() {
        this.getTime()
        this.getWeather()
    }

    getTitle = () => {
        const { pathname } = this.props.location
        let title
        menuList.forEach(item => {
            if (item.key === pathname) {
                title = item.title
            } else if (item.children) {
                const cItem = item.children.find(cItem => {
                    return  pathname.indexOf(cItem.key) === 0
                })

                if (cItem) {
                    title = cItem.title
                }
            }
        })
        return title
    }

    render() {
        const { wea, wea_img, currentTime } = this.state
        const { username } = memoryUtils.user
        const title = this.getTitle()

        return (
            <div className='header'>
                <div className='header-top'>
                    <span>欢迎，{username}</span>
                    <Button type='link' onClick={this.logout}>退出</Button>
                </div>
                <div className='header-bottom'>
                    <div className="header-bottom-left">
                        {title}
                    </div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={
                            wea_img === 'bingbao' ? Bingbao :
                                wea_img === 'lei' ? Lei :
                                    wea_img === 'qing' ? Qing :
                                        wea_img === 'shachen' ? Shachen :
                                            wea_img === 'wu' ? Wu :
                                                wea_img === 'xue' ? Xue :
                                                    wea_img === 'yin' ? Yin :
                                                        wea_img === 'yu' ? Yu : Yun
                        } alt="weather" />
                        <span>{wea}</span>
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(Header)