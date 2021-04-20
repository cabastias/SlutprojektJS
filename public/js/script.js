
var req = new req('http://localhost:8090/api/auth',{
    form : 'body=' + body,
    method: 'post',
    mode: 'cors'
 });