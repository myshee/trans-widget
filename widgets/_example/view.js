'use script' //开发环境建议开启严格模式

//对应widget.js中MyWidget实例化后的对象
var thisWidget

//当前页面业务
function initWidgetView(_thisWidget) {
  thisWidget = _thisWidget
}

//测试
function A(a, b){
  if(a==1)//经度改变
  {
    let wd = $('#point_wd').val()
    if (wd.length>0){
      let wd1 = Number($('#point_wd').val())
      thisWidget.CGCSchangeTo3(b, wd1 ,'#san_jd', '#san_wd')
      thisWidget.CGCSchangeTo6(b, wd1 ,'#liu_jd', '#liu_wd')
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
      thisWidget.CGCSchangeTo3(jd1, b ,'#san_jd', '#san_wd')
      thisWidget.CGCSchangeTo6(jd1, b ,'#liu_jd', '#liu_wd')
    }
    else{
      $('#san_wd').val(" ")
      $('#liu_wd').val(" ")
    }
  }
}

function change_jd(){  //十进制经度改变时，更新
  let jd_1 = Number($('#point_jd').val())//获取经度
  if(jd_1>180 || jd_1<-180){
    alert("请输入正确的经度值！")
    $('#point_jd').val(" ")
  }
  else{
    thisWidget.Ten2DMS(jd_1, '#du_jd', '#fen_jd', '#miao_jd')  //更新度分秒的经纬度 
    A(1, jd_1)
  }
}

function change_wd(){  //十进制纬度改变时，更新
  let wd_1 = Number($('#point_wd').val())//获取
  if(wd_1>90 || wd_1<-90){
    alert("请输入正确的纬度值！")
    $('#point_wd').val(" ")
  }
  else{  
    thisWidget.Ten2DMS(wd_1, '#du_wd', '#fen_wd', '#miao_wd')  //更新度分秒的经纬度
    A(2, wd_1)
  }
}

function changedu_jd(){  //度分秒，经度 度改变
  let jd_du = Number($('#du_jd').val())//获取
  let jd_fen = $('#fen_jd').val()
  let jd_miao = $('#miao_jd').val()
  if (jd_fen.length>0 && jd_miao.length>0){
    let jd_fen1 = Number($('#fen_jd').val())
    let jd_miao1 = Number($('#miao_jd').val())
    let jd1 = Math.round((jd_du + jd_fen1/60 + jd_miao1/3600) * 1000000) / 1000000
    $('#point_jd').val(jd1)//十进制改变
    A(1, jd1)
  }
  else if(jd_fen.length>0 || jd_miao.length==0){
    let jd_fen2 = Number($('#fen_jd').val())
    let jd2 = Math.round((jd_du + jd_fen2/60) * 1000000) / 1000000
    $('#point_jd').val(jd2)
    A(1, jd2)
  }
  else if(jd_miao.length>0 || jd_fen.length==0){
    let jd_miao2 = Number($('#miao_jd').val())
    let jd3 = Math.round((jd_du + jd_miao2/3600) * 1000000) / 1000000
    $('#point_jd').val(jd3)
    A(1, jd3)
  }
  else if(jd_fen.length==0 && jd_miao.length==0){
    $('#point_jd').val(jd_du)
    A(1, jd_du)
  }
}

function changefen_jd(){  //度分秒，经度 分改变
  let jd_fen = Number($('#fen_jd').val())//获取
  let jd_du = $('#du_jd').val()
  let jd_miao = $('#miao_jd').val()
  if (jd_du.length>0 && jd_miao.length>0){
    let jd_du1 = Number($('#du_jd').val())
    let jd_miao1 = Number($('#miao_jd').val())
    let jd1 = Math.round((jd_du1 + jd_fen/60 + jd_miao1/3600) * 1000000) / 1000000
    $('#point_jd').val(jd1)//十进制改变
    A(1, jd1)
  }
  else if(jd_du.length>0 || jd_miao.length==0){
    let jd_du2 = Number($('#du_jd').val())
    let jd2 = Math.round((jd_du2 + jd_fen/60) * 1000000) / 1000000
    $('#point_jd').val(jd2)
    A(1, jd2)
  }
  else if(jd_miao.length>0 || jd_du.length==0){
    let jd_miao2 = Number($('#miao_jd').val())
    let jd3 = Math.round((jd_fen/60 + jd_miao2/3600) * 1000000) / 1000000
    $('#point_jd').val(jd3)
    A(1, jd3)
  }
  else if(jd_du.length==0 && jd_miao.length==0){
    let jd4 = Math.round((jd_fen/60) * 1000000) / 1000000
    $('#point_jd').val(jd4)
    A(1, jd4)
  }
}

