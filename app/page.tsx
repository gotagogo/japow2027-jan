"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const assetPath = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

type Stop = { kind: "ski" | "onsen" | "hotel" | "meet" | "free"; name: string; en?: string; note: string; map?: string; trail?: string };
type Day = { date: string; weekday: string; title: string; travel?: string; returnTravel?: string; stops: Stop[] };
type Extra = { tags: string[]; feature: string; price?: string; hours?: string; warning?: string; source?: string };

const days: Day[] = [
  { date: "01/08", weekday: "五", title: "盛岡集合", stops: [{ kind: "meet", name: "盛岡集合日", note: "於盛岡 JR 站彈性會合，領車、採買與行程說明。" }, { kind: "hotel", name: "Route Inn 盛岡駅前", note: "第一晚住宿｜單人房・含早餐", map: "https://maps.app.goo.gl/VfEEzwujRahoVRyn9" }] },
  { date: "01/09", weekday: "六", title: "雫石", travel: "40 MIN", returnTravel: "40 MIN", stops: [{ kind: "ski", name: "雫石", en: "Shizukuishi", note: "開滑第一站｜長距離巡航與岩手山雪景", map: "https://maps.app.goo.gl/SRPYvJaQZK52uTb58", trail: "/assets/trail-maps/01-Shizukuishi-trail-map-2025-26.pdf" }, { kind: "hotel", name: "Route Inn 盛岡矢巾", note: "住宿｜單人房・含早餐", map: "https://maps.app.goo.gl/2kZYnP1QJ93eneY28" }] },
  { date: "01/10", weekday: "日", title: "岩手高原", travel: "40 MIN", returnTravel: "40 MIN", stops: [{ kind: "ski", name: "岩手高原", en: "Iwate Kogen", note: "寬闊雪道，適合暖身練功與拍攝", map: "https://maps.app.goo.gl/a5tiwRzrK5g7dJT59", trail: "/assets/trail-maps/02-Iwate-Kogen-trail-map.jpg" }, { kind: "hotel", name: "Route Inn 盛岡矢巾", note: "連泊｜單人房・含早餐", map: "https://maps.app.goo.gl/2kZYnP1QJ93eneY28" }] },
  { date: "01/11", weekday: "一", title: "夏油高原", travel: "60 MIN", returnTravel: "60 MIN", stops: [{ kind: "ski", name: "夏油高原", en: "Geto Kogen", note: "豪雪粉雪日｜樹林地形與充足降雪", map: "https://maps.app.goo.gl/Zrfbn8oVVigxvcMw7", trail: "/assets/trail-maps/03-Geto-Kogen-trail-map.jpg" }, { kind: "hotel", name: "Route Inn 盛岡矢巾", note: "連泊｜單人房・含早餐", map: "https://maps.app.goo.gl/2kZYnP1QJ93eneY28" }] },
  { date: "01/12", weekday: "二", title: "安比高原", travel: "70 MIN", returnTravel: "45 MIN", stops: [{ kind: "ski", name: "安比高原", en: "Appi Kogen", note: "東北代表級雪場｜長雪道與高品質壓雪", map: "https://maps.app.goo.gl/S4ZjZ5yLY8hKCHLJ9", trail: "/assets/trail-maps/04-Appi-Kogen-trail-map-2025-26.jpg" }, { kind: "hotel", name: "Route Inn 盛岡矢巾", note: "連泊｜單人房・含早餐", map: "https://maps.app.goo.gl/2kZYnP1QJ93eneY28" }] },
  { date: "01/13", weekday: "三", title: "奧中山", travel: "60 MIN", returnTravel: "90 MIN", stops: [{ kind: "ski", name: "奧中山高原", en: "Okunakayama Kogen", note: "在地小而美雪場｜探索新雪場", map: "https://maps.app.goo.gl/5GoY8JrHRP6ZqJEa7", trail: "/assets/trail-maps/05-Okunakayama-Kogen-trail-map.png" }, { kind: "hotel", name: "Route Inn 大館駅南", note: "移動至秋田大館住宿", map: "https://maps.app.goo.gl/5e5CKrJfSsH6jKqg9" }] },
  { date: "01/14", weekday: "四", title: "森吉山阿仁", travel: "70 MIN", returnTravel: "70 MIN", stops: [{ kind: "ski", name: "森吉山阿仁", en: "Mt. Moriyoshi Ani", note: "樹冰與粉雪｜本次重點打卡雪場", map: "https://maps.app.goo.gl/6Jgr1LyJgcXfMMhU8", trail: "/assets/trail-maps/06-Mt-Moriyoshi-Ani-trail-map.jpg" }, { kind: "hotel", name: "Route Inn 大館駅南", note: "連泊｜單人房・含早餐", map: "https://maps.app.goo.gl/5e5CKrJfSsH6jKqg9" }] },
  { date: "01/15", weekday: "五", title: "青森泉", travel: "80 MIN", returnTravel: "40 MIN", stops: [{ kind: "ski", name: "青森泉", en: "Aomori Spring", note: "岩木山景觀與單板地形｜滑後前往弘前", map: "https://maps.app.goo.gl/EJukhsfGHnwXVX1XA", trail: "/assets/trail-maps/07-Aomori-Spring-trail-map.pdf" }, { kind: "hotel", name: "Route Inn 弘前城東", note: "弘前住宿｜單人房・含早餐", map: "https://maps.app.goo.gl/73DYtyEkoWgHv8NW9" }] },
  { date: "01/16", weekday: "六", title: "八甲田", travel: "50 MIN", returnTravel: "50 MIN", stops: [{ kind: "ski", name: "八甲田", en: "Hakkoda", note: "纜車山岳滑行｜依天候與能見度彈性調整", map: "https://maps.app.goo.gl/msRPuALqiPZnCckH6", trail: "/assets/trail-maps/08-Hakkoda-official-course-map.png" }, { kind: "hotel", name: "Route Inn 弘前城東", note: "連泊｜單人房・含早餐", map: "https://maps.app.goo.gl/73DYtyEkoWgHv8NW9" }] },
  { date: "01/17", weekday: "日", title: "大鰐溫泉", travel: "20 MIN", returnTravel: "45 MIN", stops: [{ kind: "ski", name: "大鰐溫泉", en: "Owani Onsen", note: "滑雪＋泡湯日｜在地雪場與溫泉鄉", map: "https://maps.app.goo.gl/J28Lhd3f7tMH9GpU7", trail: "/assets/trail-maps/09-Owani-Onsen-trail-map.pdf" }, { kind: "hotel", name: "Route Inn 大館大町", note: "返回大館住宿｜單人房・含早餐", map: "https://maps.app.goo.gl/MXBNf6E8bYQjc7Go7" }] },
  { date: "01/18", weekday: "一", title: "田澤湖", travel: "70 MIN", returnTravel: "70 MIN", stops: [{ kind: "ski", name: "田澤湖", en: "Tazawako", note: "湖景雪場｜由秋田南下返回盛岡基地", map: "https://maps.app.goo.gl/YfeyVwvNpsA6Jmnf7", trail: "/assets/trail-maps/10-Tazawako-trail-map.jpg" }, { kind: "hotel", name: "Route Inn 盛岡南", note: "盛岡南基地｜單人房・含早餐", map: "https://maps.app.goo.gl/956eWcJRhwKBHyzn6" }] },
  { date: "01/19", weekday: "二", title: "網張溫泉", travel: "45 MIN", returnTravel: "45 MIN", stops: [{ kind: "ski", name: "網張溫泉", en: "Amihari Onsen", note: "秘湯系雪場｜滑後安排日歸溫泉", map: "https://maps.app.goo.gl/3FiUWjm5ytku532D7", trail: "/assets/trail-maps/11-Amihari-Onsen-trail-map.webp" }, { kind: "hotel", name: "Route Inn 盛岡南", note: "連泊｜單人房・含早餐", map: "https://maps.app.goo.gl/956eWcJRhwKBHyzn6" }] },
  { date: "01/20", weekday: "三", title: "八幡平下倉", travel: "45 MIN", returnTravel: "45 MIN", stops: [{ kind: "ski", name: "八幡平下倉", en: "Hachimantai Shimokura", note: "林間粉雪與地形變化｜練功日", map: "https://maps.app.goo.gl/qjAQT4pPaWXrMd4YA", trail: "/assets/trail-maps/12-Hachimantai-Shimokura-trail-map.png" }, { kind: "hotel", name: "Route Inn 盛岡南", note: "連泊｜單人房・含早餐", map: "https://maps.app.goo.gl/956eWcJRhwKBHyzn6" }] },
  { date: "01/21", weekday: "四", title: "八幡平", travel: "40 MIN", returnTravel: "40 MIN", stops: [{ kind: "ski", name: "八幡平 Panorama", en: "Hachimantai Panorama", note: "第 13 雪場｜輕鬆巡航與旅程收官", map: "https://maps.app.goo.gl/LGM7xdjZV9QKMEa28", trail: "/assets/trail-maps/13-Hachimantai-Panorama-trail-map.jpg" }, { kind: "hotel", name: "Route Inn 盛岡南", note: "最後一晚｜單人房・含早餐", map: "https://maps.app.goo.gl/956eWcJRhwKBHyzn6" }] },
  { date: "01/22", weekday: "五", title: "盛岡解散", stops: [{ kind: "free", name: "旅程解散日", note: "早餐後於盛岡彈性解散，可銜接 JR 新幹線或後續行程。" }] },
];

