const { mysql } = require('../../mysql.js')


module.exports = async (ctx) => {
    // 轮播图数据
    // nideshop_ad 轮播图数据库表名
    const banner = await mysql('nideshop_ad').where({
        ad_position_id: 1
    }).select()

    // table类型
    const channel = await mysql('nideshop_channel').select()

    // 品牌商品列表
    // 筛选is_new为1的，并按照new_sort_order升序排列，取4条数据
    const brandList = await mysql('nideshop_brand').where({
        is_new: 1
    }).orderBy('new_sort_order', 'asc').limit(4).select()


    // 新品首发
    const newGoods = await mysql('nideshop_goods').whereIn("id", [1181000, 1135002, 1134030, 1134032]).andWhere('is_new', 1).select()

    // 人气推荐
    const hotGoods = await mysql('nideshop_goods').column('id', 'name', 'list_pic_url', 'retail_price', 'goods_brief').where({
        is_hot: 1
    }).limit(5).select()

    // 专题精选
    const topicList = await mysql('nideshop_topic').limit(3).select()

    // 居家好物
    const categoryList = await mysql('nideshop_category').where({
        parent_id: 0
    }).select()
    const newCategoryList = []
    for (let index = 0; index < categoryList.length; index++) {
        const item = categoryList[index];
        let childCategoryIds = await mysql('nideshop_category').where({
            parent_id: item.id
        }).column('id').select()
        childCategoryIds = childCategoryIds.map(item => {
            return item.id
        })
        const categoryGoods = await mysql('nideshop_goods').column('id', 'name', 'list_pic_url', 'retail_price').whereIn('category_id', childCategoryIds).limit(7).select()
        newCategoryList.push({
            "id": item.id,
            "name": item.name,
            "goodsList": categoryGoods
        })
    }


    ctx.body = {
        "banner": banner,
        "channel": channel,
        "brandList": brandList,
        "newGoods": newGoods,
        "hotGoods": hotGoods,
        "topicList": topicList,
        "newCategoryList": newCategoryList,
    }
}