function changemiao_jd(){  //度分秒，经度 秒改变
  let jd_miao = Number($('#miao_jd').val())//获取
  let jd_du = $('#du_jd').val()
  let jd_fen = $('#fen_jd').val()
  if (jd_du.length>0 && jd_fen.length>0){
    let jd_du1 = Number($('#du_jd').val())
    let jd_fen1 = Number($('#fen_jd').val())
    let jd1 = Math.round((jd_du1 + jd_fen1/60 + jd_miao/3600) * 1000000) / 1000000
    $('#point_jd').val(jd1)//十进制改变
    A(1, jd1)
  }
  else if(jd_du.length>0 || jd_fen.length==0){
    let jd_du2 = Number($('#du_jd').val())
    let jd2 = Math.round((jd_du2 + jd_miao/3600) * 1000000) / 1000000
    $('#point_jd').val(jd2)
    A(1, jd2)
  }
  else if(jd_fen.length>0 || jd_du.length==0){
    let jd_fen2 = Number($('#fen_jd').val())
    let jd3 = Math.round((jd_fen2/60 + jd_miao/3600) * 1000000) / 1000000
    $('#point_jd').val(jd3)
    A(1, jd3)
  }
  else if(jd_du.length==0 && jd_miao.length==0){
    let jd4 = Math.round((jd_miao/3600) * 1000000) / 1000000
    $('#point_jd').val(jd4)
    A(1, jd4)
  }
}

function changedu_wd(){  //度分秒，纬度 度改变
  let wd_du = Number($('#du_wd').val())//获取
  let wd_fen = $('#fen_wd').val()
  let wd_miao = $('#miao_wd').val()
  if (wd_fen.length>0 && wd_miao.length>0){
    let wd_fen1 = Number($('#fen_wd').val())
    let wd_miao1 = Number($('#miao_wd').val())
    let wd1 = Math.round((wd_du + wd_fen1/60 + wd_miao1/3600) * 1000000) / 1000000
    $('#point_wd').val(wd1)//十进制改变
    A(2, wd1)
  }
  else if(wd_fen.length>0 || wd_miao.length==0){
    let wd_fen2 = Number($('#fen_wd').val())
    let wd2 = Math.round((wd_du + wd_fen2/60) * 1000000) / 1000000
    $('#point_wd').val(wd2)
    A(2, wd2)
  }
  else if(wd_miao.length>0 || wd_fen.length==0){
    let wd_miao2 = Number($('#miao_wd').val())
    let wd3 = Math.round((wd_du + wd_miao2/3600) * 1000000) / 1000000
    $('#point_wd').val(wd3)
    A(2, wd3)
  }
  else if(wd_fen.length==0 && wd_miao.length==0){
    $('#point_wd').val(wd_du)
    A(2, wd_du)
  }
}

function changefen_wd(){  //度分秒，纬度 分改变
  let wd_fen = Number($('#fen_wd').val())//获取
  let wd_du = $('#du_wd').val()
  let wd_miao = $('#miao_wd').val()
  if (wd_du.length>0 && wd_miao.length>0){
    let wd_du1 = Number($('#du_wd').val())
    let wd_miao1 = Number($('#miao_wd').val())
    let wd1 = Math.round((wd_du1 + wd_fen/60 + wd_miao1/3600) * 1000000) / 1000000
    $('#point_wd').val(wd1)//十进制改变
    A(2, wd1)
  }
  else if(wd_du.length>0 || wd_miao.length==0){
    let wd_du2 = Number($('#du_wd').val())
    let wd2 = Math.round((wd_du2 + wd_fen/60) * 1000000) / 1000000
    $('#point_wd').val(wd2)
    A(2, wd2)
  }
  else if(wd_miao.length>0 || wd_du.length==0){
    let wd_miao2 = Number($('#miao_wd').val())
    let wd3 = Math.round((wd_fen/60 + wd_miao2/3600) * 1000000) / 1000000
    $('#point_wd').val(wd3)
    A(2, wd3)
  }
  else if(wd_fen.length==0 && wd_miao.length==0){
    let wd4 = Math.round((wd_fen/60) * 1000000) / 1000000
    $('#point_wd').val(wd4)
    A(2, wd4)
  }
}

