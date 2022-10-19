# code-demo
用于测试&演示code-analysis-ts代码扫描分析工具的demo项目,使用github pages来部署报告

目录介绍：
1. analysis.config.js为配置文件
2. src目录下的文件未待分析文件，包括有ts, tsx, vue三种类型文件
3. docs目录下为分析后产生的代码分析报告及数据

执行分析操作:
1. npm install or yarn
2. npm run scan or yarn scan

执行说明：
配置文件中代码告警阀值分数默认为90分，低于90分不合格会触发进程异常结束，配合git hook 或者 CI管线可以阻止代码提交/合入
修改降低该配置分数，执行即可体验合格输出

代码分析报告地址：
https://liangxin199045.github.io/code-demo/