const onsens: Record<string, Stop> = {
  "01/09": { kind: "onsen", name: "雫石高倉溫泉", note: "滑雪後日歸泡湯｜舒緩開滑第一天的疲勞", map: "https://maps.app.goo.gl/pmiaCkBReHRwpLZcA" },
  "01/10": { kind: "onsen", name: "ありね山荘", note: "滑雪後日歸泡湯｜岩手山麓溫泉時光", map: "https://maps.app.goo.gl/E61WqS8rNCp3srPQ9" },
  "01/11": { kind: "onsen", name: "兎森之湯", note: "滑雪後日歸泡湯｜夏油高原雪場內溫泉", map: "https://maps.app.goo.gl/Y3hvvjQcVXvHXBDF8" },
  "01/12": { kind: "onsen", name: "白樺之湯", note: "滑雪後日歸泡湯｜安比高原附近放鬆", map: "https://maps.app.goo.gl/qtzPLFpxAq53c93r6" },
  "01/13": { kind: "onsen", name: "朝朱之湯", note: "滑雪後日歸泡湯｜移動至大館前暖身休息", map: "https://maps.app.goo.gl/wbrxaRgshH5Pb5Qv8" },
  "01/14": { kind: "onsen", name: "大館矢立 Heights", note: "滑雪後日歸泡湯｜返回大館住宿前安排", map: "https://maps.app.goo.gl/aZhPsndToeBZ6KJKA" },
  "01/15": { kind: "onsen", name: "アソベの森 いわき荘", note: "滑雪後日歸泡湯｜岩木山麓溫泉", map: "https://maps.app.goo.gl/dTsgDN4FvrGusMDG7" },
  "01/16": { kind: "onsen", name: "酸湯溫泉", note: "滑雪後日歸泡湯｜八甲田名湯體驗", map: "https://maps.app.goo.gl/URSisFLsnTL3AKLp9" },
  "01/17": { kind: "onsen", name: "鰐come", note: "滑雪後日歸泡湯｜大鰐溫泉鄉休息站", map: "https://maps.app.goo.gl/wi6uAv7oiqRqfRdc7" },
  "01/18": { kind: "onsen", name: "乳頭温泉郷 鶴の湯", note: "滑雪後日歸泡湯｜經典秘湯打卡安排", map: "https://maps.app.goo.gl/UMexbCmwxjZ7QpUe9" },
  "01/19": { kind: "onsen", name: "藥師之湯", note: "滑雪後日歸泡湯｜網張溫泉區放鬆", map: "https://maps.app.goo.gl/MS9iTBiw85g7vEHR7" },
  "01/20": { kind: "onsen", name: "八幡平溫泉館 森乃湯", note: "滑雪後日歸泡湯｜距下倉雪場約 3 分鐘", map: "https://www.google.com/maps/search/?api=1&query=%E5%85%AB%E5%B9%A1%E5%B9%B3%E6%B8%A9%E6%B3%89%E9%A4%A8%E6%A3%AE%E4%B9%83%E6%B9%AF" },
  "01/21": { kind: "onsen", name: "松川溫泉", note: "旅程最後一晚日歸泡湯｜八幡平山區秘湯", map: "https://maps.app.goo.gl/LbDSRVW9bR97VnDS9" },
};

