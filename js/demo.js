// 2013-7-29

function demo(){
  $("#send").click(function(){

    /* Load settings */
    var debugUrl = localStorage.getItem("url");
    var toUser = localStorage.getItem("toUser");
    var fromUser = localStorage.getItem("fromUser");
    var timestamp = Date.parse(new Date()) / 1000;

    var msg = "";
    var txt = $("#txt").val();
    var mydiv = $("<div class=\"mydiv\"></div>");
    mydiv.append( txt );
    $("#display").append( mydiv );

    var toUser = "<ToUserName><![CDATA["+toUser+"]]></ToUserName>";
    var fromUser = " <FromUserName><![CDATA["+ fromUser +"]]></FromUserName> ";
    var createTime = "<CreateTime>"+timestamp+"</CreateTime>";
    var msgType = "<MsgType><![CDATA[text]]></MsgType>";
    var content = "<Content><![CDATA["+ txt +"]]></Content>";
    var msgId = "<MsgId>1234567890123456</MsgId>";
    msg = "<xml>" + toUser + fromUser + createTime + msgType + content + msgId + "</xml>";
    //console.log( msg );

    $.ajax({
      url: debugUrl, 
      type: "POST",
      data: msg,
      processData: false,
      success: xmlParser

    });

    return false;
  });

  $("#setting").click(function () {
    var url = $("#url").val();
    var toUser = $("#toUser").val();
    var fromUser = $("#fromUser").val();

    localStorage.setItem("url", url);
    localStorage.setItem("toUser", toUser);
    localStorage.setItem("fromUser", fromUser);

    return false;
  });

  /* Load settings */
  var url = localStorage.getItem("url");
  var toUser = localStorage.getItem("toUser");
  var fromUser = localStorage.getItem("fromUser");

  $("#url").val(url);
  $("#toUser").val(toUser);
  $("#fromUser").val(fromUser);
}

function xmlParser(data, textStatus){
  //console.log(data);
  var xmlDoc = $.parseXML( data );
  $xml = $( xmlDoc );

  var msgType = $xml.find("MsgType").text();

  var wxdiv = $('<div class="wxdiv"></div>');

  if(msgType == "text"){
    var content = $xml.find("Content");
    wxdiv.append( content.text() );
    $("#display").append( wxdiv );

  }else if(msgType == "news"){
    var articleDiv = $('<div class="article"></div>');
    //var articleHead = $('<div class="articleHead"></div>');
    

    $xml.find("item").each(function() {
      var articleItem = $('<div class="articleItem"></div>');

      var title = $(this).find("Title").text();
      var desc = $(this).find("Description").text();
      var picUrl = $(this).find("PicUrl").text();
      var url = $(this).find("Url").text();

      var link = $('<a href="'+ url + '"></a>');


      link.append( '<div class="itemTitle">'+title+'</div>' );
      link.append( '<div class="itemDesc">'+desc+'</div>' );
      link.append( '<div class="itemPic"><img src="'+picUrl+'"/></div>' );

      articleItem.append( link );

      articleDiv.append(articleItem);    
    });

    wxdiv.append( articleDiv );
    $("#display").append( wxdiv );

  }
  
}

$(function(){
  demo();

  document.onkeydown = function(e){
    if( (e.keyCode || e.event.which) == 13 ){
      $("#send").click();
      return false;
    }
  }
});
