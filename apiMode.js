const analysis = require('code-analysis-ts');

async function scan() {
    try{
        const codeReport = await analysis({
            scanPath: ['src'],                                                // 必须，需要分析的文件目录名数组
            target: 'framework',                                              // 必须，需要分析的依赖名
            blackApis: ['app.localStorage.set'],                              // 可选, api黑名单，默认为空数组
            browserApis: ['window','document','history','location'],          // 可选，要分析的BrowserApi，默认为空数组
            reportDir: 'report',                                              // 可选，生成代码分析报告的目录，默认为report
            isScanVue: true,                                                  // 可选，是否要扫描分析vue中的ts代码，默认为false
            scoreFun: 'default'                                              // 可选，代码评分插件 : Function|'default'|null, default运行默认评分插件，null表示不评分
        });                                                                          
        console.log(codeReport);
    }catch(e){
        console.log(e);
    }
};

scan();