const skiDetails: Record<string, Extra> = {
  "雫石": { tags: ["林間雪道", "Easy Park", "壓雪巡航"], feature: "世界盃下坡賽道、長距離林間路線；晴天可正面眺望岩手山。Park 適合初中階練習。" },
  "岩手高原": { tags: ["林間感", "Park視雪況", "寬闊壓雪"], feature: "纜車直達山頂，約 2.6 km 長距離巡航；寬坡好練功，部分路段穿行樹林，Park 依季節雪況設置。" },
  "夏油高原": { tags: ["官方樹林區", "Snow Park", "豪雪粉雪"], feature: "日本屈指豪雪量，設有多個官方 Tree Run Area；粉雪、自然地形與樹林探索是最大賣點。" },
  "安比高原": { tags: ["Tree Run Zone", "Snow Park", "長距離壓雪"], feature: "東北代表級大型雪場；長而均勻的壓雪道、樹林開放區與 Park 兼備，山頂視野開闊。" },
  "奧中山高原": { tags: ["林間雪道", "Park不固定", "在地小雪場"], feature: "坡度變化直接、排隊通常較少，適合反覆練功；樹林環繞，Park 設施依當季公布。" },
  "森吉山阿仁": { tags: ["樹林景觀", "無常設Park", "樹冰"], feature: "以森吉山樹冰、山頂粉雪與遼闊山景著名；重點是自然雪與景觀，不是 Park 型雪場。" },
  "青森泉": { tags: ["Tree Run", "大型Park", "岩木山"], feature: "單板氣氛濃厚，地形 Park 規模出色；可在岩木山北坡滑行並眺望日本海與津輕平原。" },
  "八甲田": { tags: ["山岳樹林", "無Park", "樹冰・Backcountry"], feature: "纜車山岳滑行、樹冰與深粉雪聞名；非一般整備雪場，路線、天候、能見度與同行能力判斷尤其重要。" },
  "大鰐溫泉": { tags: ["林間雪道", "Park視雪況", "津輕平原"], feature: "歷史悠久的在地雪場，長距離雪道從山頂一路俯瞰津輕平原；適合輕鬆巡航。" },
  "田澤湖": { tags: ["樹林地形", "Park視季節", "田澤湖景"], feature: "最大特色是俯瞰藍色田澤湖；寬坡、自然起伏與林間感兼備，晴天極適合拍照。" },
  "網張溫泉": { tags: ["林間雪道", "無大型Park", "岩手山"], feature: "老派山岳雪場氛圍，雪道穿梭岩手山森林；自然雪、地形變化與秘湯感勝過 Park 設施。" },
  "八幡平下倉": { tags: ["粉雪樹林", "無大型Park", "自然地形"], feature: "以乾爽粉雪、林間地形及較陡雪道見長；適合喜歡自然地形與安靜雪場的中高階單板客。" },
  "八幡平 Panorama": { tags: ["寬闊雪道", "Park不固定", "岩手山景"], feature: "寬闊柔和的壓雪坡最適合基本功、刻滑與團體巡航；天氣好可欣賞八幡平與岩手山景。" },
};

