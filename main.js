var yyy = document.getElementById('canvas')//拿到canvas
    var context = yyy.getContext('2d')//获取上下文，想用canvas画画这两步反正必备

    autoSetCanvas(yyy)//设置canvas的大小，并且自动适应窗口的变化

    listenToMouse(yyy)//监听鼠标按下移动，从而使用画笔或者橡皮擦

    /*********橡皮*********/
    var eraserEnable = false
    //点击id=eraser的button
    eraser.onclick = function () {
      eraserEnable = true
      actions.className = 'actions x'
    }
    //点击id=brush的button
    brush.onclick = function () {
      eraserEnable = false
      actions.className = 'actions'
    }


    /**********************函数************************/

    //设置canvas的大小，并且自动适应窗口的变化
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
    function listenToMouse(canvas) {
      var using = false
      var lastPoint = { x: undefined, y: undefined }

      canvas.onmousedown = function (a) {
        var x = a.clientX
        var y = a.clientY
        using = true
        if (eraserEnable) {
          context.clearRect(x - 5, y - 5, 10, 10)//只能用矩形吗，有没有圆啊
        } else {
          drawCircle(x, y, 5)
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
            drawCircle(x, y, 5)
            drawLine(lastPoint.x, lastPoint.y, newPoint.x, newPoint.y)
            lastPoint = newPoint
          }
        }
      }
      canvas.onmouseup = function (a) {
        using = false
      }
    }

    //封装一个画圆的函数，虽然这次没用到不过还是要学习一下
    function drawCircle(x, y, radius) {
      context.beginPath()
      context.fillStyle = 'black'
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill()
    }

    //封装一个连线的函数
    function drawLine(x1, y1, x2, y2) {
      context.beginPath();
      context.strokeStyle = 'black'
      context.moveTo(x1, y1)//起点
      context.lineWidth = 10
      context.lineTo(x2, y2)//终点
      context.stroke()
      context.closePath()
    }