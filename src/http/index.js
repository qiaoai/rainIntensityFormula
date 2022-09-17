export const requestMethod = (url,method='GET',data=null, contentType=null) => {
    return new Promise(function(resolve,reject){
      const xhr = new XMLHttpRequest();
      xhr.withCredentials = true;
      xhr.addEventListener("readystatechange", function() {
        if(this.readyState === 4) {
          resolve(this.responseText)
        }
      });
      xhr.open(method, url);
      if (contentType) {
        xhr.setRequestHeader("Content-type", contentType); 
      }
      xhr.send(data);
    })
  };
  