const onsenDetails: Record<string, Extra> = {
  "雫石高倉溫泉": { tags: ["屋頂露天", "雪見風呂", "硫黃・鹽化物泉"], feature: "露天池畔可看雪景，滑完雪不用長距離繞路。", price: "成人 ¥1,000", hours: "日歸受付 14:00–22:00", source: "https://www.princehotels.co.jp/shizukuishi/facility/onsen/" },
  "ありね山荘": { tags: ["山景露天", "天然溫泉", "安靜"], feature: "面向雫石山區的日歸溫泉，適合岩手高原滑後放鬆。", price: "成人約 ¥600（需確認）", hours: "冬季時間請出發前確認", warning: "2027 價格與冬季營業時間尚未公布。" },
  "兎森之湯": { tags: ["展望露天", "雪場內", "滑後最方便"], feature: "位於夏油高原雪場設施內，露天風呂可直接延續雪山氣氛。", price: "成人約 ¥900", hours: "冬季依雪場營業公告", source: "https://www.getokogen.com/" },
  "白樺之湯": { tags: ["大型露天", "白樺林", "弱鹼性單純泉"], feature: "大型露天風呂被白樺林包圍，容量大，適合多人滑後集合。", price: "成人 ¥1,200", hours: "平日約 13:00–22:00／週末至23:00", source: "https://www.appi.co.jp/experience/onsen/shirakaba-no-yu/" },
  "朝朱之湯": { tags: ["露天風呂", "桑拿", "雪場附近"], feature: "奧中山高原的在地溫泉，可看開闊雪景，設施完整。", price: "成人 ¥600", hours: "營業時間依當季公告", source: "https://www.okunakayamakogen.jp/hotspring/" },
  "大館矢立 Heights": { tags: ["源泉掛流", "金色溫泉", "手作露天"], feature: "天然金色湯，男女湯每日交換；位於縣界公路沿線，適合返大館途中。", price: "成人 ¥500", hours: "7:00–21:00（最終受付20:00）", source: "https://ohdate-yatate.com/pages/22/" },
  "アソベの森 いわき荘": { tags: ["青森檜木浴場", "岩石露天", "源泉掛流"], feature: "青森檜香氣的大浴場、天然岩露天與桑拿，質感較精緻。", price: "成人 ¥700", hours: "晚間 18:00–21:00（最終受付20:00）", source: "https://www.iwakisou.or.jp/info/news/24/" },
  "酸湯溫泉": { tags: ["千人檜木浴場", "強酸性硫黃泉", "青森名湯"], feature: "160 畳的混浴『ヒバ千人風呂』極具代表性，另有男女分開的玉之湯。", price: "成人 ¥1,500（毛巾附）", hours: "2026/12起 9:00–16:00（最終受付15:30）", warning: "必須提早結束八甲田滑行；千人風呂為混浴，可租湯浴衣。", source: "https://sukayu.jp/information2/" },
  "鰐come": { tags: ["露天風呂", "桑拿", "車站步行2分"], feature: "兩套木與石主題浴場每日交換，另有露天、桑拿與在地食堂。", price: "成人 ¥550", hours: "9:00–22:00", source: "https://www.wanicome.com/" },
  "乳頭温泉郷 鶴の湯": { tags: ["乳白露天", "秘湯", "茅葺本陣"], feature: "乳頭溫泉鄉最具代表性的秘湯，乳白色混浴露天與雪中茅葺建築極適合打卡。", price: "成人 ¥700", hours: "日歸 10:00–15:00", warning: "無法在正常滑完整天後前往；需午前滑雪、提早離場或改成其他晚間溫泉。", source: "https://www.hitou.or.jp/provider/detail?providerId=598" },
  "藥師之湯": { tags: ["硫黃泉", "內湯", "冬季露天可能休止"], feature: "網張溫泉發祥地附近的日歸設施，有休息大廣間；冬季露天常因水溫不足停用。", price: "成人 ¥700", hours: "平日至17:00／週末至18:00", warning: "滑雪後時間較緊，建議預留收板及換裝時間。", source: "https://www.qkamura.or.jp/iwate/oneday/" },
  "八幡平溫泉館 森乃湯": { tags: ["露天風呂", "桑拿", "單純硫黃泉"], feature: "距下倉雪場約 3 分鐘，設有露天、寢湯、水風呂與桑拿，滑後前往十分順路。", price: "成人 ¥600", hours: "10:00–20:00（最終受付19:00）", warning: "固定休館為每月第三個星期五；2027/1/20 為星期三，仍請出發前確認臨時休館。", source: "https://www.hachimantai-ss.co.jp/morinoyu/" },
  "松川溫泉": { tags: ["乳白硫黃泉", "露天風呂", "秘湯"], feature: "以乳白色硫黃泉、森林露天與地熱溫泉鄉氣氛聞名。已由休館的 1/20 移至 1/21。", price: "成人 ¥700", hours: "8:30–19:00（最終受付18:00）", warning: "官方休館表未列 2027/1/21，但山區設施仍建議出發前確認。", source: "https://www.kyounso.jp/sp/higaeri.html" },
};

