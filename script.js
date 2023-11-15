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
var tierList = JSON.parse(DataBase.getDataBase("tierList"));
var gameType = JSON.parse(DataBase.getDataBase("gametype"));
var championData = JSON.parse(DataBase.getDataBase("championdata"));
var news = JSON.parse(DataBase.getDataBase("news"));
// var news = [];

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

function TierCalculator(tier)
{
    var score = 0;

    if(tier == "Bronze")
    {
        score = 400;
    }
    else if(tier == "Silver")
    {
        score = 800;
    }
    else if(tier == "Gold")
    {
        score = 1200;
    }
    else if(tier == "Platinum")
    {
        score = 1600;
    }
    else if(tier == "Emerald")
    {
        score = 2000;
    }
    else if(tier == "Diamond")
    {
        score = 2400;
    }
    else if(tier == "Master")
    {
        score = 2800;
    }
    else if(tier == "GrandMaster")
    {
        score = 2900;
    }
    else if(tier == "Challenger")
    {
        score = 3000;
    }


    return score;
}

function RankCalculator(rank)
{
    var score = 0

    if(rank == "1")
    {
        score = 300;
    }
    else if(rank == "2")
    {
        score = 200;
    }
    else if(rank == "3")
    {
        score = 100;
    }
    else if(rank == "4")
    {
        score = 0;
    }

    return score;
}

function getRiotId(nickname)
{
    var encodeNickname = encodeURI(nickname); 
     
    var data = org.jsoup.Jsoup.connect("https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/"+ encodeNickname +"?api_key=" + key).ignoreContentType(true).ignoreHttpErrors(true)
    .get();

    var json = JSON.parse(data.text());

    return json;
}

function getRiotLeagueData(id)
{
    var data = org.jsoup.Jsoup.connect("https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/"+ id +"?api_key=" + key).ignoreContentType(true).ignoreHttpErrors(true)
    .get();

    var leagueJson = JSON.parse(data.text());

    return leagueJson;
}

function getRiotMatchId(puuid)
{
    var data = org.jsoup.Jsoup.connect("https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/" + puuid + "/ids?start=0&count=10&api_key=" + key).ignoreContentType(true).ignoreHttpErrors(true).get();

    data = JSON.parse(data.text());

    return data;
}

function getRiotMatchData(matchid)
{
    var data = org.jsoup.Jsoup.connect("https://asia.api.riotgames.com/lol/match/v5/matches/" + matchid + "?api_key=" + key).ignoreContentType(true).ignoreHttpErrors(true).get();

    data = JSON.parse(data.text());
    
    return data;
}

