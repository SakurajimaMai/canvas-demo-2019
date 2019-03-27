var canvas = document.getElementById('canvas')//拿到canvas
var context = canvas.getContext('2d')//获取上下文，想用canvas画画这两步反正必备
var lineWidth = 2.5
var eraserEnable = false

pen.onclick = function () {
  eraserEnable = false
  pen.classList.add('active')//被点击的时候就给pen加一个active的状态
  eraser.classList.remove('active')//给erasr去除active状态，这个状态呢在css里面
}
eraser.onclick = function () {
  eraserEnable = true
  eraser.classList.add('active')
  pen.classList.remove('active')
}
clear.onclick = function () {
  context.clearRect(0,0,canvas.width,canvas.height)
}
download.onclick = function () {
  var url = canvas.toDataURL("image/png")
  var a = document.createElement('a')
  document.body.appendChild(a)
  a.href = url
  a.download = '我的画'
  a.click()
}



red.onclick = function () {
  context.fillStyle = 'red'
  context.strokeStyle = 'red'
  red.classList.add('active')
  green.classList.remove('active')
  blue.classList.remove('active')
  black.classList.remove('active')
  eraserEnable = false
}
green.onclick = function () {
  context.fillStyle = 'green'
  context.strokeStyle = 'green'
  red.classList.remove('active')
  green.classList.add('active')
  blue.classList.remove('active')
  black.classList.remove('active')
  eraserEnable = false
}
blue.onclick = function () {
  context.fillStyle = 'blue'
  context.strokeStyle = 'blue'
  red.classList.remove('active')
  green.classList.remove('active')
  blue.classList.add('active')
  black.classList.remove('active')
  eraserEnable = false
}
black.onclick = function () {
  context.fillStyle = 'black'
  context.strokeStyle = 'black'
  red.classList.remove('active')
  green.classList.remove('active')
  blue.classList.remove('active')
  black.classList.add('active')
  eraserEnable = false
}

thin.onclick = function () {
  lineWidth = 2.5
}
thick.onclick = function () {
  lineWidth = 5
}


autoSetCanvas(canvas)//设置canvas的大小，并且自动适应窗口的变化

listenToUser(canvas)//监听鼠标按下移动，从而使用画笔或者橡皮擦




/**********************函数************************/

//设置canvas的大小，并且自动适应窗口的变化
//本来是全屏的，但是如果用户动了窗口就会出bug，所以要监听用户对窗口的操作。
//而且默认需要调大小，懂了窗口需要调大小，所以要调两边。那4句代码要写两遍。
function autoSetCanvas(canvas) {
  setCanvasSize()
  window.onresize = function () {
    setCanvasSize()
  }
  //canvas想要和页面一样的宽高，必须有下面4句代码。还有其他办法但是这几句老师说比较好背
  function setCanvasSize() {
    var pageWidth = document.documentElement.clientWidth
    var pageHeight = document.documentElement.clientHeight
    canvas.width = pageWidth
    canvas.height = pageHeight
  }
}

//监听鼠标按下移动，从而使用画笔或者橡皮擦
function listenToUser(canvas) {
  var using = false
  var lastPoint = { x: undefined, y: undefined }

  if (document.body.ontouchstart !== undefined) {//这句话叫做特性检测
    //触屏设备，必须用！== undefined,如果用==undefined那触屏和不触屏都是true
    //这个null和undefined有点奇怪。
    canvas.ontouchstart = function (b) {
      var x = b.touches[0].clientX
      var y = b.touches[0].clientY
      using = true
      if (eraserEnable) {
        context.clearRect(x - 5, y - 5, 10, 10)//只能用矩形吗，有没有圆啊
      } else {
        drawCircle(x, y, lineWidth)
        lastPoint = { "x": x, "y": y }
      }
    }

    canvas.ontouchmove = function (b) {
      var x = b.touches[0].clientX
      var y = b.touches[0].clientY
      if (using) {//if(using)里面嵌套了if else，其实可以if（！using）{return},和if else并列
        if (eraserEnable) {
          context.clearRect(x - 5, y - 5, 10, 10)//只能用矩形吗，有没有圆啊
        } else {
          var newPoint = { x: x, y: y }
          drawCircle(x, y, lineWidth)
          drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
          lastPoint = newPoint
        }
      }
    }
    canvas.ontouchend = function (b) {
      using = false
    }

  } else {
    //非触屏设备
    canvas.onmousedown = function (a) {
      var x = a.clientX
      var y = a.clientY
      using = true
      if (eraserEnable) {
        context.clearRect(x - 5, y - 5, 10, 10)//只能用矩形吗，有没有圆啊
      } else {
        drawCircle(x, y, lineWidth)
        lastPoint = { "x": x, "y": y }
      }
    }

    canvas.onmousemove = function (a) {
      var x = a.clientX
      var y = a.clientY
      if (using) {//if(using)里面嵌套了if else，其实可以if（！using）{return},和if else并列
        if (eraserEnable) {
          context.clearRect(x - 5, y - 5, 10, 10)//只能用矩形吗，有没有圆啊
        } else {
          var newPoint = { x: x, y: y }
          drawCircle(x, y, lineWidth)
          drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
          lastPoint = newPoint
        }
      }
    }
    canvas.onmouseup = function (a) {
      using = false
    }
  }


}

//封装一个画圆的函数，虽然这次没用到不过还是要学习一下
function drawCircle(x, y, radius) {
  context.beginPath()
  // context.fillStyle = 'black'
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill()
}

//封装一个连线的函数
function drawLine(x1, y1, x2, y2) {
  context.beginPath();
  // context.strokeStyle = 'black' 颜色在初始化的时候就写掉好了。但是如果不同地方不同
  //颜色那么可以初始化一个颜色，内部再一个颜色覆盖。然而这次的逻辑是在触发颜色的点击事件
  context.moveTo(x1, y1)//起点
  context.lineWidth = lineWidth * 2//这句话算设置属性可以放到颜色后面。
  context.lineTo(x2, y2)//终点
  context.stroke()//这句必须放在linTo后面，要不然划不了线。那这句话的意思应该是“画线”，前面代码定位置
  context.closePath()
}