const kindLabel = { ski: "SNOWBOARD", onsen: "DAY ONSEN", hotel: "STAY", meet: "MEET", free: "FREE" };

const namesEn: Record<string, string> = {
  "雫石":"Shizukuishi", "岩手高原":"Iwate Kogen", "夏油高原":"Geto Kogen", "安比高原":"Appi Kogen", "奧中山高原":"Okunakayama Kogen", "森吉山阿仁":"Mt. Moriyoshi Ani", "青森泉":"Aomori Spring", "八甲田":"Hakkoda", "大鰐溫泉":"Owani Onsen", "田澤湖":"Tazawako", "網張溫泉":"Amihari Onsen", "八幡平下倉":"Hachimantai Shimokura", "八幡平 Panorama":"Hachimantai Panorama",
  "雫石高倉溫泉":"Shizukuishi Takakura Onsen", "ありね山荘":"Arine Sanso", "兎森之湯":"Usagimori-no-Yu", "白樺之湯":"Shirakaba-no-Yu", "朝朱之湯":"Asaake-no-Yu", "大館矢立 Heights":"Odate Yatate Heights", "アソベの森 いわき荘":"Asobe-no-Mori Iwakiso", "酸湯溫泉":"Sukayu Onsen", "鰐come":"Wani Come", "乳頭温泉郷 鶴の湯":"Nyuto Onsen Tsurunoyu", "藥師之湯":"Yakushi-no-Yu", "八幡平溫泉館 森乃湯":"Hachimantai Onsenkan Mori-no-Yu", "松川溫泉":"Matsukawa Onsen",
  "Route Inn 盛岡駅前":"Route Inn Morioka Ekimae", "Route Inn 盛岡矢巾":"Route Inn Morioka Yahaba", "Route Inn 大館駅南":"Route Inn Odate Eki Minami", "Route Inn 弘前城東":"Route Inn Hirosaki Joto", "Route Inn 大館大町":"Route Inn Odate Omachi", "Route Inn 盛岡南":"Route Inn Morioka Minami", "盛岡集合日":"Meet in Morioka", "旅程解散日":"Departure from Morioka"
};

