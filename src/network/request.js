/*
  把网络请求的代码封装起来，不再使用在各个组件中引用axios的方式
  因为当这种引用第三方库的方法，一旦第三方库停止维护的话，就要去组件中一个个修改代码
  我们可以把第三方库自己封装成一个文件，然后所有组件面向的都是我们自己封装的文件，这样当第三方库孰能使用后，直接修改我们自己封装的文件就行了
*/
// import axios from 'axios'

//   export function request(config) {
//       //1.创建axios的实例
//       const instance = axios.create({
//             baseURL: 'https://www.liulongbin.top:8888/api/private/v1/',
//              timeout: 5000
//            })
//       //2.axios的拦截
//       //2.1请求拦截(请求成功拦截，请求失败拦截)  interceptors(拦截器)
//       instance.interceptors.request.use(config => { 
//         console.log(config) 
//         return config  //拦截请求，并做出一些处理后，要把拦截的请求返回
//       }, err =>{ 
//         //console.log(err)
//       })

//       //2.2响应拦截
//       instance.interceptors.response.use(res => {
//         return res.data
//       }, err => {
//         //console.log(err)
//       })

//      //3.发送真正的网络请求
//      return instance(config)  //返回instance实例的返回值，instance实例的返回值是一个promise对象
//   }