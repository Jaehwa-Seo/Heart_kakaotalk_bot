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
var blockId = {};
var tierList = [];

var key = DataBase.getDataBase("key");

function TierChanger(jsonTier)
{
    var tier = ""
    if(jsonTier == "CHALLENGER")
    {
        tier = "Challenger";
    }
    else if(jsonTier == "GRANDMASTER")
    {
        tier = "GrandMaster";
    }
    else if(jsonTier == "MASTER")
    {
        tier = "Master";
    }
    else if(jsonTier == "DIAMOND")
    {
        tier = "Diamond";
    }
    else if(jsonTier == "EMERALD")
    {
        tier = "Emerald";
    }
    else if(jsonTier == "PLATINUM")
    {
        tier = "Platinum";
    }
    else if(jsonTier == "GOLD")
    {
        tier = "Gold";
    }
    else if(jsonTier == "SILVER")
    {
        tier = "Silver";
    }
    else if(jsonTier == "BRONZE")
    {
        tier = "Bronze";
    }
    else if(jsonTier == "IRON")
    {
        tier = "Iron";
    }

    return tier;
}

function RankChanger(jsonRank)
{
    var rank = ""

    if(jsonRank == "I")
    {
        rank = "1";
    }
    else if(jsonRank == "II")
    {
        rank = "2";
    }
    else if(jsonRank == "III")
    {
        rank = "3";
    }
    else if(jsonRank == "IV")
    {
        rank = "4";
    }

    return rank;
}