const dayTitlesEn: Record<string,string> = {"01/08":"Meet in Morioka","01/09":"Shizukuishi","01/10":"Iwate Kogen","01/11":"Geto Kogen","01/12":"Appi Kogen","01/13":"Okunakayama","01/14":"Mt. Moriyoshi Ani","01/15":"Aomori Spring","01/16":"Hakkoda","01/17":"Owani Onsen","01/18":"Tazawako","01/19":"Amihari Onsen","01/20":"Hachimantai Shimokura","01/21":"Hachimantai Panorama","01/22":"Trip ends in Morioka"};

const featureEn: Record<string,string> = {
  "雫石":"World Cup downhill heritage, long tree-lined runs and an Easy Park, with superb views of Mt. Iwate on clear days.", "岩手高原":"A gondola-served 2.6 km cruise with broad groomers for progression; tree-lined sections and a seasonal park.", "夏油高原":"Famous for huge snowfall, deep powder and multiple official tree-run areas; one of the trip's top freeride days.", "安比高原":"A major Tohoku resort combining long immaculate groomers, tree-run zones and a snow park with expansive summit views.", "奧中山高原":"A quiet local hill with direct pitch changes and short lift lines—excellent for repeating drills; park setup varies by season.", "森吉山阿仁":"Best known for snow monsters, summit powder and vast mountain scenery; natural snow and views take priority over park riding.", "青森泉":"Strong snowboard culture, quality terrain parks and tree riding on Mt. Iwaki, overlooking the Sea of Japan and Tsugaru Plain.", "八甲田":"Ropeway-accessed alpine tree riding, snow monsters and deep powder. Weather, visibility, route-finding and group ability are critical.", "大鰐溫泉":"A historic local resort with a long descent and views across the Tsugaru Plain; ideal for a relaxed cruising day.", "田澤湖":"Its signature view is brilliant-blue Lake Tazawa; wide pistes, natural rolls and forest scenery make it highly photogenic.", "網張溫泉":"Old-school mountain atmosphere with runs through Mt. Iwate forest; valued for natural snow and terrain rather than a large park.", "八幡平下倉":"Dry powder, forest terrain and steeper pistes make this a rewarding natural-terrain day for intermediate and advanced riders.", "八幡平 Panorama":"Wide, gentle groomers suit carving, fundamentals and group cruising, with open views of Hachimantai and Mt. Iwate.",
  "雫石高倉溫泉":"A covered open-air bath beside a snowy pond—easy to reach directly after skiing.", "ありね山荘":"A peaceful day spa facing the Shizukuishi mountains, convenient after Iwate Kogen.", "兎森之湯":"Located inside Geto Kogen, with a panoramic outdoor bath and minimal post-ski detour.", "白樺之湯":"A large outdoor bathing complex surrounded by birch forest, well suited to groups.", "朝朱之湯":"A full-featured local spa near the ski area, with outdoor bathing and sauna facilities.", "大館矢立 Heights":"Naturally flowing golden water and handmade outdoor baths that rotate between men and women.", "アソベの森 いわき荘":"A refined Aomori-hiba wood bath, natural rock outdoor bath and sauna at the foot of Mt. Iwaki.", "酸湯溫泉":"A legendary Aomori hot spring centred on the vast mixed-gender Hiba Sennin Bath, plus a gender-separated bath.", "鰐come":"Two wood-and-stone bath zones rotate daily, with outdoor baths, sauna and a local-food restaurant.", "乳頭温泉郷 鶴の湯":"Iconic milky water, a mixed outdoor bath and snow-covered thatched buildings create a classic secret-onsen scene.", "藥師之湯":"A sulphur day spa near the birthplace of Amihari Onsen; the outdoor bath may close in winter.", "八幡平溫泉館 森乃湯":"Only about three minutes from Shimokura, with outdoor bathing, reclining bath, cold bath and sauna.", "松川溫泉":"Known for milky sulphur water and forest outdoor baths; moved to Jan 21 because Jan 20 is closed."
};