function changemiao_wd(){  //度分秒，纬度 秒改变
  let wd_miao = Number($('#miao_wd').val())//获取
  let wd_du = $('#du_wd').val()
  let wd_fen = $('#fen_wd').val()
  if (wd_du.length>0 && wd_fen.length>0){
    let wd_du1 = Number($('#du_wd').val())
    let wd_fen1 = Number($('#fen_wd').val())
    let wd1 = Math.round((wd_du1 + wd_fen1/60 + wd_miao/3600) * 1000000) / 1000000
    $('#point_wd').val(wd1)//十进制改变
    A(2, wd1)
  }
  else if(wd_du.length>0 || wd_fen.length==0){
    let wd_du2 = Number($('#du_wd').val())
    let wd2 = Math.round((wd_du2 + wd_miao/3600) * 1000000) / 1000000
    $('#point_wd').val(wd2)
    A(2, wd2)
  }
  else if(wd_fen.length>0 || wd_du.length==0){
    let wd_fen2 = Number($('#fen_wd').val())
    let wd3 = Math.round((wd_fen2/60 + wd_miao/3600) * 1000000) / 1000000
    $('#point_wd').val(wd3)
    A(2, wd3)
  }
  else if(wd_fen.length==0 && wd_miao.length==0){
    let wd4 = Math.round((wd_miao/3600) * 1000000) / 1000000
    $('#point_wd').val(wd4)
    A(2, wd4)
  }
}

function change_3jd(){  //CGCS2000三度带 经度变化
  let jd = Number($('#san_jd').val())//获取
  let wd = $('#san_wd').val()
  if(wd.length>0){
    let wd1 = Number($('#san_wd').val())
    var a = thisWidget.ThreeToEPSG(jd,wd1)
    $('#point_jd').val(Math.round(a[0] * 1000000) / 1000000) //WGS84十进制改变
    thisWidget.Ten2DMS(a[0], '#du_jd', '#fen_jd', '#miao_jd')  ////WGS84度分秒改变
    thisWidget.CGCSchangeTo6(a[0], a[1], '#liu_jd', '#liu_wd')
  }
  else{
    ToEmpty(['#point_jd', '#du_jd', '#fen_jd', '#miao_jd', '#san_jd'])
  }
}

function change_3wd(){  //CGCS2000三度带 纬度变化
  let wd = Number($('#san_wd').val())//获取
  let jd = $('#san_jd').val()
  if(jd.length>0){
    let jd1 = Number($('#san_jd').val())
    var a = thisWidget.ThreeToEPSG(jd1,wd)
    $('#point_wd').val(Math.round(a[1] * 1000000) / 1000000) //WGS84十进制改变
    thisWidget.Ten2DMS(a[1], '#du_wd', '#fen_wd', '#miao_wd')  ////WGS84度分秒改变
    thisWidget.CGCSchangeTo6(a[0], a[1], '#liu_jd', '#liu_wd')
  }
  else{
    ToEmpty(['#point_wd', '#du_wd', '#fen_wd', '#miao_wd', '#san_wd'])
  }
}

function change_6jd(){  //CGCS2000六度带 经度变化
  let jd = Number($('#liu_jd').val())//获取
  let wd = $('#liu_wd').val()
  if(wd.length>0){
    let wd1 = Number($('#liu_wd').val())
    var a = thisWidget.SixToEPSG(jd,wd1)
    $('#point_jd').val(Math.round(a[0] * 1000000) / 1000000) //WGS84十进制改变   
    thisWidget.Ten2DMS(a[0], '#du_jd', '#fen_jd', '#miao_jd')  ////WGS84度分秒改变
    thisWidget.CGCSchangeTo3(a[0], a[1], '#san_jd', '#san_wd')
  }
  else{
    ToEmpty(['#point_jd', '#du_jd', '#fen_jd', '#miao_jd', '#san_jd'])
  }
}

function change_6wd(){  //CGCS2000六度带 纬度变化
  let wd = Number($('#liu_wd').val())//获取
  let jd = $('#liu_jd').val()
  if(jd.length>0){
    let jd1 = Number($('#liu_jd').val())
    var a = thisWidget.SixToEPSG(jd1,wd)
    $('#point_wd').val(Math.round(a[1] * 1000000) / 1000000) //WGS84十进制改变
    thisWidget.Ten2DMS(a[1], '#du_wd', '#fen_wd', '#miao_wd')  ////WGS84度分秒改变
    thisWidget.CGCSchangeTo3(a[0], a[1], '#san_jd', '#san_wd')
  }
  else{
    ToEmpty(['#point_wd', '#du_wd', '#fen_wd', '#miao_wd', '#san_wd'])
  }
}

function ToEmpty(arr){
  for(var i=0; i<arr.length; i++)
  {
    $(arr[i]).val(" ")
  }
}

function changeH(a, b, c, d){ //
  var h = Number($(a).val())
  $(b).val(h)
  $(c).val(h)
  $(d).val(h)
}