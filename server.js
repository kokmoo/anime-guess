const express = require('express'), http = require('http'), { Server } = require('socket.io');
const fs = require('fs'), path = require('path');
const app = express(), srv = http.createServer(app), io = new Server(srv);
app.use(express.static('public'));

// [name, aliases, anime, era, world, ability, side, role]
const CH = [
  ['Naruto Uzumaki','นารูโตะ','Naruto','2000s','โลกนินจาที่มีหมู่บ้านซ่อนเร้นหลายแห่ง','โคลนเงาและพลังจักระ','ฝ่ายพระเอก','ตัวเอก'],
  ['Sasuke Uchiha','ซาสึเกะ','Naruto','2000s','โลกนินจาที่มีหมู่บ้านซ่อนเร้นหลายแห่ง','ไฟและสายฟ้า พร้อมดวงตาพิเศษ','ฝ่ายพระเอก','ตัวละครสำคัญ'],
  ['Kakashi Hatake','คาคาชิ','Naruto','2000s','โลกนินจาที่มีหมู่บ้านซ่อนเร้นหลายแห่ง','คัดลอกท่าด้วยดวงตา สายฟ้า','ฝ่ายพระเอก','ตัวรอง'],
  ['Monkey D. Luffy','ลูฟี่','One Piece','1990s','โลกทะเลกว้างที่เต็มไปด้วยโจรสลัดและเกาะแปลก','ร่างกายยืดหยุ่นเหมือนยาง','ฝ่ายพระเอก','ตัวเอก'],
  ['Roronoa Zoro','โซโล','One Piece','1990s','โลกทะเลกว้างที่เต็มไปด้วยโจรสลัดและเกาะแปลก','ใช้ดาบสามเล่ม','ฝ่ายพระเอก','ตัวละครสำคัญ'],
  ['Nami','นามิ','One Piece','1990s','โลกทะเลกว้างที่เต็มไปด้วยโจรสลัดและเกาะแปลก','ควบคุมสภาพอากาศด้วยไม้เท้า','ฝ่ายพระเอก','ตัวรอง'],
  ['Satoru Gojo','โกโจ|โกโจ ซาโตรุ','Jujutsu Kaisen','2020s','โลกที่ผู้ใช้เวทมนตร์ต่อสู้กับคำสาป','ควบคุมอนันต์และดวงตาหกเหลี่ยม','ฝ่ายพระเอก','ตัวละครสำคัญ'],
  ['Yuji Itadori','อิตาโดริ|ยูจิ','Jujutsu Kaisen','2020s','โลกที่ผู้ใช้เวทมนตร์ต่อสู้กับคำสาป','พลังกายสุดโหดและมีวิญญาณสิงในร่าง','ฝ่ายพระเอก','ตัวเอก'],
  ['Ryomen Sukuna','สุคุนะ','Jujutsu Kaisen','2020s','โลกที่ผู้ใช้เวทมนตร์ต่อสู้กับคำสาป','เวทตัดและเปลวเพลิง','ตัวร้าย','ตัวละครสำคัญ'],
  ['Tanjiro Kamado','ทันจิโร่','Demon Slayer','2010s','ญี่ปุ่นยุคไทโช ที่มีอสูรแอบซ่อน','ลมหายใจน้ำและจมูกไวมาก','ฝ่ายพระเอก','ตัวเอก'],
  ['Nezuko Kamado','เนซึโกะ','Demon Slayer','2010s','ญี่ปุ่นยุคไทโช ที่มีอสูรแอบซ่อน','ศิลปะโลหิตและร่างอสูร','ฝ่ายพระเอก','ตัวรอง'],
  ['Muzan Kibutsuji','มุซัน','Demon Slayer','2010s','ญี่ปุ่นยุคไทโช ที่มีอสูรแอบซ่อน','สร้างอสูรและฟื้นร่างได้','ตัวร้าย','ตัวละครสำคัญ'],
  ['Ichigo Kurosaki','อิจิโกะ','Bleach','2000s','โลกวิญญาณที่มียมทูตและฮอลโลว์','ดาบฟันวิญญาณขนาดใหญ่','ฝ่ายพระเอก','ตัวเอก'],
  ['Izuku Midoriya','มิโดริยะ|เดกุ|deku','My Hero Academia','2010s','โลกที่คนส่วนใหญ่มีพลังพิเศษเรียกว่าอัตลักษณ์','พลังเพิ่มกำลังที่สืบทอดมา','ฝ่ายพระเอก','ตัวเอก'],
  ['Katsuki Bakugo','บาคุโก','My Hero Academia','2010s','โลกที่คนส่วนใหญ่มีพลังพิเศษเรียกว่าอัตลักษณ์','ระเบิดจากฝ่ามือ','ฝ่ายพระเอก','ตัวละครสำคัญ'],
  ['Goku','โกคู|son goku','Dragon Ball Z','1980s','โลกที่มีดราก้อนบอลและนักสู้จากหลายดาว','ซูเปอร์ไซย่าและพลังคลื่นเต่า','ฝ่ายพระเอก','ตัวเอก'],
  ['Vegeta','เบจิต้า','Dragon Ball Z','1980s','โลกที่มีดราก้อนบอลและนักสู้จากหลายดาว','ซูเปอร์ไซย่าและพลังพลังงานระเบิด','ฝ่ายพระเอก','ตัวละครสำคัญ'],
  ['Eren Yeager','เอเรน','Attack on Titan','2010s','โลกที่มนุษย์อาศัยอยู่ในกำแพงกันไททัน','แปลงร่างเป็นไททัน','กลุ่มอื่น','ตัวเอก'],
  ['Levi Ackerman','ลีวาย','Attack on Titan','2010s','โลกที่มนุษย์อาศัยอยู่ในกำแพงกันไททัน','ใช้อุปกรณ์ขยับสามมิติ ฟันด้วยดาบคู่','ฝ่ายพระเอก','ตัวละครสำคัญ'],
  ['Rem','เรม','Re:Zero','2010s','โลกแฟนตาซีต่างโลกที่ผู้เล่นย้อนเวลาได้','เวทน้ำแข็งและใช้ลูกตุ้มเหล็กมีหนาม','ฝ่ายพระเอก','ตัวละครสำคัญ'],
  ['Light Yagami','ไลท์|ยางามิ ไลท์','Death Note','2000s','โลกปัจจุบันที่มีสมุดสังหารจากเทพมรณะ','ใช้สมุดสังหารฆ่าคน','ตัวร้าย','ตัวเอก'],
  ['L Lawliet','แอล|l','Death Note','2000s','โลกปัจจุบันที่มีสมุดสังหารจากเทพมรณะ','ไม่มีพลังพิเศษ ใช้สติปัญญาสืบสวน','ฝ่ายพระเอก','ตัวละครสำคัญ'],
  ['Edward Elric','เอ็ดเวิร์ด|เอ็ด','Fullmetal Alchemist','2000s','โลกที่เล่นแร่แปรธาตุเป็นศาสตร์หลัก','เล่นแร่แปรธาตุโดยไม่ต้องวงแหวน','ฝ่ายพระเอก','ตัวเอก'],
  ['Kaneki Ken','คาเนกิ|คาเนกิ เคน','Tokyo Ghoul','2010s','','พลังร่างกายกึ่งปีศาจและอวัยวะพิเศษที่งอกออกมาได้','ฝ่ายพระเอก','ตัวเอก'],
  ['Lelouch Lamperouge','เลลูช|เลอลูช|lelouch vi britannia','Code Geass','2000s','','ใช้สติปัญญาวางแผน และพลังสั่งให้คนทำตาม','กลุ่มอื่น','ตัวเอก'],
  ['Chrollo Lucilfer','โครโร่|โครลโล่','Hunter x Hunter','2010s','','ขโมยพลังพิเศษของคนอื่นมาใช้','ตัวร้าย','ตัวละครสำคัญ'],
  ['Hisoka Morow','ฮิโซกะ','Hunter x Hunter','2010s','','พลังเหนียวและยืดหยุ่นเหมือนหมากฝรั่ง','ตัวร้าย','ตัวละครสำคัญ'],
  ['Neferpitou','พิตู|ปิตู|pitou|nefelpitou','Hunter x Hunter','2010s','','ร่างกายแข็งแกร่งและรักษาคนได้ด้วยพลังพิเศษ','ตัวร้าย','ตัวรอง'],
  ['Killua Zoldyck','คิรัวร์|คิรัว','Hunter x Hunter','2010s','','พลังสายฟ้าและความเร็วสูง','ฝ่ายพระเอก','ตัวละครสำคัญ'],
  ['Kurapika','คุราปิก้า|kurapica','Hunter x Hunter','2010s','','ใช้โซ่พลังพิเศษ','ฝ่ายพระเอก','ตัวละครสำคัญ'],
  ['Reo Mikage','เรโอะ|เรโอ|mikage reo','Blue Lock','2020s','','ทักษะฟุตบอลที่ปรับตัวเลียนแบบได้เก่ง','ฝ่ายพระเอก','ตัวละครสำคัญ'],
  ['Seishiro Nagi','นากิ|นางิ|nagi seishiro','Blue Lock','2020s','','ทักษะฟุตบอลจากพรสวรรค์ควบคุมลูกเฉียบ','ฝ่ายพระเอก','ตัวละครสำคัญ'],
  ['Barou Shoei','บาโร่|บาโร|shoei barou','Blue Lock','2020s','','ทักษะฟุตบอลแบบจ้าวสนามที่มั่นใจตัวเองสุดๆ','กลุ่มอื่น','ตัวละครสำคัญ'],
  ['Rin Itoshi','ริน|อิโตชิ ริน|itoshi rin','Blue Lock','2020s','','ทักษะฟุตบอลระดับอัจฉริยะ','กลุ่มอื่น','ตัวละครสำคัญ'],
  ['Meguru Bachira','บาจิระ|บาชิระ|bachira meguru','Blue Lock','2020s','','ทักษะเลี้ยงบอลอิสระ ราวกับมีสัตว์ประหลาดในตัว','ฝ่ายพระเอก','ตัวละครสำคัญ'],
  ["Choji Akimichi", "โชจิ", "Naruto", "2000s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "ฝ่ายพระเอก", "ตัวรอง"],
  ["Boruto Uzumaki", "โบรูโตะ", "Naruto", "2000s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวเอก"],
  ["Obito Uchiha", "โอบิโตะ", "Naruto", "2000s", "", "ใช้พลังพิเศษเฉพาะตัว", "ตัวร้าย", "ตัวละครสำคัญ"],
  ["Akamaru", "อาคามารุ", "Naruto", "2000s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "ฝ่ายพระเอก", "ตัวรอง"],
  ["Gaara", "การะ", "Naruto", "2000s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Gamakichi", "", "Naruto", "2000s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "ฝ่ายพระเอก", "ตัวรอง"],
  ["Itachi Uchiha", "อิทาจิ", "Naruto", "2000s", "", "ใช้พลังพิเศษเฉพาะตัว", "กลุ่มอื่น", "ตัวละครสำคัญ"],
  ["Karin", "", "Naruto", "2000s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวรอง"],
  ["Kisame Hoshigaki", "คิซาเมะ", "Naruto", "2000s", "", "ใช้อาวุธเป็นหลัก", "ตัวร้าย", "ตัวรอง"],
  ["Konan", "", "Naruto", "2000s", "", "ใช้พลังพิเศษเฉพาะตัว", "ตัวร้าย", "ตัวรอง"],
  ["Madara Uchiha", "มาดาระ", "Naruto", "2000s", "", "ใช้พลังพิเศษเฉพาะตัว", "ตัวร้าย", "ตัวละครสำคัญ"],
  ["Minato Namikaze", "มินาโตะ", "Naruto", "2000s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Pakkun", "", "Naruto", "2000s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "ฝ่ายพระเอก", "ตัวรอง"],
  ["Rock Lee", "ล็อคลี|ร็อคลี", "Naruto", "2000s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Sasori", "ซาโซริ", "Naruto", "2000s", "", "ใช้พลังพิเศษเฉพาะตัว", "ตัวร้าย", "ตัวละครสำคัญ"],
  ["Tsunade", "สึนาเดะ", "Naruto", "2000s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Yahiko", "", "Naruto", "2000s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวรอง"],
  ["Akaza", "อาคาซะ", "Demon Slayer", "2010s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "ตัวร้าย", "ตัวละครสำคัญ"],
  ["Daki", "", "Demon Slayer", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ตัวร้าย", "ตัวรอง"],
  ["Doma", "", "Demon Slayer", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ตัวร้าย", "ตัวละครสำคัญ"],
  ["Gyokko", "", "Demon Slayer", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ตัวร้าย", "ตัวรอง"],
  ["Gyomei Himejima", "", "Demon Slayer", "2010s", "", "ใช้อาวุธเป็นหลัก", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Gyutaro", "", "Demon Slayer", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ตัวร้าย", "ตัวรอง"],
  ["Giyu Tomioka", "กิยู", "Demon Slayer", "2010s", "", "ใช้อาวุธเป็นหลัก", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Hantengu", "", "Demon Slayer", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ตัวร้าย", "ตัวรอง"],
  ["Kaigaku", "", "Demon Slayer", "2010s", "", "ใช้อาวุธเป็นหลัก", "ตัวร้าย", "ตัวรอง"],
  ["Inosuke Hashibira", "อิโนสึเกะ", "Demon Slayer", "2010s", "", "ใช้อาวุธเป็นหลัก", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Kaburamaru", "", "Demon Slayer", "2010s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "ฝ่ายพระเอก", "ตัวรอง"],
  ["Kagaya Ubuyashiki", "", "Demon Slayer", "2010s", "", "ใช้สติปัญญาวางแผน", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Kokushibo", "", "Demon Slayer", "2010s", "", "ใช้อาวุธเป็นหลัก", "ตัวร้าย", "ตัวละครสำคัญ"],
  ["Kyojuro Rengoku", "เรนโงคุ", "Demon Slayer", "2010s", "", "ใช้อาวุธเป็นหลัก", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Mitsuri Kanroji", "", "Demon Slayer", "2010s", "", "ใช้อาวุธเป็นหลัก", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Muichiro Tokito", "", "Demon Slayer", "2010s", "", "ใช้อาวุธเป็นหลัก", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Murata", "", "Demon Slayer", "2010s", "", "ใช้อาวุธเป็นหลัก", "ฝ่ายพระเอก", "ตัวรอง"],
  ["Nakime", "", "Demon Slayer", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ตัวร้าย", "ตัวรอง"],
  ["Obanai Iguro", "", "Demon Slayer", "2010s", "", "ใช้อาวุธเป็นหลัก", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Sakonji Urokodaki", "", "Demon Slayer", "2010s", "", "ใช้อาวุธเป็นหลัก", "ฝ่ายพระเอก", "ตัวรอง"],
  ["Sanemi Shinazugawa", "", "Demon Slayer", "2010s", "", "ใช้อาวุธเป็นหลัก", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Shinobu Kocho", "ชิโนบุ", "Demon Slayer", "2010s", "", "ใช้อาวุธเป็นหลัก", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Yoriichi Tsugikuni", "", "Demon Slayer", "2010s", "", "ใช้อาวุธเป็นหลัก", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Zenitsu Agatsuma", "เซนิตสึ", "Demon Slayer", "2010s", "", "ใช้อาวุธเป็นหลัก", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Chachamaru", "", "Demon Slayer", "2010s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "ฝ่ายพระเอก", "ตัวรอง"],
  ["Kenpachi Zaraki", "ซารากิ", "Bleach", "2000s", "", "ใช้อาวุธเป็นหลัก", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Uryu Ishida", "", "Bleach", "2000s", "", "ใช้อาวุธเป็นหลัก", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Sosuke Aizen", "ไอเซ็น", "Bleach", "2000s", "", "ใช้พลังพิเศษเฉพาะตัว", "ตัวร้าย", "ตัวละครสำคัญ"],
  ["Ulquiorra Cifer", "", "Bleach", "2000s", "", "ใช้พลังพิเศษเฉพาะตัว", "ตัวร้าย", "ตัวละครสำคัญ"],
  ["Kon", "", "Bleach", "2000s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "ฝ่ายพระเอก", "ตัวรอง"],
  ["Kisuke Urahara", "", "Bleach", "2000s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Renji Abarai", "", "Bleach", "2000s", "", "ใช้อาวุธเป็นหลัก", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Toshiro Hitsugaya", "", "Bleach", "2000s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Grimmjow Jaegerjaquez", "", "Bleach", "2000s", "", "ใช้อาวุธเป็นหลัก", "ตัวร้าย", "ตัวละครสำคัญ"],
  ["Armin Arlert", "อาร์มิน", "Attack on Titan", "2010s", "", "ใช้สติปัญญาวางแผน", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Connie Springer", "", "Attack on Titan", "2010s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "ฝ่ายพระเอก", "ตัวรอง"],
  ["Dina Fritz", "", "Attack on Titan", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "กลุ่มอื่น", "ตัวรอง"],
  ["Falco Grice", "", "Attack on Titan", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Karl Fritz", "", "Attack on Titan", "2010s", "", "ใช้สติปัญญาวางแผน", "กลุ่มอื่น", "ตัวรอง"],
  ["Gabi Braun", "", "Attack on Titan", "2010s", "", "ใช้อาวุธเป็นหลัก", "กลุ่มอื่น", "ตัวละครสำคัญ"],
  ["Hange Zoe", "", "Attack on Titan", "2010s", "", "ใช้สติปัญญาวางแผน", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Hannes", "", "Attack on Titan", "2010s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "ฝ่ายพระเอก", "ตัวรอง"],
  ["Jean Kirstein", "", "Attack on Titan", "2010s", "", "ใช้อาวุธเป็นหลัก", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Kenny Ackerman", "", "Attack on Titan", "2010s", "", "ใช้อาวุธเป็นหลัก", "ตัวร้าย", "ตัวละครสำคัญ"],
  ["Marco Bott", "", "Attack on Titan", "2010s", "", "ใช้อาวุธเป็นหลัก", "ฝ่ายพระเอก", "ตัวรอง"],
  ["Porco Galliard", "", "Attack on Titan", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "กลุ่มอื่น", "ตัวละครสำคัญ"],
  ["Reiner Braun", "ไรเนอร์", "Attack on Titan", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "กลุ่มอื่น", "ตัวละครสำคัญ"],
  ["Ymir", "", "Attack on Titan", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Ymir Fritz", "", "Attack on Titan", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ตัวร้าย", "ตัวละครสำคัญ"],
  ["Zeke Yeager", "ซีค", "Attack on Titan", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ตัวร้าย", "ตัวละครสำคัญ"],
  ["Yelena", "", "Attack on Titan", "2010s", "", "ใช้อาวุธเป็นหลัก", "กลุ่มอื่น", "ตัวรอง"],
  ["Pieck Finger", "พีค|cart titan|ไททันเกวียน", "Attack on Titan", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "กลุ่มอื่น", "ตัวละครสำคัญ"],
  ["Choso", "", "Jujutsu Kaisen", "2020s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Rika Orimoto", "", "Jujutsu Kaisen", "2020s", "", "ใช้พลังพิเศษเฉพาะตัว", "ตัวร้าย", "ตัวรอง"],
  ["Dagon", "", "Jujutsu Kaisen", "2020s", "", "ใช้พลังพิเศษเฉพาะตัว", "ตัวร้าย", "ตัวรอง"],
  ["Fly Heads", "", "Jujutsu Kaisen", "2020s", "", "ใช้พลังพิเศษเฉพาะตัว", "ตัวร้าย", "ตัวรอง"],
  ["Hanami", "", "Jujutsu Kaisen", "2020s", "", "ใช้พลังพิเศษเฉพาะตัว", "ตัวร้าย", "ตัวละครสำคัญ"],
  ["Jogo", "", "Jujutsu Kaisen", "2020s", "", "ใช้พลังพิเศษเฉพาะตัว", "ตัวร้าย", "ตัวละครสำคัญ"],
  ["Kenjaku", "", "Jujutsu Kaisen", "2020s", "", "ใช้พลังพิเศษเฉพาะตัว", "ตัวร้าย", "ตัวละครสำคัญ"],
  ["Mahito", "", "Jujutsu Kaisen", "2020s", "", "ใช้พลังพิเศษเฉพาะตัว", "ตัวร้าย", "ตัวละครสำคัญ"],
  ["Maki Zenin", "", "Jujutsu Kaisen", "2020s", "", "ใช้อาวุธเป็นหลัก", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Megumi Fushiguro", "เมกุมิ", "Jujutsu Kaisen", "2020s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Kento Nanami", "นานามิ", "Jujutsu Kaisen", "2020s", "", "ใช้อาวุธเป็นหลัก", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Panda", "", "Jujutsu Kaisen", "2020s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "ฝ่ายพระเอก", "ตัวรอง"],
  ["Toge Inumaki", "", "Jujutsu Kaisen", "2020s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวรอง"],
  ["Toji Fushiguro", "โทจิ", "Jujutsu Kaisen", "2020s", "", "ใช้อาวุธเป็นหลัก", "ตัวร้าย", "ตัวละครสำคัญ"],
  ["Yuta Okkotsu", "ยูตะ", "Jujutsu Kaisen", "2020s", "", "ใช้อาวุธเป็นหลัก", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Aki Hayakawa", "อากิ", "Chainsaw Man", "2020s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Angel Devil", "", "Chainsaw Man", "2020s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวรอง"],
  ["Denji", "เดนจิ", "Chainsaw Man", "2020s", "", "ใช้อาวุธเป็นหลัก", "ฝ่ายพระเอก", "ตัวเอก"],
  ["Kishibe", "", "Chainsaw Man", "2020s", "", "ใช้อาวุธเป็นหลัก", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Makima", "มากิมะ", "Chainsaw Man", "2020s", "", "ใช้พลังพิเศษเฉพาะตัว", "ตัวร้าย", "ตัวละครสำคัญ"],
  ["Power", "พาวเวอร์", "Chainsaw Man", "2020s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Reze", "เรเซ่", "Chainsaw Man", "2020s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "ตัวร้าย", "ตัวละครสำคัญ"],
  ["Beam", "", "Chainsaw Man", "2020s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "ฝ่ายพระเอก", "ตัวรอง"],
  ["Beerus", "เบรุส", "Dragon Ball Z", "1980s", "", "ใช้พลังพิเศษเฉพาะตัว", "กลุ่มอื่น", "ตัวละครสำคัญ"],
  ["Gohan", "โกฮัง", "Dragon Ball Z", "1980s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Piccolo", "พิคโกโร่", "Dragon Ball Z", "1980s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Zeno", "", "Dragon Ball Z", "1980s", "", "ใช้พลังพิเศษเฉพาะตัว", "กลุ่มอื่น", "ตัวละครสำคัญ"],
  ["Trunks", "ทรังค์ส", "Dragon Ball Z", "1980s", "", "ใช้อาวุธเป็นหลัก", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Ikalgo", "", "Hunter x Hunter", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวรอง"],
  ["Isaac Netero", "เนเทโร่", "Hunter x Hunter", "2010s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Kikyo Zoldyck", "", "Hunter x Hunter", "2010s", "", "ใช้อาวุธเป็นหลัก", "กลุ่มอื่น", "ตัวรอง"],
  ["Kite", "", "Hunter x Hunter", "2010s", "", "ใช้อาวุธเป็นหลัก", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Kortopi", "", "Hunter x Hunter", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ตัวร้าย", "ตัวรอง"],
  ["Feitan Portor", "เฟย์ตัน", "Hunter x Hunter", "2010s", "", "ใช้อาวุธเป็นหลัก", "ตัวร้าย", "ตัวละครสำคัญ"],
  ["Cheetu", "", "Hunter x Hunter", "2010s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "ตัวร้าย", "ตัวรอง"],
  ["Palm Siberia", "", "Hunter x Hunter", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวรอง"],
  ["Hina", "", "Hunter x Hunter", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "กลุ่มอื่น", "ตัวรอง"],
  ["Zushi", "", "Hunter x Hunter", "2010s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "ฝ่ายพระเอก", "ตัวรอง"],
  ["Alluka Zoldyck", "", "Hunter x Hunter", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "กลุ่มอื่น", "ตัวรอง"],
  ["Gotoh", "", "Hunter x Hunter", "2010s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "ฝ่ายพระเอก", "ตัวรอง"],
  ["Mizaistom Nana", "", "Hunter x Hunter", "2010s", "", "ใช้สติปัญญาวางแผน", "กลุ่มอื่น", "ตัวรอง"],
  ["Dwun", "", "Hunter x Hunter", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "กลุ่มอื่น", "ตัวรอง"],
  ["Eeta", "", "Hunter x Hunter", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "กลุ่มอื่น", "ตัวรอง"],
  ["Elena", "", "Hunter x Hunter", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "กลุ่มอื่น", "ตัวรอง"],
  ["Razor", "", "Hunter x Hunter", "2010s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "กลุ่มอื่น", "ตัวรอง"],
  ["Shizuku Murasaki", "", "Hunter x Hunter", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ตัวร้าย", "ตัวละครสำคัญ"],
  ["Uvogin", "", "Hunter x Hunter", "2010s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "ตัวร้าย", "ตัวละครสำคัญ"],
  ["Nobunaga Hazama", "", "Hunter x Hunter", "2010s", "", "ใช้อาวุธเป็นหลัก", "ตัวร้าย", "ตัวละครสำคัญ"],
  ["Mike", "", "Hunter x Hunter", "2010s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "กลุ่มอื่น", "ตัวรอง"],
  ["Meliodas", "เมลิโอดาส", "Seven Deadly Sins", "2010s", "", "ใช้อาวุธเป็นหลัก", "ฝ่ายพระเอก", "ตัวเอก"],
  ["Ban", "แบน", "Seven Deadly Sins", "2010s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Diane", "ไดแอน", "Seven Deadly Sins", "2010s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Escanor", "เอสคานอร์", "Seven Deadly Sins", "2010s", "", "ใช้อาวุธเป็นหลัก", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Gowther", "", "Seven Deadly Sins", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Hawk", "", "Seven Deadly Sins", "2010s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "ฝ่ายพระเอก", "ตัวรอง"],
  ["Merlin", "เมอร์ลิน", "Seven Deadly Sins", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Guts", "กัทส์", "Berserk", "1990s", "", "ใช้อาวุธเป็นหลัก", "ฝ่ายพระเอก", "ตัวเอก"],
  ["Griffith", "กริฟฟิธ", "Berserk", "1990s", "", "ใช้อาวุธเป็นหลัก", "ตัวร้าย", "ตัวละครสำคัญ"],
  ["Casca", "คาสก้า", "Berserk", "1990s", "", "ใช้อาวุธเป็นหลัก", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Atsumu Miya", "", "Haikyuu", "2010s", "", "ทักษะกีฬาเป็นจุดเด่น", "กลุ่มอื่น", "ตัวละครสำคัญ"],
  ["Koutarou Bokuto", "โบคุโตะ", "Haikyuu", "2010s", "", "ทักษะกีฬาเป็นจุดเด่น", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Shoyo Hinata", "ฮินาตะ", "Haikyuu", "2010s", "", "ทักษะกีฬาเป็นจุดเด่น", "ฝ่ายพระเอก", "ตัวเอก"],
  ["Tobio Kageyama", "คาเงยามะ", "Haikyuu", "2010s", "", "ทักษะกีฬาเป็นจุดเด่น", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Kenma Kozume", "", "Haikyuu", "2010s", "", "ทักษะกีฬาเป็นจุดเด่น", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Tetsuro Kuroo", "", "Haikyuu", "2010s", "", "ทักษะกีฬาเป็นจุดเด่น", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Kei Tsukishima", "", "Haikyuu", "2010s", "", "ทักษะกีฬาเป็นจุดเด่น", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Wakatoshi Ushijima", "", "Haikyuu", "2010s", "", "ทักษะกีฬาเป็นจุดเด่น", "กลุ่มอื่น", "ตัวละครสำคัญ"],
  ["Tooru Oikawa", "", "Haikyuu", "2010s", "", "ทักษะกีฬาเป็นจุดเด่น", "กลุ่มอื่น", "ตัวละครสำคัญ"],
  ["Nico Robin", "โรบิน", "One Piece", "1990s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Franky", "แฟรงกี้", "One Piece", "1990s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Sabo", "ซาโบ", "One Piece", "1990s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Enel", "เอเนล", "One Piece", "1990s", "", "ใช้พลังพิเศษเฉพาะตัว", "ตัวร้าย", "ตัวละครสำคัญ"],
  ["Kizaru", "คิซารุ", "One Piece", "1990s", "", "ใช้พลังพิเศษเฉพาะตัว", "กลุ่มอื่น", "ตัวละครสำคัญ"],
  ["Portgas D. Ace", "เอส|ace", "One Piece", "1990s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Bartolomeo", "", "One Piece", "1990s", "", "ใช้พลังพิเศษเฉพาะตัว", "กลุ่มอื่น", "ตัวรอง"],
  ["Usopp", "อุซป", "One Piece", "1990s", "", "ใช้อาวุธเป็นหลัก", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Shanks", "แชงคูส", "One Piece", "1990s", "", "ใช้อาวุธเป็นหลัก", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Kaido", "ไคโด", "One Piece", "1990s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "ตัวร้าย", "ตัวละครสำคัญ"],
  ["Tony Tony Chopper", "ช็อปเปอร์|chopper", "One Piece", "1990s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Sanji", "ซันจิ", "One Piece", "1990s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Brook", "บรู๊ค", "One Piece", "1990s", "", "ใช้อาวุธเป็นหลัก", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Dracule Mihawk", "มิฮอว์ค|mihawk", "One Piece", "1990s", "", "ใช้อาวุธเป็นหลัก", "กลุ่มอื่น", "ตัวละครสำคัญ"],
  ["Ryuk", "ริวขุ|ริว", "Death Note", "2000s", "", "ใช้พลังพิเศษเฉพาะตัว", "กลุ่มอื่น", "ตัวละครสำคัญ"],
  ["Misa Amane", "มิสะ", "Death Note", "2000s", "", "ใช้พลังพิเศษเฉพาะตัว", "กลุ่มอื่น", "ตัวละครสำคัญ"],
  ["Near", "เนียร์", "Death Note", "2000s", "", "ใช้สติปัญญาวางแผน", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Van Hohenheim", "", "Fullmetal Alchemist", "2000s", "", "ใช้พลังพิเศษเฉพาะตัว", "กลุ่มอื่น", "ตัวละครสำคัญ"],
  ["Roy Mustang", "มัสแตง", "Fullmetal Alchemist", "2000s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Alex Louis Armstrong", "อาร์มสตรอง", "Fullmetal Alchemist", "2000s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Winry Rockbell", "วินรี่", "Fullmetal Alchemist", "2000s", "", "ใช้สติปัญญาวางแผน", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Alphonse Elric", "อัลฟองส์", "Fullmetal Alchemist", "2000s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวเอก"],
  ["King Bradley", "", "Fullmetal Alchemist", "2000s", "", "ใช้อาวุธเป็นหลัก", "ตัวร้าย", "ตัวละครสำคัญ"],
  ["Shinnosuke Nohara", "ชินจัง|ชินโนะสุเกะ|shin chan", "Crayon Shin-chan", "1990s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "กลุ่มอื่น", "ตัวเอก"],
  ["Misae Nohara", "มิซาเอะ", "Crayon Shin-chan", "1990s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "กลุ่มอื่น", "ตัวละครสำคัญ"],
  ["Toru Kazama", "คาซามะ", "Crayon Shin-chan", "1990s", "", "ใช้สติปัญญาวางแผน", "กลุ่มอื่น", "ตัวละครสำคัญ"],
  ["Hiroshi Nohara", "ฮิโรชิ", "Crayon Shin-chan", "1990s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "กลุ่มอื่น", "ตัวละครสำคัญ"],
  ["Himawari Nohara", "ฮิมาวาริ", "Crayon Shin-chan", "1990s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "กลุ่มอื่น", "ตัวรอง"],
  ["Conan Edogawa", "โคนัน", "Detective Conan", "1990s", "", "ใช้สติปัญญาวางแผน", "ฝ่ายพระเอก", "ตัวเอก"],
  ["Ran Mouri", "รัน", "Detective Conan", "1990s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Ai Haibara", "ไฮบาระ", "Detective Conan", "1990s", "", "ใช้สติปัญญาวางแผน", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Kogoro Mouri", "", "Detective Conan", "1990s", "", "ใช้สติปัญญาวางแผน", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Kaito Kid", "คิด|kid", "Detective Conan", "1990s", "", "ใช้สติปัญญาวางแผน", "กลุ่มอื่น", "ตัวละครสำคัญ"],
  ["All Might", "ออลไมท์", "My Hero Academia", "2010s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Shota Aizawa", "eraser head", "My Hero Academia", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Recovery Girl", "", "My Hero Academia", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวรอง"],
  ["Tsuyu Asui", "", "My Hero Academia", "2010s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Ochaco Uraraka", "โอจาโกะ", "My Hero Academia", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Tenya Iida", "", "My Hero Academia", "2010s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Fumikage Tokoyami", "", "My Hero Academia", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Shoto Todoroki", "โทโดโรกิ", "My Hero Academia", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Minoru Mineta", "", "My Hero Academia", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวรอง"],
  ["Momo Yaoyorozu", "", "My Hero Academia", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Best Jeanist", "", "My Hero Academia", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Nemuri Kayama", "midnight", "My Hero Academia", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Dabi", "", "My Hero Academia", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ตัวร้าย", "ตัวละครสำคัญ"],
  ["Enji Todoroki", "endeavor", "My Hero Academia", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Himiko Toga", "", "My Hero Academia", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ตัวร้าย", "ตัวละครสำคัญ"],
  ["Inko Midoriya", "", "My Hero Academia", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวรอง"],
  ["Lady Nagant", "", "My Hero Academia", "2010s", "", "ใช้อาวุธเป็นหลัก", "ตัวร้าย", "ตัวละครสำคัญ"],
  ["Mirio Togata", "", "My Hero Academia", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Mr. Compress", "", "My Hero Academia", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ตัวร้าย", "ตัวรอง"],
  ["Muscular", "", "My Hero Academia", "2010s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "ตัวร้าย", "ตัวรอง"],
  ["Nejire Hado", "", "My Hero Academia", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Spinner", "", "My Hero Academia", "2010s", "", "ใช้อาวุธเป็นหลัก", "ตัวร้าย", "ตัวละครสำคัญ"],
  ["Stain", "", "My Hero Academia", "2010s", "", "ใช้อาวุธเป็นหลัก", "ตัวร้าย", "ตัวละครสำคัญ"],
  ["Tamaki Amajiki", "", "My Hero Academia", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Tomura Shigaraki", "", "My Hero Academia", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ตัวร้าย", "ตัวละครสำคัญ"],
  ["Tooru Hagakure", "", "My Hero Academia", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวรอง"],
  ["Twice", "", "My Hero Academia", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ตัวร้าย", "ตัวรอง"],
  ["Nomu", "", "My Hero Academia", "2010s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "ตัวร้าย", "ตัวรอง"],
  ["Vlad King", "", "My Hero Academia", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวรอง"],
  ["All For One", "", "My Hero Academia", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ตัวร้าย", "ตัวละครสำคัญ"],
  ["Edge Shot", "", "My Hero Academia", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Reinhard van Astrea", "ไรน์ฮาร์ด", "Re:Zero", "2010s", "", "ใช้อาวุธเป็นหลัก", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Beatrice", "เบอาทริซ", "Re:Zero", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Subaru Natsuki", "ซูบารุ", "Re:Zero", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวเอก"],
  ["Emilia", "เอมีเลีย", "Re:Zero", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Ram", "ราม", "Re:Zero", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Regulus Corneas", "", "Re:Zero", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "ตัวร้าย", "ตัวละครสำคัญ"],
  ["Rize Kamishiro", "ริเซะ", "Tokyo Ghoul", "2010s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "ตัวร้าย", "ตัวละครสำคัญ"],
  ["Shuu Tsukiyama", "ซึกิยามะ", "Tokyo Ghoul", "2010s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "กลุ่มอื่น", "ตัวละครสำคัญ"],
  ["Uta", "อุตะ", "Tokyo Ghoul", "2010s", "", "ใช้พลังพิเศษเฉพาะตัว", "กลุ่มอื่น", "ตัวละครสำคัญ"],
  ["Touka Kirishima", "โทกะ", "Tokyo Ghoul", "2010s", "", "ใช้ความแข็งแกร่งทางร่างกาย", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Sung Jinwoo", "จินวู", "Solo Leveling", "2020s", "", "ใช้พลังพิเศษเฉพาะตัว", "ฝ่ายพระเอก", "ตัวเอก"],
  ["Cha Hae-In", "", "Solo Leveling", "2020s", "", "ใช้อาวุธเป็นหลัก", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Igris", "", "Solo Leveling", "2020s", "", "ใช้อาวุธเป็นหลัก", "ฝ่ายพระเอก", "ตัวรอง"],
  ["Rensuke Kunigami", "คูนิกามิ", "Blue Lock", "2020s", "", "ทักษะกีฬาเป็นจุดเด่น", "ฝ่ายพระเอก", "ตัวละครสำคัญ"],
  ["Menthuthuyoupi","youpi|ยูปี้|ยูปิ","Hunter x Hunter","2010s","","ใช้ความแข็งแกร่งทางร่างกาย","กลุ่มอื่น","ตัวรอง"],
  ["Meruem","เมรูเอ็ม|เมรุเอม","Hunter x Hunter","2010s","","ใช้พลังพิเศษเฉพาะตัว","ตัวร้าย","ตัวละครสำคัญ"]
];
const ANIMES = [...new Set(CH.map(c => c[2]))];
const slugOf = n => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const CARDS = ['world','letter','era','ability','side','role'];
const WORLD = {'Naruto':'โลกที่ผู้คนฝึกวิชาต่อสู้แบบลับๆ','One Piece':'โลกที่ส่วนใหญ่เป็นทะเลและเกาะ','Jujutsu Kaisen':'โลกปัจจุบันที่มีสิ่งเหนือธรรมชาติซ่อนอยู่','Demon Slayer':'โลกยุคเก่าที่มีสิ่งลึกลับออกหากินตอนกลางคืน','Bleach':'โลกที่มีทั้งคนเป็นและวิญญาณอยู่ร่วมกัน','My Hero Academia':'โลกยุคใหม่ที่คนส่วนใหญ่มีความสามารถแปลกๆ','Dragon Ball Z':'โลกที่มีนักสู้แกร่งและของวิเศษให้ตามหา','Attack on Titan':'โลกที่ผู้คนอยู่อย่างหวาดกลัวภัยคุกคาม','Death Note':'โลกปัจจุบันที่มีของแปลกบางอย่างโผล่เข้ามา','Fullmetal Alchemist':'โลกที่วิทยาศาสตร์กับสิ่งลึกลับปนกัน','Re:Zero':'โลกแฟนตาซีที่มีคนข้ามมาจากอีกโลกหนึ่ง','Tokyo Ghoul':'โลกปัจจุบันที่มีสิ่งมีชีวิตแฝงตัวอยู่ในเมือง','Code Geass':'โลกที่มหาอำนาจแย่งชิงดินแดนกัน','Hunter x Hunter':'โลกกว้างที่มีนักล่าและการผจญภัยหลายรูปแบบ','Blue Lock':'โลกปัจจุบันที่การแข่งขันกีฬาดุเดือดมาก','Seven Deadly Sins':'โลกแฟนตาซียุคกลางที่มีอาณาจักรและอัศวินศักดิ์สิทธิ์','Berserk':'โลกยุคกลางมืดมนที่มีสิ่งชั่วร้ายแฝงตัวอยู่','Haikyuu':'โลกปัจจุบันที่ทีมกีฬาแข่งขันกันเข้มข้น','Chainsaw Man':'โลกปัจจุบันที่มีปีศาจปะปนกับมนุษย์','Crayon Shin-chan':'โลกชีวิตประจำวันของครอบครัวและเพื่อนบ้าน','Detective Conan':'โลกปัจจุบันที่มีคดีปริศนาเกิดขึ้นเสมอ','Solo Leveling':'โลกที่มีประตูมิติและนักล่าที่ต่อสู้กับมอนสเตอร์'};
const vAbility = c => /ฟุตบอล|กีฬา/.test(c[5]) ? 'ถนัดทักษะกีฬาและการแข่งขัน' : /ดาบ|อาวุธ|ลูกตุ้ม/.test(c[5]) ? 'ถนัดการใช้อาวุธ' : /สมุด|สติปัญญา|สืบสวน/.test(c[5]) ? 'ใช้สมองมากกว่ากำลัง' : /ยืด|แปลงร่าง|ร่างกาย|กาย/.test(c[5]) ? 'มีความสามารถทางร่างกายที่ไม่ธรรมดา' : 'ใช้พลังพิเศษที่ไม่ใช่แค่หมัดกับดาบ';
const hint = (t, c) => ({
  world: `โลกในเรื่อง: ${WORLD[c[2]] || 'ไม่ใช่โลกธรรมดา'}`, letter: `ชื่อตัวละครขึ้นต้นด้วย ${c[0][0].toUpperCase()}`,
  era: `อนิเมะเรื่องนี้ฉายครั้งแรก${parseInt(c[3]) < 2000 ? 'ก่อน' : 'หลัง'}ปี 2000`,
  ability: `ความสามารถ: ${vAbility(c)}`, side: `ฝ่าย: ${c[6]}`, role: `บทบาท: ${c[7]}`
})[t];
const norm = s => String(s).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const accepts = c => new Set([norm(c[0]), ...c[1].split('|').map(norm), ...norm(c[0]).split(' ').filter(w => w.length >= 4)]);
const rooms = {};
const pick = a => a[Math.floor(Math.random() * a.length)];

function view(r, p) {
  const t = r.phase === 'play' ? r.endsAt : r.phase === 'final' ? r.finalEnd : r.phase === 'countdown' ? r.cdEnd : 0;
  const over = r.phase === 'over';
  return {
    code: r.code, phase: r.phase, set: r.set, you: p.pid, owner: r.owner === p.pid,
    left: t ? Math.max(0, t - Date.now()) : 0,
    turn: r.phase === 'play' ? r.players[r.turn].pid : null,
    canCard: r.phase === 'play' && r.players[r.turn].pid === p.pid && !r.cardUsed,
    cards: p.cards, hints: p.hints, res: p.res,
    players: r.players.map(q => ({
      pid: q.pid, name: q.name, ready: q.ready, res: q.res, cards: q.cards.length, wins: q.wins || 0,
      asks: over ? q.asks : 0, used: over ? q.used : 0, t: over ? q.t : 0,
      ch: (over || q.res || (q.pid !== p.pid && r.phase !== 'lobby')) ? q.ch : null
    }))
  };
}
const send = r => r.players.forEach(p => p.sid && io.to(p.sid).emit('state', view(r, p)));
const unresolved = r => r.players.filter(p => !p.res);
const nextTurn = r => {
  r.cardUsed = false;
  for (let i = 1; i <= r.players.length; i++) {
    const k = (r.turn + i) % r.players.length;
    if (!r.players[k].res) return (r.turn = k);
  }
};
function finish(r) { r.phase = 'over'; r.players.forEach(p => { if (p.res === 'win') p.wins = (p.wins || 0) + 1; }); send(r); }

setInterval(() => {
  const now = Date.now();
  for (const r of Object.values(rooms)) {
    if (r.phase === 'play') {
      if (!unresolved(r).length) finish(r);
      else if (now >= r.endsAt) { r.phase = 'final'; r.finalEnd = now + 30000; send(r); }
      else send(r);
    } else if (r.phase === 'final') {
      if (!unresolved(r).length) finish(r);
      else if (now >= r.finalEnd) { unresolved(r).forEach(p => p.res = 'lose'); finish(r); }
      else send(r);
    }
  }
}, 1000);

io.on('connection', sock => {
  sock.emit('meta', { v: 3, animes: ANIMES, chars: CH.map(c => [c[0], c[2], fs.existsSync(path.join(__dirname, 'public', 'img', slugOf(c[0]) + '.jpg')) ? slugOf(c[0]) : '']) });
  const find = () => Object.values(rooms).find(r => r.players.some(p => p.sid === sock.id));
  const me = r => r && r.players.find(p => p.sid === sock.id);
  const err = m => sock.emit('err', m);

  sock.on('create', ({ name, pid, set }) => {
    let code; do { code = Math.random().toString(36).slice(2, 7).toUpperCase(); } while (rooms[code]);
    const time = [8, 10, 15, 20].includes(+set.time) ? +set.time : 10;
    const animes = set.animes === 'ALL' ? 'ALL' : (set.animes || []).filter(a => ANIMES.includes(a));
    if (animes !== 'ALL' && animes.length === 0) return err('เลือกอนิเมะอย่างน้อย 1 เรื่อง');
    const r = rooms[code] = {
      code, owner: pid, phase: 'lobby', turn: 0, players: [],
      set: { time, max: Math.min(10, Math.max(2, +set.max || 4)), animes, cards: !!set.cards, cardCount: Math.min(5, Math.max(1, +set.cardCount || 2)) }
    };
    r.players.push({ pid, name: String(name || '').trim().slice(0, 16) || 'Player ' + (r.players.length + 1), sid: sock.id, cards: [], hints: [], asks: 0, used: 0 });
    send(r);
  });

  sock.on('join', ({ code, name, pid }) => {
    const r = rooms[String(code).toUpperCase()];
    if (!r) return err('ไม่พบห้องนี้');
    const old = r.players.find(p => p.pid === pid);
    if (old) { old.sid = sock.id; if (name && String(name).trim()) old.name = String(name).trim().slice(0, 16); return send(r); }
    if (r.phase !== 'lobby') return err('เกมเริ่มไปแล้ว');
    if (r.players.length >= r.set.max) return err('ห้องเต็มแล้ว');
    r.players.push({ pid, name: String(name || '').trim().slice(0, 16) || 'Player ' + (r.players.length + 1), sid: sock.id, cards: [], hints: [], asks: 0, used: 0 });
    send(r);
  });

  sock.on('start', () => {
    const r = find(), p = me(r);
    if (!r || r.owner !== p.pid || r.phase !== 'lobby') return;
    if (r.players.length < 2) return err('ต้องมีผู้เล่นอย่างน้อย 2 คน');
    const pool = CH.filter(c => r.set.animes === 'ALL' || r.set.animes.includes(c[2])).sort(() => Math.random() - 0.5);
    if (pool.length < r.players.length) return err('ตัวละครในหมวดที่เลือกไม่พอ เลือกเพิ่มอีกสักเรื่อง');
    const picks = [], seen = new Set();
    r.players.forEach(() => {
      const c = pool.find(x => !picks.includes(x) && !seen.has(x[2])) || pool.find(x => !picks.includes(x));
      picks.push(c); seen.add(c[2]);
    });
    r.players.forEach((q, i) => {
      q.full = picks[i]; q.ch = { n: picks[i][0], a: picks[i][2], i: (slug => fs.existsSync(path.join(__dirname, 'public', 'img', slug + '.jpg')) ? slug : '')(picks[i][0].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')) };
      q.cards = [];
      q.hints = []; q.res = null; q.ready = false; q.asks = 0; q.used = 0; q.t = 0;
    });
    if (r.set.cards) {
      const cnt = {}; CARDS.forEach(t => cnt[t] = 0);
      r.players.forEach(q => {
        for (let k = 0; k < Math.min(r.set.cardCount, CARDS.length); k++) {
          const opts = CARDS.filter(t => !q.cards.includes(t)), min = Math.min(...opts.map(t => cnt[t]));
          const t = pick(opts.filter(t => cnt[t] === min)); q.cards.push(t); cnt[t]++;
        }
      });
    }
    r.phase = 'brief'; send(r);
  });

  sock.on('ready', () => {
    const r = find(), p = me(r);
    if (!r || r.phase !== 'brief') return;
    p.ready = true;
    if (r.players.every(q => q.ready)) {
      r.phase = 'countdown'; r.cdEnd = Date.now() + 3500;
      setTimeout(() => { if (r.phase !== 'countdown') return; r.phase = 'play'; r.startAt = Date.now(); r.endsAt = r.startAt + r.set.time * 60000; r.turn = 0; r.cardUsed = false; send(r); }, 3500);
    }
    send(r);
  });

  sock.on('endTurn', () => {
    const r = find(), p = me(r);
    if (!r || r.phase !== 'play' || r.players[r.turn].pid !== p.pid) return;
    p.asks++; nextTurn(r); send(r);
  });

  sock.on('useCard', type => {
    const r = find(), p = me(r);
    if (!r || r.phase !== 'play' || p.res) return;
    if (r.players[r.turn].pid !== p.pid) return sock.emit('err', 'ใช้การ์ดได้เฉพาะตาของคุณ');
    if (r.cardUsed) return sock.emit('err', 'ตานี้คุณใช้การ์ดไปแล้ว ใช้ได้ 1 ใบต่อตา');
    const i = p.cards.indexOf(type);
    if (i < 0) return;
    p.cards.splice(i, 1); p.used++; r.cardUsed = true;
    const h = hint(type, p.full); p.hints.push(h);
    r.players.forEach(q => q.sid && io.to(q.sid).emit('toast', { name: p.name, type, hint: h }));
    send(r);
  });

  sock.on('guess', text => {
    const r = find(), p = me(r);
    if (!r || !['play', 'final'].includes(r.phase) || p.res) return;
    p.res = accepts(p.full).has(norm(text)) ? 'win' : 'lose';
    p.t = Date.now() - r.startAt;
    const first = p.res === 'win' && !r.players.some(q => q !== p && q.res === 'win');
    r.players.forEach(q => q.sid && io.to(q.sid).emit('solved', { pid: p.pid, name: p.name, win: p.res === 'win', first, ch: p.ch }));
    if (r.phase === 'play' && r.players[r.turn].pid === p.pid) nextTurn(r);
    send(r);
  });

  sock.on('rename', n => { const r = find(), p = me(r); if (!r || !p) return; p.name = String(n || '').trim().slice(0, 16) || p.name; send(r); });

  sock.on('leave', () => {
    const r = find(); if (!r) return;
    const i = r.players.findIndex(p => p.sid === sock.id), p = r.players[i];
    r.players.splice(i, 1);
    if (!r.players.length) { delete rooms[r.code]; return; }
    if (r.owner === p.pid) r.owner = r.players[0].pid;
    if (i === r.turn) r.cardUsed = false;
    if (i < r.turn) r.turn--;
    if (r.turn >= r.players.length) r.turn = 0;
    if (!['lobby', 'over'].includes(r.phase) && r.players.length < 2) {
      r.phase = 'lobby';
      r.players.forEach(q => { q.ch = null; q.full = null; q.res = null; q.ready = false; q.cards = []; q.hints = []; });
    }
    send(r);
  });

  sock.on('react', ans => {
    const r = find(), p = me(r);
    if (!r || r.phase !== 'play' || !['yes', 'no'].includes(ans) || r.players[r.turn].pid === p.pid) return;
    if (Date.now() - (p.lr || 0) < 600) return; p.lr = Date.now();
    r.players.forEach(q => q.sid && io.to(q.sid).emit('react', { name: p.name, ans }));
  });

  sock.on('kick', pid => {
    const r = find(), p = me(r);
    if (!r || r.owner !== p.pid || r.phase !== 'lobby' || pid === p.pid) return;
    const i = r.players.findIndex(q => q.pid === pid); if (i < 0) return;
    const [q] = r.players.splice(i, 1); if (q.sid) io.to(q.sid).emit('kicked'); send(r);
  });

  sock.on('again', () => {
    const r = find(), p = me(r);
    if (!r || r.owner !== p.pid || r.phase !== 'over') return;
    r.phase = 'lobby'; r.players.forEach(q => { q.ch = null; q.full = null; q.res = null; q.ready = false; q.cards = []; q.hints = []; });
    send(r);
  });
});

srv.listen(process.env.PORT || 3000, () => console.log('ANIME GUESS running on :' + (process.env.PORT || 3000)));
