;(function (window, mars3d) {
  //创建widget类，需要继承BaseWidget
  class MyWidget extends mars3d.widget.BaseWidget {
    //外部资源配置
    get resources() {
      return ['view.css']
    }

    //弹窗配置，弹窗div弹窗，而非iframe模式
    get view() {
      return {
        type: 'divwindow',
        url: 'view.html',
        windowOptions: {
        },
      }
    }

    //初始化[仅执行1次]
    create() {}
    //每个窗口创建完成后调用
    winCreateOK(opt, result) {
      //此处可以绑定页面dom事件
      $('#point_jd').on('input',() => {
        this.change_jd()
      })
      $('#point_wd').on('input',() => {
        this.change_wd()
      })
      $('#point_height').on('input',() => {
        this.changeH('#point_height', '#point_height2', '#point_height3', '#point_height4')
      })

      $('#du_jd').on('input',() => {
        this.changedu_jd()
      })
      $('#fen_jd').on('input',() => {
        this.changefen_jd()
      })
      $('#miao_jd').on('input',() => {
        this.changemiao_jd()
      })
      $('#du_wd').on('input',() => {
        this.changedu_wd()
      })
      $('#fen_wd').on('input',() => {
        this.changefen_wd()
      })
      $('#miao_wd').on('input',() => {
        this.changemiao_wd()
      })
      $('#point_height2').on('input',() => {
        this.changeH('#point_height2', '#point_height', '#point_height3', '#point_height4')
      })

      $('#san_jd').on('input',() => {
        this.change_3jd()
      })
      $('#san_wd').on('input',() => {
        this.change_3wd()
      })
      $('#point_height3').on('input',() => {
        this.changeH('#point_height3', '#point_height', '#point_height2', '#point_height4')
      })

      $('#liu_jd').on('input',() => {
        this.change_6jd()
      })
      $('#liu_wd').on('input',() => {
        this.change_6wd()
      })
      $('#point_height4').on('input',() => {
        this.changeh('#point_height4', '#point_height', '#point_height2', '#point_height3')
      })

      $('#removeAll').click(() => {
        this.pos()
      })
    }
    //激活插件
    activate() {
      map.setCursor(true)
      this.map.on(mars3d.EventType.click, this.bindMourseClick, this)
      toastr.info('激活插件_example_divwin')
    }
    //释放插件
    disable() {
      map.setCursor(false)
      this.map.off(mars3d.EventType.click, this.bindMourseClick, this)

      if (this.graphic) {
        this.map.graphicLayer.removeGraphic(this.graphic, true)
        this.graphic = null
      }
      toastr.info('释放插件_example_divwin')
    }

    bindMourseClick(event) {  //单击地图事件
      var cartesian = event.cartesian
        if (cartesian) {
          var point = mars3d.LatLngPoint.fromCartesian(cartesian)
    
          var jd = point.lng
          var wd = point.lat
          var height = point.alt

          this.updateMarker(point)
    
          $('#point_jd').val(jd)  //更新十进制的经纬度
          $('#point_wd').val(wd)
          $('#point_height').val(height)
    
          this.Ten2DMS(jd, '#du_jd', '#fen_jd', '#miao_jd')  //更新度分秒的经纬度
          this.Ten2DMS(wd, '#du_wd', '#fen_wd', '#miao_wd')
          $('#point_height2').val(height)
    
          this.CGCSchangeTo3(jd, wd, '#san_jd', '#san_wd')      //更新2000平面坐标
          $('#point_height3').val(height)
          this.CGCSchangeTo6(jd, wd, '#liu_jd', '#liu_wd')
          $('#point_height4').val(height)
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
      let j = $('#point_jd').val()
      let w = $('#point_wd').val()
      if(j.length>0 && w.length>0){
        let jd = Number($('#point_jd').val())
        let wd = Number($('#point_wd').val())
        let height=Number($('#point_height').val())
        if(jd>180 || jd<-180 || wd>90 || wd<-90){ //判断经纬度是否在范围内
          alert("请确保输入值正确！")
        }
        else{
          let j1 = Number($('#du_jd').val())
          let j2 = Number($('#fen_jd').val())
          let j3 = Number($('#miao_jd').val())
          let w1 = Number($('#du_wd').val())
          let w2 = Number($('#fen_wd').val())
          let w3 = Number($('#miao_wd').val())
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
    
    A(a, b){
      if(a==1)//经度改变
      {
        let wd = $('#point_wd').val()
        if (wd.length>0){
          let wd1 = Number($('#point_wd').val())
          this.CGCSchangeTo3(b, wd1 ,'#san_jd', '#san_wd')
          this.CGCSchangeTo6(b, wd1 ,'#liu_jd', '#liu_wd')
        }
        else{
          $('#san_jd').val(" ")
          $('#liu_jd').val(" ")
        }
      }
      else if(a==2){//纬度改变
        let jd = $('#point_jd').val()
        if (jd.length>0){
          let jd1 = Number($('#point_jd').val())
          this.CGCSchangeTo3(jd1, b ,'#san_jd', '#san_wd')
          this.CGCSchangeTo6(jd1, b ,'#liu_jd', '#liu_wd')
        }
        else{
          $('#san_wd').val(" ")
          $('#liu_wd').val(" ")
        }
      }
    }
    
    change_jd(){  //十进制经度改变时，更新
      let jd_1 = Number($('#point_jd').val())//获取经度
      if(jd_1>180 || jd_1<-180){
        alert("请输入正确的经度值！")
        $('#point_jd').val(" ")
      }
      else{
        this.Ten2DMS(jd_1, '#du_jd', '#fen_jd', '#miao_jd')  //更新度分秒的经纬度 
        this.A(1, jd_1)
      }
    }
    
    change_wd(){  //十进制纬度改变时，更新
      let wd_1 = Number($('#point_wd').val())//获取
      if(wd_1>90 || wd_1<-90){
        alert("请输入正确的纬度值！")
        $('#point_wd').val(" ")
      }
      else{  
        this.Ten2DMS(wd_1, '#du_wd', '#fen_wd', '#miao_wd')  //更新度分秒的经纬度
        this.A(2, wd_1)
      }
    }
    
    changedu_jd(){  //度分秒，经度 度改变
      let jd_du = Number($('#du_jd').val())//获取
      let jd_fen = $('#fen_jd').val()
      let jd_miao = $('#miao_jd').val()
      if (jd_fen.length>0 && jd_miao.length>0){
        let jd_fen1 = Number($('#fen_jd').val())
        let jd_miao1 = Number($('#miao_jd').val())
        let jd1 = Math.round((jd_du + jd_fen1/60 + jd_miao1/3600) * 1000000) / 1000000
        $('#point_jd').val(jd1)//十进制改变
        this.A(1, jd1)
      }
      else if(jd_fen.length>0 || jd_miao.length==0){
        let jd_fen2 = Number($('#fen_jd').val())
        let jd2 = Math.round((jd_du + jd_fen2/60) * 1000000) / 1000000
        $('#point_jd').val(jd2)
        this.A(1, jd2)
      }
      else if(jd_miao.length>0 || jd_fen.length==0){
        let jd_miao2 = Number($('#miao_jd').val())
        let jd3 = Math.round((jd_du + jd_miao2/3600) * 1000000) / 1000000
        $('#point_jd').val(jd3)
        this.A(1, jd3)
      }
      else if(jd_fen.length==0 && jd_miao.length==0){
        $('#point_jd').val(jd_du)
        this.A(1, jd_du)
      }
    }
    
    changefen_jd(){  //度分秒，经度 分改变
      let jd_fen = Number($('#fen_jd').val())//获取
      let jd_du = $('#du_jd').val()
      let jd_miao = $('#miao_jd').val()
      if (jd_du.length>0 && jd_miao.length>0){
        let jd_du1 = Number($('#du_jd').val())
        let jd_miao1 = Number($('#miao_jd').val())
        let jd1 = Math.round((jd_du1 + jd_fen/60 + jd_miao1/3600) * 1000000) / 1000000
        $('#point_jd').val(jd1)//十进制改变
        this.A(1, jd1)
      }
      else if(jd_du.length>0 || jd_miao.length==0){
        let jd_du2 = Number($('#du_jd').val())
        let jd2 = Math.round((jd_du2 + jd_fen/60) * 1000000) / 1000000
        $('#point_jd').val(jd2)
        this.A(1, jd2)
      }
      else if(jd_miao.length>0 || jd_du.length==0){
        let jd_miao2 = Number($('#miao_jd').val())
        let jd3 = Math.round((jd_fen/60 + jd_miao2/3600) * 1000000) / 1000000
        $('#point_jd').val(jd3)
        this.A(1, jd3)
      }
      else if(jd_du.length==0 && jd_miao.length==0){
        let jd4 = Math.round((jd_fen/60) * 1000000) / 1000000
        $('#point_jd').val(jd4)
        this.A(1, jd4)
      }
    }
    
    changemiao_jd(){  //度分秒，经度 秒改变
      let jd_miao = Number($('#miao_jd').val())//获取
      let jd_du = $('#du_jd').val()
      let jd_fen = $('#fen_jd').val()
      if (jd_du.length>0 && jd_fen.length>0){
        let jd_du1 = Number($('#du_jd').val())
        let jd_fen1 = Number($('#fen_jd').val())
        let jd1 = Math.round((jd_du1 + jd_fen1/60 + jd_miao/3600) * 1000000) / 1000000
        $('#point_jd').val(jd1)//十进制改变
        this.A(1, jd1)
      }
      else if(jd_du.length>0 || jd_fen.length==0){
        let jd_du2 = Number($('#du_jd').val())
        let jd2 = Math.round((jd_du2 + jd_miao/3600) * 1000000) / 1000000
        $('#point_jd').val(jd2)
        this.A(1, jd2)
      }
      else if(jd_fen.length>0 || jd_du.length==0){
        let jd_fen2 = Number($('#fen_jd').val())
        let jd3 = Math.round((jd_fen2/60 + jd_miao/3600) * 1000000) / 1000000
        $('#point_jd').val(jd3)
        this.A(1, jd3)
      }
      else if(jd_du.length==0 && jd_miao.length==0){
        let jd4 = Math.round((jd_miao/3600) * 1000000) / 1000000
        $('#point_jd').val(jd4)
        this.A(1, jd4)
      }
    }
    
    changedu_wd(){  //度分秒，纬度 度改变
      let wd_du = Number($('#du_wd').val())//获取
      let wd_fen = $('#fen_wd').val()
      let wd_miao = $('#miao_wd').val()
      if (wd_fen.length>0 && wd_miao.length>0){
        let wd_fen1 = Number($('#fen_wd').val())
        let wd_miao1 = Number($('#miao_wd').val())
        let wd1 = Math.round((wd_du + wd_fen1/60 + wd_miao1/3600) * 1000000) / 1000000
        $('#point_wd').val(wd1)//十进制改变
        this.A(2, wd1)
      }
      else if(wd_fen.length>0 || wd_miao.length==0){
        let wd_fen2 = Number($('#fen_wd').val())
        let wd2 = Math.round((wd_du + wd_fen2/60) * 1000000) / 1000000
        $('#point_wd').val(wd2)
        this.A(2, wd2)
      }
      else if(wd_miao.length>0 || wd_fen.length==0){
        let wd_miao2 = Number($('#miao_wd').val())
        let wd3 = Math.round((wd_du + wd_miao2/3600) * 1000000) / 1000000
        $('#point_wd').val(wd3)
        this.A(2, wd3)
      }
      else if(wd_fen.length==0 && wd_miao.length==0){
        $('#point_wd').val(wd_du)
        this.A(2, wd_du)
      }
    }
    
    changefen_wd(){  //度分秒，纬度 分改变
      let wd_fen = Number($('#fen_wd').val())//获取
      let wd_du = $('#du_wd').val()
      let wd_miao = $('#miao_wd').val()
      if (wd_du.length>0 && wd_miao.length>0){
        let wd_du1 = Number($('#du_wd').val())
        let wd_miao1 = Number($('#miao_wd').val())
        let wd1 = Math.round((wd_du1 + wd_fen/60 + wd_miao1/3600) * 1000000) / 1000000
        $('#point_wd').val(wd1)//十进制改变
        this.A(2, wd1)
      }
      else if(wd_du.length>0 || wd_miao.length==0){
        let wd_du2 = Number($('#du_wd').val())
        let wd2 = Math.round((wd_du2 + wd_fen/60) * 1000000) / 1000000
        $('#point_wd').val(wd2)
        this.A(2, wd2)
      }
      else if(wd_miao.length>0 || wd_du.length==0){
        let wd_miao2 = Number($('#miao_wd').val())
        let wd3 = Math.round((wd_fen/60 + wd_miao2/3600) * 1000000) / 1000000
        $('#point_wd').val(wd3)
        this.A(2, wd3)
      }
      else if(wd_fen.length==0 && wd_miao.length==0){
        let wd4 = Math.round((wd_fen/60) * 1000000) / 1000000
        $('#point_wd').val(wd4)
        this.A(2, wd4)
      }
    }
    
    changemiao_wd(){  //度分秒，纬度 秒改变
      let wd_miao = Number($('#miao_wd').val())//获取
      let wd_du = $('#du_wd').val()
      let wd_fen = $('#fen_wd').val()
      if (wd_du.length>0 && wd_fen.length>0){
        let wd_du1 = Number($('#du_wd').val())
        let wd_fen1 = Number($('#fen_wd').val())
        let wd1 = Math.round((wd_du1 + wd_fen1/60 + wd_miao/3600) * 1000000) / 1000000
        $('#point_wd').val(wd1)//十进制改变
        this.A(2, wd1)
      }
      else if(wd_du.length>0 || wd_fen.length==0){
        let wd_du2 = Number($('#du_wd').val())
        let wd2 = Math.round((wd_du2 + wd_miao/3600) * 1000000) / 1000000
        $('#point_wd').val(wd2)
        this.A(2, wd2)
      }
      else if(wd_fen.length>0 || wd_du.length==0){
        let wd_fen2 = Number($('#fen_wd').val())
        let wd3 = Math.round((wd_fen2/60 + wd_miao/3600) * 1000000) / 1000000
        $('#point_wd').val(wd3)
        this.A(2, wd3)
      }
      else if(wd_fen.length==0 && wd_miao.length==0){
        let wd4 = Math.round((wd_miao/3600) * 1000000) / 1000000
        $('#point_wd').val(wd4)
        this.A(2, wd4)
      }
    }
    
    change_3jd(){  //CGCS2000三度带 经度变化
      let jd = Number($('#san_jd').val())//获取
      let wd = $('#san_wd').val()
      if(wd.length>0){
        let wd1 = Number($('#san_wd').val())
        var a = mars3d.PointTrans.proj4Trans([jd, wd1], mars3d.CRS.CGCS2000_GK_Zone_3, mars3d.CRS.EPSG4326);
        $('#point_jd').val(Math.round(a[0] * 1000000) / 1000000) //WGS84十进制改变
        this.Ten2DMS(a[0], '#du_jd', '#fen_jd', '#miao_jd')  ////WGS84度分秒改变
        this.CGCSchangeTo6(a[0], a[1], '#liu_jd', '#liu_wd')
      }
      else{
        this.ToEmpty(['#point_jd', '#du_jd', '#fen_jd', '#miao_jd', '#san_jd'])
      }
    }
    
    change_3wd(){  //CGCS2000三度带 纬度变化
      let wd = Number($('#san_wd').val())//获取
      let jd = $('#san_jd').val()
      if(jd.length>0){
        let jd1 = Number($('#san_jd').val())
        var a = mars3d.PointTrans.proj4Trans([jd1, wd], mars3d.CRS.CGCS2000_GK_Zone_3, mars3d.CRS.EPSG4326);
        $('#point_wd').val(Math.round(a[1] * 1000000) / 1000000) //WGS84十进制改变
        this.Ten2DMS(a[1], '#du_wd', '#fen_wd', '#miao_wd')  ////WGS84度分秒改变
        this.CGCSchangeTo6(a[0], a[1], '#liu_jd', '#liu_wd')
      }
      else{
        this.ToEmpty(['#point_wd', '#du_wd', '#fen_wd', '#miao_wd', '#san_wd'])
      }
    }
    
    change_6jd(){  //CGCS2000六度带 经度变化
      let jd = Number($('#liu_jd').val())//获取
      let wd = $('#liu_wd').val()
      if(wd.length>0){
        let wd1 = Number($('#liu_wd').val())
        var a = mars3d.PointTrans.proj4Trans([jd, wd1], mars3d.CRS.CGCS2000_GK_Zone_6, mars3d.CRS.EPSG4326);
        $('#point_jd').val(Math.round(a[0] * 1000000) / 1000000) //WGS84十进制改变   
        this.Ten2DMS(a[0], '#du_jd', '#fen_jd', '#miao_jd')  ////WGS84度分秒改变
        this.CGCSchangeTo3(a[0], a[1], '#san_jd', '#san_wd')
      }
      else{
        this.ToEmpty(['#point_jd', '#du_jd', '#fen_jd', '#miao_jd', '#san_jd'])
      }
    }
    
    change_6wd(){  //CGCS2000六度带 纬度变化
      let wd = Number($('#liu_wd').val())//获取
      let jd = $('#liu_jd').val()
      if(jd.length>0){
        let jd1 = Number($('#liu_jd').val())
        var a = mars3d.PointTrans.proj4Trans([jd1, wd], mars3d.CRS.CGCS2000_GK_Zone_6, mars3d.CRS.EPSG4326);
        $('#point_wd').val(Math.round(a[1] * 1000000) / 1000000) //WGS84十进制改变
        this.Ten2DMS(a[1], '#du_wd', '#fen_wd', '#miao_wd')  ////WGS84度分秒改变
        this.CGCSchangeTo3(a[0], a[1], '#san_jd', '#san_wd')
      }
      else{
        this.ToEmpty(['#point_wd', '#du_wd', '#fen_wd', '#miao_wd', '#san_wd'])
      }
    }
    
    ToEmpty(arr){
      for(var i=0; i<arr.length; i++)
      {
        $(arr[i]).val(" ")
      }
    }
    
    changeH(a, b, c, d){ //
      var h = Number($(a).val())
      $(b).val(h)
      $(c).val(h)
      $(d).val(h)
    }

    CGCSchangeTo3(jd, wd, a, b){
      var A = mars3d.PointTrans.proj4Trans([jd, wd], mars3d.CRS.EPSG4326, mars3d.CRS.CGCS2000_GK_Zone_3);
      $(a).val(Math.round(A[0] * 100) / 100)
      $(b).val(Math.round(A[1] * 100) / 100)
    }
    
    CGCSchangeTo6(jd, wd, a, b){
      var A = mars3d.PointTrans.proj4Trans([jd, wd], mars3d.CRS.EPSG4326, mars3d.CRS.CGCS2000_GK_Zone_6);
      $(a).val(Math.round(A[0] * 100) / 100)
      $(b).val(Math.round(A[1] * 100) / 100)
    }
    
    Ten2DMS(degree, a, b, c){ //十进制转度分秒
      $(a).val(parseInt(degree))
      $(b).val(parseInt((degree % 1)*60))
      $(c).val(Math.round((((degree % 1)*60) % 1)*60 * 100) / 100)
    }



  }

  //注册到widget管理器中。
  mars3d.widget.bindClass(MyWidget)

  //每个widet之间都是直接引入到index.html中，会存在彼此命名冲突，所以闭包处理下。
})(window, mars3d)
