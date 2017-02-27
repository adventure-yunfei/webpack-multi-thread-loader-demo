# Webpack 多进程并发编译 - DEMO

这是一个用于展示 Webpack 多进程并发可行性的 Demo。

[相关介绍以及完善的HappyPack的实现参考我的另一个文档](http://blog.yunfei.me/blog/happypack_webpack_booster.html)

# 实现介绍

### 测试 Loader 实现介绍

- 代码参考 `simple-loader.js`
- 异步返回结果，在返回结果前每隔一秒定时输入日志，反应 Loader 编译过程
- 输入日志有两种方式
    - 同步方式: 死循环遍历，将阻塞当前线程
    - 异步方式：timeout 异步输入，不会阻塞当前线程

### 被编译的文件

- 代码参考 `files/`
- `a.js` 作为入口文件，同时引入两个依赖 `a-b.js`, `a-c.js`

# 查看结果

### 单线程/异步日志

- `MULTI_THREAD=false LOG_SYNC=false npm run webpack`

输出结果：父文件 `a.js` 先行编译，不与其他文件并行；编译结束后两个子依赖文件 `a-b.js` 和 `a-c.js` 并行编译。

```
> webpack                     
                              
# ASYNC: Compiling:           
    //a.js                    
    require('./a-b');         
    require('./a-c');         
# ASYNC: Compiling:           
    //a.js                    
    require('./a-b');         
    require('./a-c');         
# ASYNC: Compiling:           
    //a.js                    
    require('./a-b');         
    require('./a-c');         
# ASYNC: Compiling:  //a-b.js 
# ASYNC: Compiling:  //a-c.js 
# ASYNC: Compiling:  //a-b.js 
# ASYNC: Compiling:  //a-c.js 
# ASYNC: Compiling:  //a-b.js 
# ASYNC: Compiling:  //a-c.js 
Hash: 1a894ed6ba5b8fa9eb5b
Version: webpack 2.2.1
Time: 4161ms
...
```

### 单线程/同步日志

- `MULTI_THREAD=false LOG_SYNC=true npm run webpack`

输出结果：由于同步导致阻塞，`a-b.js` 和 `a-c.js`的编译是串行的，一个编译结束之后才编译另一个

```
> webpack                    
                             
# SYNC: Compiling:           
    //a.js                   
    require('./a-b');        
    require('./a-c');        
# SYNC: Compiling:           
    //a.js                   
    require('./a-b');        
    require('./a-c');        
# SYNC: Compiling:           
    //a.js                   
    require('./a-b');        
    require('./a-c');        
# SYNC: Compiling:  //a-b.js 
# SYNC: Compiling:  //a-b.js 
# SYNC: Compiling:  //a-b.js 
# SYNC: Compiling:  //a-c.js 
# SYNC: Compiling:  //a-c.js 
# SYNC: Compiling:  //a-c.js 
Hash: 1a894ed6ba5b8fa9eb5b
Version: webpack 2.2.1
Time: 6067ms
...
```

### 多进程/同步日志

- `MULTI_THREAD=true LOG_SYNC=true npm run webpack`

输出结果：结果与 单线程/异步日志 相同，不过原因不同，`a-b.js` 和 `a-c.js`通过多进程实现并行编译。这里就是多进程编译效率提升的地方：对比于和 单线程/同步日志 同样的 Loader 实现，这里通过多进程缩短了总编译时间。 

```
> webpack                   
                            
# SYNC: Compiling:          
    //a.js                  
    require('./a-b');       
    require('./a-c');       
# SYNC: Compiling:          
    //a.js                  
    require('./a-b');       
    require('./a-c');       
# SYNC: Compiling:          
    //a.js                  
    require('./a-b');       
    require('./a-c');       
# SYNC: Compiling:  //a-c.js
# SYNC: Compiling:  //a-b.js
# SYNC: Compiling:  //a-c.js
# SYNC: Compiling:  //a-b.js
# SYNC: Compiling:  //a-c.js
# SYNC: Compiling:  //a-b.js
Hash: 1a894ed6ba5b8fa9eb5b
Version: webpack 2.2.1
Time: 5366ms
...
```

### 多进程/异步日志

没有参考意义，且同上一个一致，这里只贴个编译时间：

```
Version: webpack 2.2.1
Time: 5441ms
```

# 结论

可以看出，虽然多进程并发可以利用多核提高编译效率，但是进程上下文创建以及进程间通信还是有额外的消耗。理论上`a-b.js` 和 `a-c.js`两个文件单线程下总编译时间需要6秒；多进程并发下并行编译，编译时间只需要3秒。可以缩短6秒总编译时间，实际上只缩短了不到1秒。通过进程池可以优化进程创建，然而进程间通信的消耗在实际情况中只会更大。

总的来说，多进程并发编译的思路还是很有效的。
