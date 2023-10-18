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

function lolTierInfo(nickname) {

    var encodeNickname = encodeURI(nickname); 
     

    var data = org.jsoup.Jsoup.connect("https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/"+ encodeNickname +"?api_key=" + key).ignoreContentType(true).ignoreHttpErrors(true)
    .get();

    var json = JSON.parse(data.text());

    if(!json.status)
    {
        var id = json.id;

        var data2 = org.jsoup.Jsoup.connect("https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/"+ id +"?api_key=" + key).ignoreContentType(true).ignoreHttpErrors(true)
        .get();

        var json2 = JSON.parse(data2.text());

        var solorank = "";
        var teamrank = "";

        for(var i=0;i<json2.length;i++)
        {
            var tier = "";
            var level = "";

            if(json2[i].tier == "CHALLENGER")
            {
                tier = "Challenger";
            }
            else if(json2[i].tier == "GRANDMASTER")
            {
                tier = "GrandMaster";
            }
            else if(json2[i].tier == "MASTER")
            {
                tier = "Master";
            }
            else if(json2[i].tier == "DIAMOND")
            {
                tier = "Diamond";
            }
            else if(json2[i].tier == "EMERALD")
            {
                tier = "Emerald";
            }
            else if(json2[i].tier == "PLATINUM")
            {
                tier = "Platinum";
            }
            else if(json2[i].tier == "GOLD")
            {
                tier = "Gold";
            }
            else if(json2[i].tier == "SILVER")
            {
                tier = "Silver";
            }
            else if(json2[i].tier == "BRONZE")
            {
                tier = "Bronze";
            }
            else if(json2[i].tier == "IRON")
            {
                tier = "Iron";
            }

            if(json2[i].rank == "I")
            {
                level = "1";
            }
            else if(json2[i].rank == "II")
            {
                level = "2";
            }
            else if(json2[i].rank == "III")
            {
                level = "3";
            }
            else if(json2[i].rank == "IV")
            {
                level = "4";
            }


            if(json2[i].queueType == "RANKED_SOLO_5x5")
            {
                solorank = "🐻 개인 랭크 ▶ " + tier + " " + level + " " + json2[i].leaguePoints + " LP";
            }
            else if(json2[i].queueType == "RANKED_FLEX_SR")
            {
                teamrank = "🐻 자유 랭크 ▶ " + tier + " " + level + " " + json2[i].leaguePoints + " LP";
            }

            
        }

        if(solorank == "")
        {
            solorank = "🐻 개인 랭크 ▶ 랭크 없음";
        }

        if(teamrank == "")
        {
            teamrank = "🐻 자유 랭크 ▶ 랭크 없음";
        }
        
        var result = "동그라미 나라 [ "+nickname+" ] 님의 정보입니다.\n\n"+solorank+"\n"+teamrank;
        
        return result;
    }
    else
    {
        return "존재하지 않는 소환사명이래요. 오타를 확인한 후 다시 검색해 주세요. 😥"
    }

}

function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId){
    if(room == "동그라미 봇" || room == "동그라미 봇 테스트"){

        msg = msg.trim();
   
        if (preMsg[room] == null){
            preMsg[room] = 0;
        }

        preMsg[room] = parseInt(preMsg[room]) + 1;

        if(msg.indexOf("안녕") == 0){
            replier.reply("안녕하세요? 저는 동그라미 로봇 하트예요. 🐶");
        }
        else if(msg.indexOf("하트야") == 0){
            replier.reply("왜 불러요? 🐶");
        }
        else if(msg.indexOf("하트 물어") == 0){
            replier.reply("으릉 으릉 으르르릉! 💢");
        }
        else if(msg.indexOf("ㄱㅁㄴ") == 0 || msg.indexOf("굿모닝") == 0){
            replier.reply("오늘도 행복한 하루 보내세요. 💕");
        }
        else if(msg.indexOf("/현이 출근") == 0){
            replier.reply("엄마는 8시 30분에 출근해요. 💦");
        }
        else if(msg.indexOf("/현이 퇴근") == 0){
            replier.reply("엄마는 17시 30분에 퇴근해요. 💖");
        }
        else if(msg.indexOf("/하기하다") == 0){
            replier.reply("게임 중 멘탈이 나가면 누누로 미드를 달리는 행동을 말해요. 따라하면 안 되겠죠? 😔");
        }
        else if(msg.indexOf("/하트하다") == 0){
            replier.reply("세상에서 제일 잘생긴 강아지예요. 😍");
        }
        else if(msg.indexOf("/현이하다") == 0){
            replier.reply("성품이 어질고 재주가 뛰어난 엄마를 말해요. 🥰");
        }

        else if(msg.indexOf("/롤 ") == 0 ){
            var result = lolTierInfo(msg.replace("/롤 ",""));
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