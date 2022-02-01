const CracoLessPlugin = require("craco-less");

module.exports = {
    //按需引入
    babel: {
        plugins: [
            [
                "import",
                {
                    "libraryName": "antd",
                    "libraryDirectory": "es",
                    //可以设置为true即是less,注意！！！！此时不需要加引号
                    //也可以设置为css,css需要加引号
                    "style": true
                }
            ]
        ]
    },
    //自定义主题
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: { '@primary-color': '#1DA57A' },
javascriptEnabled: true,
                    },
                },
            },
        },
    ],
}