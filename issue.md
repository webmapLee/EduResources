## 问题1: git push 报错
报错信息如下：
无法访问 'https://github.com/webmapLee/EduResources.git/'：LibreSSL SSL_connect: SSL_ERROR_SYSCALL in connection to github.com:443
解决办法如下：
git config --global http.sslVerifyfalse

## 问题2: git push终端
报错信息如下：
error: RPC 失败。HTTP 400 curl 22 The requested URL returned error: 400
send-pack: unexpected disconnect while reading sideband packet
写入对象中: 100% (50/50), 2.65 MiB | 937.00 KiB/s, 完成.
总共 50（差异 15），复用 0（差异 0），包复用 0
fatal: 远端意外挂断了

解决办法：
git config --global http.postBuffer 524288000

分析：
提交的文件超过一定的大小，就会报错