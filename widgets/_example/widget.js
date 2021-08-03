'use script' //开发环境建议开启严格模式
;(function (window, mars3d) {
  //创建widget类，需要继承BaseWidget
  class MyWidget extends mars3d.widget.BaseWidget {
    //弹窗配置
    get view() {
      return {
        type: 'window',
        url: 'view.html',
        windowOptions: {
          width: 320,
          height: 240,
        },
      }
    }
    //初始化[仅执行1次]
    create() {}
    //每个窗口创建完成后调用
    winCreateOK(opt, result) {
      this.viewWindow = result

      this.viewWindow.$('#drawpoint').click(() =>{
        this.map.setCursor(true)
        this.map.on(mars3d.EventType.click, this.bindMourseClick, this)
      })
      this.viewWindow.$('#removeAll').click(() => {
        this.pos()
      })
    }
    //打开激活
    activate() {
      //map.setCursor(true)
      //this.map.on(mars3d.EventType.click, this.bindMourseClick, this)
    }
    //关闭释放
    disable() {
      this.map.setCursor(false)
      this.map.off(mars3d.EventType.click, this.bindMourseClick, this)

      if (this.graphic) {
        this.map.graphicLayer.removeGraphic(this.graphic, true)
        this.graphic = null
      }
      this.viewWindow = null
    }

    bindMourseClick(event) {  //单击地图事件
      var cartesian = event.cartesian
        if (cartesian) {
          var point = mars3d.LatLngPoint.fromCartesian(cartesian)
    
          var jd = point.lng
          var wd = point.lat
          var height = point.alt

          this.updateMarker(point)
    
          this.viewWindow.$('#point_jd').val(jd)  //更新十进制的经纬度
          this.viewWindow.$('#point_wd').val(wd)
          this.viewWindow.$('#point_height').val(height)
    
          this.Ten2DMS(jd, '#du_jd', '#fen_jd', '#miao_jd')  //更新度分秒的经纬度
          this.Ten2DMS(wd, '#du_wd', '#fen_wd', '#miao_wd')
          this.viewWindow.$('#point_height2').val(height)
    
          this.CGCSchangeTo3(jd, wd, '#san_jd', '#san_wd')      //更新2000平面坐标
          this.viewWindow.$('#point_height3').val(height)
          this.CGCSchangeTo6(jd, wd, '#liu_jd', '#liu_wd')
          this.viewWindow.$('#point_height4').val(height)
        }
    }

    updateMarker(val){
      if(this.graphic){
        this.graphic.position = val
      }
      else{
        this.graphic = new mars3d.graphic.PointEntity({
          position: val,
          style: {
            color: '#3388ff',
            pixelSize: 10,
            outlineColor: '#ffffff',
            outlineWidth: 2,
          },
        })
        this.map.graphicLayer.addGraphic(this.graphic)
      }
    }
    
    pos(){  //定位功能
      let j = this.viewWindow.$('#point_jd').val()
      let w = this.viewWindow.$('#point_wd').val()
      if(j.length>0 && w.length>0){
        let jd = Number(j)
        let wd = Number(w)
        let height  = Number(this.viewWindow.$('#point_height').val())
        if(jd>180 || jd<-180 || wd>90 || wd<-90){ //判断经纬度是否在范围内
          alert("请确保输入值正确！")
        }
        else{
          let j1 = Number(this.viewWindow.$('#du_jd').val())
          let j2 = Number(this.viewWindow.$('#fen_jd').val())
          let j3 = Number(this.viewWindow.$('#miao_jd').val())
          let w1 = Number(this.viewWindow.$('#du_wd').val())
          let w2 = Number(this.viewWindow.$('#fen_wd').val())
          let w3 = Number(this.viewWindow.$('#miao_wd').val())
          if(((j1>=0 && j2>=0 && j3>=0) || (j1<=0 && j2<=0 && j3<=0)) && ((w1>=0 && w2>=0 && w3>=0) || (w1<=0 && w2<=0 && w3<=0))){  
            map.setCameraView({ lat: wd, lng: jd, alt: 10000, pitch: -90 })//视角移动
            let val = Cesium.Cartesian3.fromDegrees(jd, wd, height)
            this.updateMarker(val, true)//更新点
          }
          else{
            alert("请确保度分秒符号一致！")
          }
        }
      }
      else if(j.length>0 || w.length==0){
        alert("请输入纬度坐标！")
      }
      else if(w.length>0 || j.length==0){
        alert("请输入经度坐标！")
      }
    }
    
    CGCSchangeTo3(jd, wd, a, b){
      var A = mars3d.PointTrans.proj4Trans([jd, wd], mars3d.CRS.EPSG4326, mars3d.CRS.CGCS2000_GK_Zone_3);
      this.viewWindow.$(a).val(Math.round(A[0] * 100) / 100)
      this.viewWindow.$(b).val(Math.round(A[1] * 100) / 100)
    }
    
    CGCSchangeTo6(jd, wd, a, b){
      var A = mars3d.PointTrans.proj4Trans([jd, wd], mars3d.CRS.EPSG4326, mars3d.CRS.CGCS2000_GK_Zone_6);
      this.viewWindow.$(a).val(Math.round(A[0] * 100) / 100)
      this.viewWindow.$(b).val(Math.round(A[1] * 100) / 100)
    }
    
    Ten2DMS(degree, a, b, c){ //十进制转度分秒
      this.viewWindow.$(a).val(parseInt(degree))
      this.viewWindow.$(b).val(parseInt((degree % 1)*60))
      this.viewWindow.$(c).val(Math.round((((degree % 1)*60) % 1)*60 * 100) / 100)
    }

    ThreeToEPSG(j, w){
      var x = mars3d.PointTrans.proj4Trans([j, w], mars3d.CRS.CGCS2000_GK_Zone_3, mars3d.CRS.EPSG4326);
      return x
    }

    SixToEPSG(j, w){
      var x = mars3d.PointTrans.proj4Trans([j, w], mars3d.CRS.CGCS2000_GK_Zone_6, mars3d.CRS.EPSG4326);
      return x
    }
  }


  //注册到widget管理器中。
  mars3d.widget.bindClass(MyWidget)

  //每个widet之间都是直接引入到index.html中，会存在彼此命名冲突，所以闭包处理下。
})(window, mars3d)
