const scriptName = "동그라미 봇";
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
            replier.reply("https://www.op.gg/summoner/userName="+msg.replace("/롤전적 ","")+"");
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