exports.myScoreDeal = function (codeObj){                           // 入参是代码分析结果数据对象上下文
    const { 
        apiMap,                                                     // API分析结果
        typeMap,                                                    // Type分析结果
        noUseMap,                                                   // 引入但未调用分析结果
        parseErrorFiles,                                            // 解析失败文件分析结果
        browserApiMap                                               // browserapi分析结果
    } = codeObj;
    
    let score = 100;                                                // 初始分数
    let message =[];                                                // 代码建议

    // 黑名单api扣分处理
    Object.keys(apiMap).forEach((fitem)=>{
        if(apiMap[fitem].noDeep){
            if(apiMap[fitem].isBlack){
                score = score - 5;
                message.push(fitem + ' 属于黑名单api，请勿使用');
            }
        }else{
            Object.keys(apiMap[fitem]).forEach((sitem)=>{
                if(apiMap[fitem][sitem].children){
                    Object.keys(apiMap[fitem][sitem].children).forEach((titem)=>{
                        const temp =apiMap[fitem][sitem].children[titem];
                        if(temp.isBlack){
                            score = score - 5;
                            message.push(fitem + '.' + sitem + '.' + titem + ' 属于黑名单api，请勿使用');
                        }
                    })
                }else{
                    const temp = apiMap[fitem][sitem];
                    if(temp.isBlack){
                        score = score - 5;
                        message.push(fitem + '.' + sitem + ' 属于黑名单api，请勿使用');
                    }
                }
            })
        }
    })
    // 最低0分处理
    if(score <0)score =0;

    // return返回一个带有score属性，message属性的对象(必须)
    return {                                   
        score: score,                          // number
        message: message                       // string[]
    }
}