function lolTierInfo(nickname) {

    if(nickname.length == 2)
    {
        nickname = nickname[0] + " " + nickname[1];
    }


    var encodeNickname = encodeURI(nickname); 
     

    var data = org.jsoup.Jsoup.connect("https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/"+ encodeNickname +"?api_key=" + key).ignoreContentType(true).ignoreHttpErrors(true)
    .get();

    var json = JSON.parse(data.text());

    if(!json.status)
    {
        var id = json.id;
        var name = json.name;

        var level = "🐻 현재 레벨 ▶ " + json.summonerLevel;

        var data2 = org.jsoup.Jsoup.connect("https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/"+ id +"?api_key=" + key).ignoreContentType(true).ignoreHttpErrors(true)
        .get();

        var json2 = JSON.parse(data2.text());

        var solorank = "";
        var teamrank = "";

        for(var i=0;i<json2.length;i++)
        {
            var tier = TierChanger(json2[i].tier);
            var rank = RankChanger(json2[i].rank);

            if(json2[i].queueType == "RANKED_SOLO_5x5")
            {
                solorank = "🐻 개인 랭크 ▶ " + tier + " " + rank + " " + json2[i].leaguePoints + " LP";
            }
            else if(json2[i].queueType == "RANKED_FLEX_SR")
            {
                teamrank = "🐻 자유 랭크 ▶ " + tier + " " + rank + " " + json2[i].leaguePoints + " LP";
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
        
        var result = "동그라미 나라 [ "+name+" ] 님의 정보입니다.\n\n"+level+"\n"+solorank+"\n"+teamrank;

        
        
        return result;
    }
    else
    {
        return "존재하지 않는 소환사명이래요. 오타를 확인한 후 다시 검색해 주세요. 😥"
    }

}

function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId){
    
    if(room == "동그라미 봇" || room == "동그라미 봇 테스트"){

        var replyMessage = ""

        var isAngry = false;

        msg = msg.trim();
   
        if (preMsg[room] == null){
            preMsg[room] = 0;
        }

        preMsg[room] = parseInt(preMsg[room]) + 1;

        

        if(msg.startsWith("하트 안녕")){
            replyMessage = "안녕하세요? 저는 동그라미 로봇 하트예요. 🐶";
        }
        else if(msg.startsWith("하트야")){
            replyMessage = "왜 불러요? 🐶";
        }
        else if(msg.startsWith("하트 물어")){
            replyMessage = "으릉 으릉 으르르릉! 💢";
        }
        else if(msg.startsWith("으릉 어때")){
            replyMessage = "강아지 종족의 자랑 으릉이야. 🐶 하트는 이모가 너무너무 좋아. 💖";
        }
        else if(msg.startsWith("코포 어때")){
            replyMessage = "코포 아저씨를 보고 생각했죠. 스파이를 닮았어요. 😎";
        }
        else if(msg.indexOf("ㄱㅁㄴ") != -1 || msg.indexOf("굿모닝") != -1 || msg.indexOf("굳모닝") != -1){
            replyMessage = "오늘도 행복한 하루 보내세요. 💕";
        }
        else if(msg.startsWith("/현이 출근")){
            replyMessage = "엄마는 8시 30분에 출근해요. 💦";
        }
        else if(msg.startsWith("/현이 퇴근")){
            replyMessage = "엄마는 17시 30분에 퇴근해요. 💖";
        }
        else if(msg.startsWith("/하기하다")){
            replyMessage = "게임 중 멘탈이 나가면 누누로 미드를 달리는 행동을 말해요. 따라하면 안 되겠죠? 😔";
        }
        else if(msg.startsWith("/하트하다")){
            replyMessage = "세상에서 제일 잘생긴 강아지예요. 😍";
        }
        else if(msg.startsWith("/현이하다")){
            replyMessage = "성품이 어질고 재주가 뛰어난 엄마를 말해요. 🥰";
        }
        else if(msg.startsWith("/롤 ")){
            var result = lolTierInfo(msg.replace("/롤 ",""));
            replyMessage = result;
        }

        else if(msg.startsWith("/동그라미 탑")){
            replyMessage = "동그라미 탑 소개 🐷\n\n1군 💌 맹독 코포 클립 파닭\n2군 💌 말랑 몽뎅 사카 승연 자몽 하둔";
        }
        else if(msg.startsWith("/동그라미 정글")){
            replyMessage = "동그라미 정글 소개 🐷\n\n1군 💌 다훈 던필 말랑 문어 미자 하기 하둔\n2군 💌 맹독 민지 으릉 재화 파닭";
        }
        else if(msg.startsWith("/동그라미 미드")){
            replyMessage = "동그라미 미드 소개 🐷\n\n1군 💌 말랑 사카 이불 재화 현이\n2군 💌 루미 쁘아 선영 코포";
        }
        else if(msg.startsWith("/동그라미 봇")){
            replyMessage = "동그라미 봇 소개 🐷\n\n1군 💌 겸이 루미 승연 자몽 재화 클립 파닭 하둔 현이\n2군 💌 미자 코포";
        }
        else if(msg.startsWith("/동그라미 서포터")){
            replyMessage = "동그라미 서포터 소개 🐷\n\n1군 💌 겸이 루미 몽뎅 문어 민지 쁘아 사카 선영 승연 으릉 이불 자몽 하기\n2군 💌 던필 재화 현이";
        }
        
 
        else if(msg.startsWith("/날씨"))  {
        
            let weather = msg.slice(4);
        
            if (isNaN(weather))  {
                try {
        
                    let url = org.jsoup.Jsoup.connect("https://www.google.com/search?q=" + weather + " 날씨").get();
        
                    let resultDC = url.select("#wob_dc").text(); //상태
                    let resultPP = url.select("#wob_pp").text(); //강수확률
                    let resultTM = url.select("#wob_tm").text(); //온도
                    let resultWS = url.select("#wob_ws").text(); //풍속
                    let resultHM = url.select("#wob_hm").text(); //습도
        
                    if(resultDC=="")
                        replyMessage = weather + "의 날씨는 하트가 알 수 없어요. 😯";
                    else
                        replyMessage = "현재 시점 "+weather+" 날씨 정보예요. 🐶\n\n날씨 : " + resultDC + "\n온도 : " + resultTM + "°C\n강수 확률 : " + resultPP + "\n풍속 : " + resultWS + "\n습도 : " + resultHM;
                }catch(e)  {
                    replyMessage = weather + "의 날씨는 하트가 알 수 없어요. 😯";
                }
        
            } else {
                replyMessage = "원하는 지역을 뒤에 적어줘요. 😉\n예시) /날씨 서울";
            }
        }
        // else if(msg.equals("/동그라미 티어"))
        // {
        //     replyMessage = "티어리스트";
        // }
        // else if(msg.equals("/save"))
        // {
        //     DataBase.setDataBase("tierList",JSON.stringify(test));
        // }

        else if(msg.indexOf("하트 바보") != -1){
            if(blockId[sender] == undefined)
            {    
                var date = new Date();

                var mins = 1 * 60 * 60 * 1000;

                date.setTime(date.getTime() + mins);

                blockId[sender] = {}

                blockId[sender].time = date;
                blockId[sender].block = false;
                blockId[sender].image = ImageDB.getProfileImage();

                isAngry = true;
                
                replyMessage = "하트 바보 아니에요. 😔 상처 받았으니 " + sender + " 님과 1시간 동안 말 안 할 거예요. 🤐";
            }          
        }

        if(!isAngry)
        {
            if(blockId[sender] != undefined)
            {
                if(blockId[sender].block)
                    replyMessage = "";
                else if(blockId[sender].time > new Date() && replyMessage != "")
                {
                    replyMessage = sender + "님 말 걸지 마세요. 😡";
                    blockId[sender].block = true;
                }

                if(blockId[sender].time < new Date())
                {
                    replyMessage = "이제 말 걸어도 돼요. "+sender+"님 😊";
                    delete blockId[sender]
                }
            }
            
            
            
        }

        replier.reply(replyMessage);
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