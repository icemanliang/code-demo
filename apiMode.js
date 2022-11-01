const analysis = require('code-analysis-ts');

async function scan() {
    try{
        const codeReport = await analysis({
            scanPath: 'src',                                                            // 必须，需要分析的文件目录名
            target: 'framework',                                                        // 必须，需要分析的依赖名
            blackApis: ['app.localStorage.set'],                                        // 可选, api黑名单，默认为空数组
            browserApis: ['window','document','history','location'],                    // 可选，要分析的browserapi，默认为空数组
            reportDir: 'report',                                                        // 可选，生成代码分析报告的目录，默认为code_report
            isScanVue: true,                                                            // 可选，是否要扫描分析vue中的ts代码，默认为false
            scoreFun: null,                                                             // 可选，自定义代码评分函数，默认为null即采用工具默认评分函数
            thresholdScore: 90                                                          // 可选，开启代码告警及设置合格阈值分数，默认为null即关闭告警逻辑
        });                                                                          
        console.log(codeReport);
    }catch(e){
        console.log(e);
    }
};

scan();