function lolTierInfo(nickname) {

    if(nickname.length == 2)
    {
        nickname = nickname[0] + " " + nickname[1];
    }

    var json = getRiotId(nickname);

    if(!json.status)
    {
        var id = json.id;
        var name = json.name;

        var level = "🐻 현재 레벨 ▶ " + json.summonerLevel;

        var json2 = getRiotLeagueData(id)

        var solorank = "";
        var teamrank = "";

        for(var i=0;i<json2.length;i++)
        {
            var tier = TierChanger(json2[i].tier);
            var rank = RankChanger(json2[i].rank);

            if(json2[i].queueType == "RANKED_SOLO_5x5")
            {
                solorank = "🐻 개인 랭크 ▶ " + tier + " " + rank + " " + json2[i].leaguePoints + " LP";
                Object.keys(tierList).forEach((key) => {
                    if(name == tierList[key]["id"])
                    {
                        Log.d(name)
                        Log.d(tierList[key]["id"])
                        tierList[key]["solo"]["tier"] = tier;
                        tierList[key]["solo"]["rank"] = rank;
                        tierList[key]["solo"]["leaguepoint"] = json2[i].leaguePoints;

                        DataBase.removeDataBase("tierlist");
                        DataBase.setDataBase("tierlist",JSON.stringify(tierList));
                    }
                });
                // saveTier.push({"id" : name, "tier" : tier, "rank" : rank, "leaguepoint" : json2[i].leaguePoints});
            }
            else if(json2[i].queueType == "RANKED_FLEX_SR")
            {
                teamrank = "🐻 자유 랭크 ▶ " + tier + " " + rank + " " + json2[i].leaguePoints + " LP";

                Object.keys(tierList).forEach((key) => {
                    if(name == tierList[key]["id"])
                    {
                        Log.d(name)
                        Log.d(tierList[key]["id"])
                        tierList[key]["team"]["tier"] = tier;
                        tierList[key]["team"]["rank"] = rank;
                        tierList[key]["team"]["leaguepoint"] = json2[i].leaguePoints;

                        DataBase.removeDataBase("tierlist");
                        DataBase.setDataBase("tierlist",JSON.stringify(tierList));
                    }
                })
            }

            
        }

        if(solorank == "")
        {
            solorank = "🐻 개인 랭크 ▶ 랭크 없음";
            // saveTier.push({"id" : name, "tier" : "랭크 없음", "rank" : 0, "leaguepoint" : 0});
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

function ShowAllTier(type)
{
    var circleTierList = []
    var circleTierNoRankList = []

    var replyMessage = ""
    Object.keys(tierList).forEach((key) => {

        var score = TierCalculator(tierList[key][type]["tier"]) + RankCalculator(tierList[key][type]["rank"]) + tierList[key][type]["leaguepoint"];

        if(tierList[key][type]["tier"] != "랭크 없음")
            circleTierList.push([key,score]);
        else
            circleTierNoRankList.push([key]);
    });

    circleTierList.sort(function(a,b) {
        if(b[1] != a[1])
            return b[1] - a[1];
        else
            return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0;
    })
    Log.d(circleTierList);
    circleTierNoRankList.sort();

    for(var i=0;i<circleTierList.length;i++)
    {
        if(tierList[circleTierList[i][0]][type]["tier"] == "Master")
            replyMessage += "💜";
        else if(tierList[circleTierList[i][0]][type]["tier"] == "Diamond")
            replyMessage += "💙";
        else if(tierList[circleTierList[i][0]][type]["tier"] == "Emerald")
            replyMessage += "❤";   
        else if(tierList[circleTierList[i][0]][type]["tier"] == "Platinum")
            replyMessage += "💚";   
        else if(tierList[circleTierList[i][0]][type]["tier"] == "Gold")
            replyMessage += "💛";   
        else if(tierList[circleTierList[i][0]][type]["tier"] == "Silver")
            replyMessage += "🤍";   
        else if(tierList[circleTierList[i][0]][type]["tier"] == "Bronze")
            replyMessage += "🤎";
        
        if(tierList[circleTierList[i][0]][type]["tier"] == "Master")
            replyMessage += " " + circleTierList[i][0] + " " + tierList[circleTierList[i][0]][type]["tier"] + " " + tierList[circleTierList[i][0]][type]["leaguepoint"] + " LP\n"
        else
            replyMessage += " " + circleTierList[i][0] + " " + tierList[circleTierList[i][0]][type]["tier"] + " " + tierList[circleTierList[i][0]][type]["rank"] + " " + tierList[circleTierList[i][0]][type]["leaguepoint"] + " LP\n"
    }
    for(var i=0;i<circleTierNoRankList.length;i++)
    {
        replyMessage += "🖤 " + circleTierNoRankList[i][0] + " 랭크 없음";
        if(i!=circleTierNoRankList.length-1)
            replyMessage += "\n";
    }

    return replyMessage;
}

function response(room, msg, sender, isGroupChat, replier, ImageDB, packageName, threadId){
    
    if(room == "동그라미 봇 테스트"){

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

        //////////////// Command part
        // else if(msg.startsWith("/명령어") || msg.startsWith("/?"))  {
        //     replyMessage += "하트가 배운 것 🐶\n\n"
        //     replyMessage += "/날씨 지역\n"
        //     replyMessage += "날씨를 알 수 있어요. 내일 서울 날씨도 검색이 가능해요!\n\n"

        //     replyMessage += "/동그라미 뉴스\n"
        //     replyMessage += "동그라미에서 있는 일을 보여줘요.\n\n"

        //     replyMessage += "/동그라미 뉴스 등록 ~~~~\n"
        //     replyMessage += "동그라미 뉴스를 등록할 수 있어요. ~~~~ 부분에 내용을 입력하면 되요.\n\n"

        //     replyMessage += "/동그라미 뉴스 참가 1\n"
        //     replyMessage += "뉴스의 번호를 입력하면 내가 원하는 뉴스에 멤버로 참가할 수 있어요.\n\n"

        //     replyMessage += "/동그라미 뉴스 취소 1\n"
        //     replyMessage += "뉴스의 번호를 입력하면 내가 참가한 뉴스를 취소할 수 있어요. 작성자는 취소할 수 없어요.\n\n"

        //     replyMessage += "/동그라미 뉴스 삭제 1\n"
        //     replyMessage += "뉴스의 번호를 입력하면 내가 작성한 뉴스를 삭제할 수 있어요. 작성자가 아니면 삭제할 수 없어요.\n\n"

        //     replyMessage += "/동그라미 티어\n"
        //     replyMessage += "동그라미 나라 사람들의 티어를 보여줘요. 티어는 본 계정 솔랭 티어 기준이에요. 갱신을 원하면 /롤 명령어를 통해 한번 검색을 해야해요.\n\n"

        //     replyMessage += "/동그라미 탑\n"
        //     replyMessage += "동그라미 나라 탑 라인을 가는 사람들을 보여줘요. 본 계정 솔랭 전적을 기준으로 적었어요.\n\n";

        //     replyMessage += "/동그라미 정글\n"
        //     replyMessage += "동그라미 나라 정글 라인을 가는 사람들을 보여줘요. 본 계정 솔랭 전적을 기준으로 적었어요.\n\n";
            
        //     replyMessage += "/동그라미 미드\n"
        //     replyMessage += "동그라미 나라 미드 라인을 가는 사람들을 보여줘요. 본 계정 솔랭 전적을 기준으로 적었어요.\n\n";

        //     replyMessage += "/동그라미 봇\n"
        //     replyMessage += "동그라미 나라 봇 라인을 가는 사람들을 보여줘요. 본 계정 솔랭 전적을 기준으로 적었어요.\n\n";

        //     replyMessage += "/동그라미 서포터\n"
        //     replyMessage += "동그라미 나라 서포터 라인을 가는 사람들을 보여줘요. 본 계정 솔랭 전적을 기준으로 적었어요.\n\n";

        //     replyMessage += "/롤 아이디\n"
        //     replyMessage += "아이디의 레벨과 랭크 티어를 알려줘요.\n\n";

        //     replyMessage += "/오늘의 운세\n"
        //     replyMessage += "자몽님의 운세를 대신 알려줘요.\n\n";

        //     replyMessage += "/전적 아이디\n"
        //     replyMessage += "최근 10판의 전적과 승률을 알려줘요.\n\n";
            
        //     // /날씨, 동그라미 뉴스, /동그라미 뉴스 참가, /동그라미 뉴스 등록, /동그라미 뉴스 취소, /동그라미 뉴스 삭제 1, /오늘의 운세, /동그라미 티어, /동그라미 라인별,
        // }

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
        else if(msg.startsWith("/뉴스"))
        {
            if(msg == "/뉴스")
            {
                //show news
                replyMessage = "동그라미 일간 뉴스 🌻\n\n"

                news = JSON.parse(DataBase.getDataBase("news"));

                if(news.length != 0)
                {
                    for(var i=0;i<news.length;i++)
                    {
                        replyMessage += (i+1).toString() + ". " + news[i].news + " - " + news[i].writer + "\n[";
                
                        for(var j=0;j<news[i].participants.length;j++)
                        {
                            replyMessage += news[i].participants[j];
                            if(j!= news[i].participants.length-1)
                                replyMessage += ", ";
                            else
                                replyMessage += "]\n"
                        }

                        if(i!= news.length-1)
                            replyMessage += "\n";
                    }
                }
                else
                {
                    replyMessage = "오늘의 뉴스가 아직 없어요. 😪"
                }
            }
            else
            {
                var info = msg.split(' ');

                if(info[1] == "등록")
                {
                    if(info[2] != undefined)
                    {
                        var body = msg.replace("/뉴스 등록 ","");
                        
                        var cnt = 0;
                        for(var i=0;i<news.length;i++)
                        {
                            if(news[i].writer == sender)
                            {
                                cnt++;
                            }
                        }

                        if(cnt < 2)
                        {

                            news.push({writer : sender, news : body,participants : [sender]});

                            DataBase.removeDataBase("news");
                            DataBase.setDataBase("news",JSON.stringify(news));

                            replyMessage = "새로운 뉴스를 등록했습니다. 🌈"
                        }
                        else
                        {
                            Log.d(news);
                            Log.d(cnt);
                            replyMessage = "뉴스는 2개까지 등록이 가능해요. 🐷"
                        }
                    }
                    else
                    {
                        replyMessage = "형식을 확인하고 다시 입력해 주세요. /뉴스 등록 ~~~~ "
                    }
                }

                //참가
                else if(info[1] == "참가")
                {
                    var news_num = Number(msg.replace("/뉴스 참가 ",""));

                    if(info[2] != undefined && Number.isInteger(news_num))
                    {
                        
                        if(news[news_num-1] == undefined)
                        {
                            replyMessage = "뉴스를 찾을 수 없습니다. 번호를 확인해주세요."
                        }
                        else if(news[news_num-1].participants.includes(sender))
                        {
                            replyMessage = "이미 뉴스에 참가하고 있습니다."
                        }
                        else
                        {
                            news[news_num-1].participants.push(sender);

                            DataBase.removeDataBase("news");
                            DataBase.setDataBase("news",JSON.stringify(news));

                            replyMessage = news_num + "번 뉴스에 "+sender+"님이 참가하였습니다."
                        }
                    }
                    else
                    {
                        replyMessage = "형식을 확인하고 다시 입력해 주세요. /뉴스 참가 1"
                    }
                }
                else if(info[1] == "취소")
                {
                    var news_num = Number(msg.replace("/뉴스 취소 ",""));

                    if(info[2] != undefined && Number.isInteger(news_num))
                    {
                        if(news[news_num-1] == undefined)
                        {
                            replyMessage = "뉴스를 찾을 수 없습니다. 번호를 확인해주세요."
                        }
                        else
                        {
                            if(news[news_num-1].participants.includes(sender) && news[news_num-1].writer != sender)
                            {
                                for(var i = 0; i < news[news_num-1].participants.length; i++){ 
                                    if (news[news_num-1].participants[i] === sender) { 
                                        news[news_num-1].participants.splice(i, 1); 
                                        break;
                                    }
                                }
                                DataBase.removeDataBase("news");
                                DataBase.setDataBase("news",JSON.stringify(news));

                                replyMessage = news_num + "번 뉴스에 "+sender+"님이 참가 취소하셨습니다."
                                
                            }
                            else if(news[news_num-1].writer == sender)
                            {
                                replyMessage = "뉴스의 작성자는 참가를 취소할 수 없습니다."
                            }
                            else
                            {
                                replyMessage = "뉴스에 참가하고 있지 않습니다."
                            }
                        }
                    }
                    else
                    {
                        replyMessage = "형식을 확인하고 다시 입력해 주세요. /뉴스 취소 1"
                    }
                }
                else if(info[1] == "삭제")
                {
                    var news_num = Number(msg.replace("/뉴스 삭제 ",""));
                    if(info[2] != undefined && Number.isInteger(news_num))
                    {
                        if(news[news_num-1] == undefined)
                        {
                            replyMessage = "뉴스를 찾을 수 없습니다. 번호를 확인해주세요."
                        }
                        else if(news[news_num-1].writer == sender)
                        {
                            news.splice(news_num-1, 1); 

                            DataBase.removeDataBase("news");
                            DataBase.setDataBase("news",JSON.stringify(news));

                            replyMessage = news_num + "번 뉴스를 삭제했어요."
                        }
                        else
                        {
                            replyMessage = "뉴스의 작성자가 아니면 삭제할 수 없습니다."
                        }
                    }
                    else
                    {
                        replyMessage = "형식을 확인하고 다시 입력해 주세요. /뉴스 삭제 1"
                    }
                }
                else if(info[1] == "수정")
                {
                    var news_num = Number(info[2]);
                    var body = msg.replace("/뉴스 수정 " + info[2] + " ","");
                    if(info[2] != undefined && Number.isInteger(news_num) && info[4] != undefined)
                    {
                        if(news[news_num-1] == undefined)
                        {
                            replyMessage = "뉴스를 찾을 수 없습니다. 번호를 확인해주세요."
                        }
                        else if(news[news_num-1].writer == sender)
                        {
                            news[news_num-1].news = body;

                            DataBase.removeDataBase("news");
                            DataBase.setDataBase("news",JSON.stringify(news));

                            replyMessage = news_num + "번 뉴스를 수정했어요."
                        }
                        else
                        {
                            replyMessage = "뉴스의 작성자가 아니면 수정할 수 없습니다."
                        }
                    }
                    else
                    {
                        replyMessage = "형식을 확인하고 다시 입력해 주세요. /뉴스 수정 1 수정할 내용"
                    }
                }
                else if(info[1] == "초기화")
                {
                    news = []
                    DataBase.removeDataBase("news");
                    DataBase.setDataBase("news",JSON.stringify(news));
                }
            }
        }
        else if(msg.startsWith("/동그라미 탑")){
            replyMessage = "동그라미 탑 소개 🐷\n\n1군 💌 맹독 코포 클립 파닭\n2군 💌 말랑 몽뎅 승연 자몽 하둔";
        }
        else if(msg.startsWith("/동그라미 정글")){
            replyMessage = "동그라미 정글 소개 🐷\n\n1군 💌 다훈 던필 말랑 문어 미자 하기 하둔\n2군 💌 맹독 민지 으릉 재화 파닭";
        }
        else if(msg.startsWith("/동그라미 미드")){
            replyMessage = "동그라미 미드 소개 🐷\n\n1군 💌 말랑 이불 재화 현이\n2군 💌 루미 선영 코포";
        }
        else if(msg.startsWith("/동그라미 봇") || msg.startsWith("/동그라미 원딜")){
            replyMessage = "동그라미 봇 소개 🐷\n\n1군 💌 겸이 루미 승연 자몽 재화 클립 파닭 하둔 현이\n2군 💌 미자 쁘아 코포";
        }
        else if(msg.startsWith("/동그라미 서포터") || msg.startsWith("/동그라미 서폿")){
            replyMessage = "동그라미 서포터 소개 🐷\n\n1군 💌 겸이 루미 몽뎅 문어 민지 쁘아 선영 승연 으릉 이불 자몽 하기\n2군 💌 던필 재화 현이";
        }
        else if(msg.equals("/동그라미 솔랭"))
        {
            replyMessage = "💎 동그라미 개인 랭크 현황 💎\n\n";

            var tierType = "solo";

            replyMessage += ShowAllTier(tierType);
        }
        else if(msg.equals("/동그라미 자랭"))
        {
            replyMessage = "💎 동그라미 자유 랭크 현황 💎\n\n";

            var tierType = "team";

            replyMessage += ShowAllTier(tierType);
        }
        else if(msg.startsWith("/동그라미 생일"))
        {
            replyMessage = "🎉 동그라미 생일 🎉\n✨ 따뜻한 말 부탁해요 ✨\n\n01월 29일 - 하둔\n02월 28일 - 현이\n06월 10일 - 으릉 클립\n09월 29일 - 선영\n10월 06일 - 루미\n10월 29일 - 겸이\n10월 30일 - 맹독\n12월 23일 - 하기\n12월 25일 - 재화";
        }
        else if(msg.startsWith("/롤 ")){
            var result = lolTierInfo(msg.replace("/롤 ",""));
            replyMessage = result;
        }
        else if(msg.startsWith("/아이디변경"))  {
            var info = msg.split(' ');

            if(info.length == 3)
            {
                if(tierList[info[1]] != undefined)
                {

                    tierList[info[1]].id = info[2];

                    var json = getRiotId(info[2]);

                    if(!json.status)
                    {
                        var data = getRiotLeagueData(json.id);

                        var teamflag = false;
                        var soloflag = false;

                        for(var i=0;i<data.length;i++)
                        {
                            var tier = TierChanger(data[i].tier);
                            var rank = RankChanger(data[i].rank);

                            if(data[i].queueType == "RANKED_SOLO_5x5")
                            {
                                tierList[info[1]]["solo"].tier = tier;
                                tierList[info[1]]["solo"].rank = rank;
                                tierList[info[1]]["solo"].leaguepoint = data[i].leaguePoints;

                                soloflag = true;
                            }

                            if(data[i].queueType == "RANKED_FLEX_SR")
                            {
                                tierList[info[1]]["team"].tier = tier;
                                tierList[info[1]]["team"].rank = rank;
                                tierList[info[1]]["team"].leaguepoint = data[i].leaguePoints;

                                teamflag = true;
                            }                             
                        }

                        if(!soloflag)
                        {
                            tierList[info[1]]["solo"].tier = "랭크 없음";
                            tierList[info[1]]["solo"].rank = 0;
                            tierList[info[1]]["solo"].leaguepoint = 0;
                        }

                        if(!teamflag)
                        {
                            tierList[info[1]]["team"].tier = "랭크 없음";
                            tierList[info[1]]["team"].rank = 0;
                            tierList[info[1]]["team"].leaguepoint = 0;
                        }
                        
                        DataBase.removeDataBase("tierlist");
                        DataBase.setDataBase("tierlist",JSON.stringify(tierList));
                    }     
                }
            }
        }
        else if(msg == "/오늘의 운세")
        {
            try {
    
                let url = org.jsoup.Jsoup.connect("http://www.joongboo.com/news/articleList.html?sc_serial_code=SRN361&view_type=sm").get();

                var title_tag = url.select("#section-list > ul > li > div > h4 > a");

                var title = title_tag.toString().split("\n");

                var luck_url = "http://www.joongboo.com";

                var luck_date = [];

                for(var i=0;i<title.length;i++)
                {
                    Log.d(title[i].replace(/<[^>]+>/g,""));
                    if(title[i].replace(/<[^>]+>/g,"").startsWith("[오늘의 운세]"))
                    {
                        luck_url += title_tag.attr("href");

                        luck_date = title[i].replace(/<[^>]+>/g,"").replace("[오늘의 운세] ","").split(" ");
                        break;
                    }
                }

                var data = org.jsoup.Jsoup.connect(luck_url).get().select(".article-body > article > p");

                data = data.toString().replace(/&nbsp;/g,"");
                data = data.toString().replace(/<br>/g,"\n");
                data = data.toString().replace(/<p>/g,"\n");
                data = data.toString().replace(/<\/p>/g,"\n");
                data = data.toString().replace(/\n\n/g,"\n");

                replyMessage = luck_date[0] + " " + luck_date[1] + " " + luck_date[2] + " 자몽 운세 🦭\n"
                replyMessage += data;

    
            }catch(e)  {
                replyMessage = "지금 운세를 하트가 알 수 없어요. 😯";
            }
        }
        else if(msg == "/점수")
        {
            var jsonp = function(url)
            {
                var script = window.document.createElement('script');
                script.async = true;
                script.src = url;
                script.onerror = function()
                {
                    alert('Can not access JSONP file.')
                };
                var done = false;
                script.onload = script.onreadystatechange = function()
                {
                    if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete'))
                    {
                        done = true;
                        script.onload = script.onreadystatechange = null;
                        if (script.parentNode)
                        {
                            return script.parentNode.removeChild(script);
                        }
                    }
                };
                window.document.getElementsByTagName('head')[0].appendChild(script);
            };

            var query = function (sql, callback) {
                var url = 'https://spreadsheets.google.com/a/google.com/tq?',
                    params = {
                        key: '1HChfMTew04Quy0LuWRckUW9ovmto5uZQ0NAyKmGQKx0',
                        tq: encodeURIComponent(sql),
                        tqx: 'responseHandler:' + callback
                    },
                    qs = [];
                for (var key in params) {
                    qs.push(key + '=' + params[key]);
                }
                url += qs.join('&');
                return jsonp(url); // JSONP 도우미 호출
            }
            
            var my_callback = function (data) {
                data = parse(data); // 데이터 parse
                //불러온 데이터 조작
                for (var i = 0; i < datas.length; i++) {
                    if (JSON.stringify(datas[i]) == JSON.stringify(data)) {
                        return false;
                    }
                }
                datas.push(data);
            
                // HTML 헤더의 값을 추출
                var col = [];
                for (var i = 0; i < data.length; i++) {
                    for (var key in data[i]) {
                        if (col.indexOf(key) === -1) {
                            col.push(key);
                        }
                    }
                }
                // 받아 온 데이터 커스텀 
                var table = document.querySelector("#tagTable table");
                if (table === null || table == undefined) {
                    // 동적 테이블 생성
                    table = document.createElement("table");
            
                    // HTML 테이블 헤더 생성
                    var tr = table.insertRow(-1);
                    for (var i = 0; i < col.length; i++) {
                        var th = document.createElement("th");
                        th.innerHTML = col[i];
                        tr.appendChild(th);
                    }
                    // HTML 테이블 ROW 생성
                    for (var i = 1; i < data.length; i++) {
                        tr = table.insertRow(-1);
                        for (var j = 0; j < col.length; j++) {
                            var text = data[i][col[j]];
                            var tabCell = tr.insertCell(-1);
                            tabCell.innerHTML = data[i][col[j]];
                            var text = data[i][col[j]];
                            //tabCell.click
                            tabCell.innerHTML = '<span class="select-data input-tag" data-tag="' + text + '">' + text + '</span>';
                            tabCell.setAttribute("onclick","setDataToTag('" + text + "');");
                            //tabCell.innerHTML = '<span class="select-data input-tag" data-tag="' + text + '" onclick="setDataToTag(\'' + text +'\')">' + text + '</span>';
                        }
                    }
                    // 마지막으로 JSON 데이터로 새로 만든 테이블을 컨테이너에 추가
                    var divContainer = document.getElementById("tagTable");
                    divContainer.innerHTML = "";
                    divContainer.appendChild(table);
                    $("#tagTable tr td").each(function(i, elem) {
                        if($(this).find(".select-data").text() != "") {
                            $(this).addClass("select-tag");
                        }
                    });
                } else {
                    // 테이블 행 동적 추가
                    for (var i = 1; i < data.length; i++) {
                        var tr = table.insertRow();
                        for (var j = 0; j < col.length; j++) {
                            var tabCell = tr.insertCell(-1);
                            tabCell.innerHTML = data[i][col[j]];
                        }
                    }
                }
            
            }
            query('select *', 'my_callback');
        }
        else if(msg.startsWith("/전적"))
        {
            try
            {
                var nickname = msg.replace("/전적 ","");
                if(nickname.length == 2)
                {
                    nickname = nickname[0] + " " + nickname[1];
                }

                var idData = getRiotId(nickname);
                
                if(!idData.status)
                {
                    nickname = idData.name;
                    var puuid = idData.puuid;

                    replyMessage = "최근 [ " + nickname + " ] 님의 게임 전적입니다.\n\n";
                    
                    var matchId = getRiotMatchId(puuid);

                    var matchResult = ""

                    var winCnt = 0;

                    for(var i=0;i<matchId.length;i++)
                    {
                        var matchData = getRiotMatchData(matchId[i]);

                        for(var j=0;j<matchData.info.participants.length;j++)
                        {
                            if(puuid == matchData.info.participants[j].puuid)
                            {
                                matchResult += gameType[matchData.info.queueId] + " : " + championData[matchData.info.participants[j].championName] + " (" + matchData.info.participants[j].kills + "/" + matchData.info.participants[j].deaths + "/" + matchData.info.participants[j].assists + ") ";

                                if(matchData.info.participants[j].win)
                                {
                                    matchResult += "❤ 승리";
                                    winCnt++;
                                }
                                else
                                    matchResult += "💔 패배";
                                break;
                            }
                        }
                        if(i != matchId.length-1)
                            matchResult += "\n";
                    }

                    replyMessage += winCnt + "승 " + (10-winCnt) + "패 승률 " + winCnt/10 * 100 + "%\n\n"
                    replyMessage += matchResult;
                }
                else
                {
                    replyMessage = "존재하지 않는 소환사명이래요. 오타를 확인한 후 다시 검색해 주세요. 😥"
                }
            }
            catch(e)
            {
                replyMessage = "Riot에서 정보를 전달해 주지 않았습니다. 조금 있다가 다시 시도해 주세요. 😥"
            }
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
        else if(msg.startsWith("/하트 수금")){
            replyMessage = "하트 용돈 좀 주세요. 🤑";
        }
        else if(msg.startsWith("/현이 출근")){
            replyMessage = "엄마는 8시 30분에 출근해요. 💦";
        }
        else if(msg.startsWith("/현이 퇴근")){
            replyMessage = "엄마는 17시 30분에 퇴근해요. 💖";
        }
        

        
    
        // To save database
        // else if(msg.equals("/save"))
        // {
        //     DataBase.setDataBase("tierList",JSON.stringify(saveTier));
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