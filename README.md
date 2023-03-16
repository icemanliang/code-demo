# code-demo
用于测试&演示code-analysis-ts代码扫描分析工具的demo项目,使用github pages来部署报告

目录介绍：
1. analysis.config.js为配置文件
2. src目录下的文件未待分析文件，包括有ts, tsx, vue三种类型文件
3. docs目录下为分析后产生的代码分析报告及数据

本地执行:
```javascript
$ npm install 
// or 
$ yarn install

$ npm run analysis 
//or 
$ yarn analysis
```

执行说明：
配置文件中代码告警阀值分数默认为90分，低于90分不合格会触发进程异常结束，配合git hook 或者 CI管线可以阻止代码提交/合入
修改降低该配置分数，执行即可体验合格输出。

评分插件:
scorePlugin.js为评分插件demo，analysis.config.js可以将scorePlugin配置项修改为该插件，即可体验自定义评分。

分析插件：
classPlugin.js为检测 Class API调用的自定义分析插件，apiMode.js可以引入它可以在分析结果中新增 Class API 用途调用的分析指标。

代码分析报告地址：
https://liangxin199045.github.io/code-demo/

常见问题:
1. vue_temp_ts_dir目录是什么
如果开启了扫描Vue中TS的配置开关，工具会提取Vue中的TS片段进行中转TS处理，该目录是temp临时目录，会在分析结束销毁。