const tagEn: Record<string,string> = {"林間雪道":"Tree-lined","Easy Park":"Easy Park","壓雪巡航":"Groomers","林間感":"Forest","Park視雪況":"Seasonal park","寬闊壓雪":"Wide groomers","官方樹林區":"Tree runs","Snow Park":"Snow park","豪雪粉雪":"Deep powder","Tree Run Zone":"Tree runs","長距離壓雪":"Long groomers","Park不固定":"Seasonal park","在地小雪場":"Local hill","樹林景觀":"Forest views","無常設Park":"No fixed park","樹冰":"Snow monsters","Tree Run":"Tree runs","大型Park":"Large park","岩木山":"Mt. Iwaki","山岳樹林":"Alpine trees","無Park":"No park","樹冰・Backcountry":"Snow monsters","津輕平原":"Tsugaru view","樹林地形":"Forest terrain","Park視季節":"Seasonal park","田澤湖景":"Lake Tazawa","無大型Park":"No large park","岩手山":"Mt. Iwate","粉雪樹林":"Powder trees","自然地形":"Natural terrain","寬闊雪道":"Wide pistes","岩手山景":"Mt. Iwate view","屋頂露天":"Covered outdoor","雪見風呂":"Snow-view bath","硫黃・鹽化物泉":"Sulphur chloride","山景露天":"Mountain bath","天然溫泉":"Natural onsen","安靜":"Quiet","展望露天":"Panoramic bath","雪場內":"On-site","滑後最方便":"Easy access","大型露天":"Large outdoor","白樺林":"Birch forest","弱鹼性單純泉":"Mild alkaline","露天風呂":"Outdoor bath","桑拿":"Sauna","雪場附近":"Near resort","源泉掛流":"Free-flowing","金色溫泉":"Golden water","手作露天":"Handmade bath","青森檜木浴場":"Aomori hiba","岩石露天":"Rock outdoor","千人檜木浴場":"Sennin bath","強酸性硫黃泉":"Acid sulphur","青森名湯":"Aomori icon","車站步行2分":"2 min from station","乳白露天":"Milky outdoor","秘湯":"Secret onsen","茅葺本陣":"Thatched heritage","硫黃泉":"Sulphur","內湯":"Indoor bath","冬季露天可能休止":"Outdoor may close","乳白硫黃泉":"Milky sulphur"};

