const scriptName = "동그라미 봇 테스트";
/**
 * (string) room
 * (string) sender
 * (boolean) isGroupChat
 * (void) replier.reply(message)
 * (boolean) replier.reply(room, message, hideErrorToast = false) // 전송 성공시 true, 실패시 false 반환
 * (string) imageDB.getProfileBase64()
 * (string) packageName
 */
var preMsg={};

function lolTierInfo(nickname) {
    try {
        var encodeNickname = encodeURI(nickname); 
           

        var data = org.jsoup.Jsoup.connect("https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/"+ encodeNickname +"?api_key=" + key).ignoreContentType(true)
        .get();

        var json = JSON.parse(data.text());

        var id = json.id;

        var data2 = org.jsoup.Jsoup.connect("https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/"+ id +"?api_key=" + key).ignoreContentType(true)
        .get();

        var json2 = JSON.parse(data2.text());

        return json2[0].tier + json2[0].rank;

      
    }
    catch(e) {
        debug("asdf");
        return null;
    }
}

function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId){
    if(room == "동그라미 봇" || room == "테스트용방이름"){

        msg = msg.trim();
   
        if (preMsg[room] == null){
            preMsg[room] = 0;
        }

        preMsg[room] = parseInt(preMsg[room]) + 1;

        if(msg.indexOf("안녕") != -1){
            replier.reply("환영합니다~ ");
        }

        else if(msg.indexOf("/롤전적 ") == 0 ){
            var result = lolTierInfo(msg.replace("/롤전적 ",""));
            replier.reply(result);
        }
    } 
}


//아래 4개의 메소드는 액티비티 화면을 수정할때 사용됩니다.
function onCreate(savedInstanceState, activity) {
  var textView = new android.widget.TextView(activity);
  textView.setText("Hello, World!");
  textView.setTextColor(android.graphics.Color.DKGRAY);
  activity.setContentView(textView);
}

function onStart(activity) {}

function onResume(activity) {}

function onPause(activity) {}

function onStop(activity) {}