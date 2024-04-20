## TODO

- SmbFile.Filename在queryInfo接口返回的是windowsPath，convert一下返回文件名即可
- 每次操作结束都会关闭连接，下次操作又重新连接+认证+操作，保持一个client连接，避免不断的连接+认证请求