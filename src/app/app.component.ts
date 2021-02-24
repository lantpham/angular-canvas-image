import { Component, OnInit  } from '@angular/core';
import { Observable,Observer } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'my-BB-Test';
  lastPointX = 0;
  lastPointY = 0;
  recw = 50;
  rech = 50;
  textToShow = '';
  imageUrl = '';
  base64Image : any ;

  ngOnInit(){
    this.loadPic();
  }
  loadPic(){
    var imageData = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTAgMjUwIj4KICAgIDxwYXRoIGZpbGw9IiNERDAwMzEiIGQ9Ik0xMjUgMzBMMzEuOSA2My4ybDE0LjIgMTIzLjFMMTI1IDIzMGw3OC45LTQzLjcgMTQuMi0xMjMuMXoiIC8+CiAgICA8cGF0aCBmaWxsPSIjQzMwMDJGIiBkPSJNMTI1IDMwdjIyLjItLjFWMjMwbDc4LjktNDMuNyAxNC4yLTEyMy4xTDEyNSAzMHoiIC8+CiAgICA8cGF0aCAgZmlsbD0iI0ZGRkZGRiIgZD0iTTEyNSA1Mi4xTDY2LjggMTgyLjZoMjEuN2wxMS43LTI5LjJoNDkuNGwxMS43IDI5LjJIMTgzTDEyNSA1Mi4xem0xNyA4My4zaC0zNGwxNy00MC45IDE3IDQwLjl6IiAvPgogIDwvc3ZnPg==";
    var myImage = new Image();
    myImage.src = imageData;
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    let ctx = canvas.getContext("2d");
    ctx?.drawImage(myImage, 0, 0);
    } 
mouseMove(e: any)
{
  let canvas = document.getElementById("canvas") as HTMLCanvasElement;
  let ctx = canvas.getContext("2d");
  var cRect = canvas.getBoundingClientRect();        // Gets CSS pos, and width/height

  var canvasX = Math.round(e.clientX - cRect.left);  // Subtract the 'left' of the canvas 
  var canvasY = Math.round(e.clientY - cRect.top);   // from the X/Y positions to make  
  // ctx?.clearRect(0, 0, canvas.width, canvas.height);  // (0,0) the top left of the canvas
 ctx?.fillText("X: "+canvasX+", Y: "+canvasY, 10, 20);
};

saveImage() {
    let canvas = document.getElementById("canvas")as HTMLCanvasElement;
    var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
    window.location.href=image; // it will save locally

  };

lastClicked(event: any) {
  let canvas = document.getElementById("canvas") as HTMLCanvasElement;
  let ctx = canvas.getContext("2d");
  var cRect = canvas.getBoundingClientRect();        // Gets CSS pos, and width/height
    this.lastPointX = event.clientX - cRect.left;
    this.lastPointY = event.clientY - cRect.top;
    console.log("clicked at x: ",this.lastPointX);
    console.log("clicked at y: ", this.lastPointY);
    var rectangle = new Path2D();
    rectangle.rect(this.lastPointX, this.lastPointY, this.recw, this.rech);
    ctx?.stroke(rectangle);
  };
  setNote(){
    let canvas = document.getElementById("canvas") as HTMLCanvasElement;
    var ctx = canvas.getContext("2d");
    console.log("X "+ this.lastPointX + " Y: " + this.lastPointY + "with Text:"+ this.textToShow);
    ctx?.strokeText(this.textToShow, this.lastPointX,this.lastPointY);
  };

  dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var arrayBuffer = new ArrayBuffer(byteString.length);
    var _ia = new Uint8Array(arrayBuffer);
    for (var i = 0; i < byteString.length; i++) {
        _ia[i] = byteString.charCodeAt(i);
    }

    var dataView = new DataView(arrayBuffer);
    var blob = new Blob([dataView], { type: mimeString });
    return blob;
}
  //load an image using XMLHttpRequest
  loadXHR(url) {

    return new Promise(function(resolve, reject) {
        try {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.responseType = "blob";
            xhr.onerror = function() {reject("Network error.")};
            xhr.onload = function() {
                if (xhr.status === 200) {resolve(xhr.response)}
                else {reject("Loading error:" + xhr.statusText)}
            };
            xhr.send();
        }
        catch(err) {reject(err.message)}
    });
}

  getBase64ImageFromURL(url: string) {
    return Observable.create((observer: Observer<string>) => {
      // create an image object
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      if (!img.complete) {
          // This will call another method that will create image from url
          img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = (err) => {
           observer.error(err);
        };
      } else {
          observer.next(this.getBase64Image(img));
          observer.complete();
      }
    });
 }
 getBase64Image(img: HTMLImageElement) {
  // We create a HTML canvas object that will create a 2d image
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  // This will draw image    
  ctx?.drawImage(img, 0, 0);
  // Convert the drawn image to Data URL
  var dataURL = canvas.toDataURL("image/png");
return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}


b64toFile(dataURI): File {
  // convert the data URL to a byte string
  const byteString = atob(dataURI.split(',')[1]);

  // pull out the mime type from the data URL
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // Convert to byte array
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  // Create a blob that looks like a file.
  const blob = new Blob([ab], { 'type': mimeString });
  blob['lastModifiedDate'] = (new Date()).toISOString();
  blob['name'] = 'file';
      
  // Figure out what extension the file should have
  switch(blob.type) {
      case 'image/jpeg':
          blob['name'] += '.jpg';
          break;
      case 'image/png':
          blob['name'] += '.png';
          break;
  }
  // cast to a File
  return <File>blob;
}

////
drawNonCross(){
  var srcImage = document.getElementById('srcImage') as HTMLImageElement;
    this.drawImageFromWebUrl(srcImage.src);
}
drawImageFromWebUrl( sourceurl: string){
  
  var img = new Image();
  img.addEventListener("load", function () {
     let canvas = document.getElementById("canvas") as HTMLCanvasElement;
      // The image can be drawn from any source
     let ctx =  canvas.getContext("2d");
     //img.setAttribute("crossOrigin", 'anonymous');
     ctx?.drawImage(img, 0, 0, img.width,    img.height, 0, 0,  canvas.width,  canvas.height);
      
      // However the execution of any of the following methods will make your script fail
      // if your image doesn't has the right permissions
      //DOMException: Failed to execute 'getImageData' on 'CanvasRenderingContext2D': The canvas has been tainted by cross-origin data.
      //let imgD = ctx?.getImageData(0,0, canvas.width,  canvas.height);
      var url =  canvas.toDataURL();
      console.log(url);
      //canvas.toBlob();
  });
  //img.setAttribute("crossOrigin", 'Anonymous');
  img.setAttribute("src", sourceurl);
}
}