export default function Home() {
  const [active, setActive] = useState(0);
  const [lang, setLang] = useState<"zh" | "en">("zh");
  const [info, setInfo] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const strip = useRef<HTMLDivElement>(null);
  const day = days[active];
  const dailyOnsen = onsens[day.date];
  const dailyStops = dailyOnsen
    ? day.stops.flatMap(stop => stop.kind === "ski" ? [stop, dailyOnsen] : [stop])
    : day.stops;
  const skiCount = useMemo(() => days.flatMap(d => d.stops).filter(s => s.kind === "ski").length, []);
  const en = lang === "en";

  useEffect(() => {
    strip.current?.querySelector(`[data-day="${active}"]`)?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active]);

  return (
    <main className="site-shell">
      <header className="hero">
        <img src={assetPath("/assets/tohoku-hero.png")} alt="東北雪國單板自駕旅行" />
        <div className="hero-shade" />
        <div className="hero-copy">
          <span className="eyebrow">2027 JAN · TOHOKU</span>
          <h1>{en ? <>TOHOKU SNOW<br />& ONSEN TRIP</> : <>東北滑雪<br />泡湯打卡遊</>}</h1>
          <p>{en ? "Morioka ⇄ Aomori · 13 resorts · 14 nights" : "盛岡 ⇄ 青森 · 13 雪場 · 14 晚"}</p>
        </div>
        <div className="hero-actions">
          <button className="lang-toggle" onClick={() => setLang(en ? "zh" : "en")} aria-label={en ? "切換中文" : "Switch to English"}>{en ? "中" : "EN"}</button>
          <button onClick={() => setMapOpen(true)} aria-label="查看旅程地圖">⌖</button>
          <button onClick={() => setInfo(true)} aria-label="查看旅程資訊">i</button>
        </div>
      </header>

      <section className="content-card">
        <div className="date-strip" ref={strip}>
          {days.map((d, i) => (
            <button data-day={i} key={d.date} className={i === active ? "active" : ""} onClick={() => setActive(i)}>
              <small>DAY {i + 1}</small><strong>{d.date}</strong><span>{en ? ["Fri","Sat","Sun","Mon","Tue","Wed","Thu"][i % 7] : `週${d.weekday}`}</span>
            </button>
          ))}
        </div>

        <div className="day-heading">
          <div><span>DAY {active + 1}</span><h2>{en ? dayTitlesEn[day.date] : day.title}</h2></div>
          <b>{day.date}</b>
        </div>

        {day.travel && <Travel time={day.travel} label="出發" />}
        <div className="timeline">
          {dailyStops.map((stop, index) => {
            const extra = stop.kind === "ski" ? skiDetails[stop.name] : stop.kind === "onsen" ? onsenDetails[stop.name] : undefined;
            return (
            <div key={`${stop.name}-${index}`}>
              <article className={`stop-card ${stop.kind}`}>
                <div className="stop-top"><span>{kindLabel[stop.kind]}</span><i>{stop.kind === "ski" ? "◆" : stop.kind === "onsen" ? "♨" : stop.kind === "hotel" ? "⌂" : "●"}</i></div>
                <h3>{en ? (namesEn[stop.name] || stop.name) : stop.name}</h3>
                {!en && stop.en && <h4>{stop.en}</h4>}
                <p>{en ? (stop.kind === "ski" ? "Snowboard day · terrain, scenery and progression" : stop.kind === "onsen" ? "Post-ski day onsen before checking in" : stop.kind === "hotel" ? "Single room · breakfast included" : stop.kind === "meet" ? "Meet at Morioka Station, collect the car and prepare for the trip." : "Breakfast, then flexible departure from Morioka.") : stop.note}</p>
                {extra && <div className="extra-info">
                  <div className="tags">{extra.tags.map(tag => <span key={tag}>{en ? (tagEn[tag] || tag) : tag}</span>)}</div>
                  <p className="feature">{en ? (featureEn[stop.name] || extra.feature) : extra.feature}</p>
                  {(extra.price || extra.hours) && <div className="facts">
                    {extra.price && <b>🎟 {en ? extra.price.replace("成人", "Adult").replace("約", "approx. ").replace("需確認", "confirm") : extra.price}</b>}
                    {extra.hours && <b>🕒 {extra.hours}</b>}
                  </div>}
                  {extra.warning && <p className="warning">⚠ {en ? "Schedule or access restriction: check the latest official notice before departure." : extra.warning}</p>}
                  {extra.source && <a className="source-link" href={extra.source} target="_blank" rel="noreferrer">{en ? "Official information ↗" : "官方資料 ↗"}</a>}
                </div>}
                <div className="links">
                  {stop.map && <a href={stop.map} target="_blank" rel="noreferrer">↗ {en ? "Navigation" : "開啟導航"}</a>}
                  {stop.trail && <a href={assetPath(stop.trail)} target="_blank" rel="noreferrer">▧ {en ? "Trail map" : "雪場地圖"}</a>}
                </div>
              </article>
              {index === 0 && dailyOnsen && <Travel time="泡湯" label="滑後安排" />}
              {stop.kind === "onsen" && day.returnTravel && <Travel time={day.returnTravel} label="前往住宿 · 概略" />}
              {index === 0 && !dailyOnsen && day.returnTravel && <Travel time={day.returnTravel} label="滑後移動" />}
            </div>
          )})}
        </div>

        <div className="day-nav">
          <button disabled={active === 0} onClick={() => setActive(v => v - 1)}>← {en ? "Previous" : "前一天"}</button>
          <span>{active + 1} / {days.length}</span>
          <button disabled={active === days.length - 1} onClick={() => setActive(v => v + 1)}>{en ? "Next" : "後一天"} →</button>
        </div>
      </section>

      <footer><b>JAPOW 2027</b><span>{en ? "Photo spots · Progression · New resorts" : "適合打卡 · 適合練功 · 探索新雪場"}</span></footer>

      {info && <Modal onClose={() => setInfo(false)} title={en ? "Trip information" : "旅程資訊"}>
        <div className="stats"><div><b>{skiCount}</b><span>雪場</span></div><div><b>14</b><span>晚住宿</span></div><div><b>15</b><span>天旅程</span></div></div>
        <ul>{en ? <><li>Meet in Morioka on Jan 8; finish Jan 22, 2027</li><li>Snowboard-focused; carpool or self-drive; everyone welcome</li><li>Flexible joining/leaving at JR stations along the route</li><li>14 nights, single rooms with breakfast: ¥91,100</li><li>Book and pay hotels individually; split car, fuel and ETC costs</li></> : <><li>2027/01/08 盛岡集合，01/22 盛岡解散</li><li>單板為主，拼車或可自駕，男女不拘</li><li>可依個人需要於沿途 JR 站彈性加入／離開</li><li>14 晚單人房含早餐：¥91,100（約 NT$19,000）</li><li>酒店自行訂房付款；租車、油錢與 ETC 由同車平均分攤</li></>}</ul>
        <p className="notice">雪場營業、道路及纜車狀況受天候影響，實際安排可彈性互換。</p>
        <a className="contact" href="mailto:?subject=2027東北滑雪泡湯遊">詳情請私訊聯繫</a>
      </Modal>}

      {mapOpen && <Modal onClose={() => setMapOpen(false)} title="雪場 × 酒店動線">
        <img className="route-map" src={assetPath("/assets/route-map.png")} alt="東北十三雪場與酒店移動地圖" />
      </Modal>}
    </main>
  );
}

function Travel({ time, label }: { time: string; label: string }) {
  return <div className="travel"><span /><b>🚙 {time}</b><em>{label}</em><span /></div>;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return <div className="modal-backdrop" onClick={onClose}><section className="modal" onClick={e => e.stopPropagation()}><header><h2>{title}</h2><button onClick={onClose}>×</button></header>{children}</section></div>;
}
