const {
    WAConnection,
    MessageType,
    Presence,
    MessageOptions,
    Mimetype,
    WALocationMessage,
    WA_MESSAGE_STUB_TYPES,
    ReconnectMode,
    ProxyAgent,
    waChatKey,
} = require("@adiwajshing/baileys");
const qrcode = require("qrcode-terminal");
const ffmpeg = require("fluent-ffmpeg")
const {
    spawn,
    exec,
    execSync
} = require("child_process");
const tiktokMeta = require("tiktok-scraper");
const tiktokGet = require('tiktok-scraper-without-watermark')
const facebookTools = require("facebook-tools");
const streamifier = require("streamifier")
const moment = require("moment-timezone");
const cheerio = require("cheerio");
const imageToBase64 = require('image-to-base64');
const get = require('got')
const fs = require("fs");
const fetch = require('node-fetch');
const urlencode = require("urlencode");
const axios = require("axios").default
const syntaxerror = require('syntax-error')
const path = require('path')
const util = require('util')
const dbs = JSON.parse(fs.readFileSync("./dbs.json"))
const figlet = require('figlet');
const premium = JSON.parse(fs.readFileSync("./database/premium.json"))
const bot = require("./bot")
const client = new bot()
const uplod = require("imgbb-uploader")
const ID3Writer = require('browser-id3-writer');
const ytdl = require("ytdl-core")
const yts = require("yt-search")
const Instagram = require('instagram-web-api');
const got = require("got");
const nau = "https://naufalhoster.xyz"
const ve = "https://vhtear.com"
const {
    createExif,
    modifExif,
    modifWebp
} = require("./lib/sticker")
const config = {
    username: "",
    password: ""
}
const {
    username,
    password
} = process.env;

const insta = new Instagram({
    username: config.username,
    password: config.password
});

const api = {
    vh: "291002juan",
    nf: "",
}
var color = (text, color) => {
    switch (color) {
        case 'red':
            return '\x1b[31m' + text + '\x1b[0m'
        case 'yellow':
            return '\x1b[33m' + text + '\x1b[0m'
        default:
            return '\x1b[32m' + text + '\x1b[0m'
    }
}
async function whatsapp() {
    const conn = new WAConnection()
    conn.on('qr', qr => {
        console.log('SCAN QR TAI');
        qrcode.generate(qr, {
            small: true
        });
    });
    conn.on('credentials-updated', () => {
        const authInfo = conn.base64EncodedAuthInfo()
        fs.writeFileSync('./data.json', JSON.stringify(authInfo, null, '\t'))
    })
    fs.existsSync('./data.json') && conn.loadAuthInfo('./data.json')
    conn.connect();

    conn.on('message-new', async (m) => {
        WA(conn, m, false)
    });
    //-----------------------util--------------------//

    String.prototype.format = function() {
        var a = this;
        for (var k in arguments) {
            a = a.replace(new RegExp("\\{" + k + "\\}", 'g'), arguments[k]);
        }
        return a
    }


    function waktu(seconds) {
        seconds = Number(seconds);
        var d = Math.floor(seconds / (3600 * 24));
        var h = Math.floor(seconds % (3600 * 24) / 3600);
        var m = Math.floor(seconds % 3600 / 60);
        var s = Math.floor(seconds % 60);
        var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
        var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
        return dDisplay + hDisplay + mDisplay + sDisplay;
    }

    function arrayRemove(arr, value) {
        return arr.filter(function(ele) {
            return ele != value;
        });
    }

    function sleep(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    function shuffle(arr) {
        let i = arr.length - 1;
        for (; i > 0; i--) {
            const j = Math.floor(Math.random() * i)
            const temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp
        }
        return arr;
    }

    function randomChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    async function WA(conn, m, asu) {
        try {
            const {
                messageStubParameters,
                labels,
                key,
                message,
                messageTimestamp,
                status,
                participant,
                ephemeralOutOfSync,
                epoch
            } = m

            if (!m.message) return
            if (m.key.id.startsWith("3EB0")) return
            const messageContent = JSON.stringify(m.message)
            const to = m.key.remoteJid
            m.message = (Object.keys(m.message)[0] === 'ephemeralMessage') ? m.message.ephemeralMessage.message : m.message
            if (!m.key.fromMe) return
            const {
                text,
                extendedText,
                contact,
                location,
                liveLocation,
                image,
                video,
                sticker,
                document,
                audio,
                product
            } = MessageType
            const prefix = "."
            const type = Object.keys(m.message)[0]
            const isUrl = (url) => {
                return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
            }
            let body = ""
            if (type == 'conversation') {
                body = m.message.conversation
            } else if (type == 'imageMessage') {
                body = m.message.imageMessage.caption
            } else if (type == 'videoMessage') {
                body = m.message.videoMessage.caption
            } else if (type == 'extendedTextMessage') {
                body = m.message.extendedTextMessage.text
            }
            body = body
            let txt = body.toLowerCase()
            let xyz = txt.startsWith("/")
            const arg = body.trim().substring(body.indexOf(' ') + 1)
            const args = body.slice().trim().split(/ +/).slice(1) || body.slice().trim().split(/ +/).slice(1)
            const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
            const jam = moment.tz('Asia/Jakarta').format('HH:mm')
            const isGroup = to.endsWith('@g.us')
            const AsyncFunction = Object.getPrototypeOf(async function() {}).constructor
            const isMedia = (type === 'imageMessage' || type === 'videoMessage')
            const isQuotedImage = type === 'extendedTextMessage' && messageContent.includes('imageMessage')
            const isQuotedVideo = type === 'extendedTextMessage' && messageContent.includes('videoMessage')
            const isQuotedSticker = type === 'extendedTextMessage' && messageContent.includes('stickerMessage')
            
            if ((txt.startsWith("!?sticker")) || (txt == "!?stiker")) {
                if (isMedia && !m.message.imageMessage || isQuotedVideo) {
                    const decryptMedia = isQuotedVideo ? JSON.parse(JSON.stringify(m).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : m
                    const mediaData = await conn.downloadMediaMessage(decryptMedia)
                    await createExif("WHATSAPP-BOT", "XyZ")
                    client.sendAnimatedSticker(conn, to, mediaData, jam, m)
                } else if (isMedia && !m.message.videoMessage || isQuotedImage) {
                    const decryptMedia = isQuotedImage ? JSON.parse(JSON.stringify(m).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : m
                    const mediaData = await conn.downloadMediaMessage(decryptMedia)
                    client.sendSticker(conn, to, mediaData, jam, m)
                } else if (body) {
                    const url = body.slice(9)
                    if (isUrl(url) && url) {
                        var names = Date.now() / 10000;
                        const get = await fetch(ve + "/line_sticker_download?link=" + url + "&apikey=" + api["vh"])
                        const json = await get.json()
                        const result = json.result
                        result["sticker"].map(async (y) => {
                            client.sendStickerFromUrl(conn, to, y, m)
                        })

                    } else {
                        client.reply(conn, to, "Harap Reply Salah Satu Video Atau Foto!, atau kirim sebuah url line", m)
                    }
                }

            } else if (txt.startsWith("!?doujin")) {
                const douj = body.slice(9)
                if (args.length < 1) throw "Harap Sertakan Kode nya!"
                client.sendDoujin(conn, to, douj, m)
            } else if (txt.startsWith("!?facebook")) {
                const url = body.slice(11)
                if (args.length < 1) throw "Masukan Url!"
                if (!isUrl(url) && !url.includes("facebook")) {
                    throw "Maaf Hanya Bisa Menggunakan Url Fb!"
                } else {
                    client.reply(conn, to, "_Sedang Memproses Video..._", m)

                    let videoObj;

                    try {
                        videoObj = await facebookTools.getVideoUrl(url);
                        console.log(videoObj)
                        const ten = await axios({
                            method: 'get',
                            url: videoObj.hdLink,
                            responseType: "arraybuffer"
                        })
                        conn.sendMessage(to, ten.data, 'videoMessage', {
                            mimetype: "video/mp4",
                            caption: '*Facebook Download*'
                        })
                    } catch (e) {}
                }
            } else if (txt.startsWith("!?audio")) {
                const bodi = body.slice(8)
                if (args.length < 1) throw "Harap Masukan Sebuah Url Atau Query!"
                if (isUrl(bodi) && bodi.includes("youtu")) {
                    let body = bodi.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
                    let su = body
                    let arama = su
                    client.reply(conn, to, 'Data ditemukan! tunggu sebentar, lagu sedang di unduh!', m)
                    let title = "output"
                    let stream = ytdl(arama, {
                        quality: 'highestaudio',
                    });
                    ffmpeg(stream).audioBitrate(320).save('./' + title + '.mp3').on('end', async () => {
                        const writer = new ID3Writer(fs.readFileSync('./' + title + '.mp3'));
                        let x = await ytdl.getBasicInfo(arama);
                        songData = await ytdl.getInfo(arama)
                        writer.addTag();
                        client.reply(conn, to, "*Youtube Audio*\n\nTitle: " + songData.videoDetails.title + "\nDurasi: " + songData.videoDetails.lengthSeconds + " Detik\nVideo Id: " + arama + "\nRatting: " + songData.player_response.videoDetails.averageRating + "\nAuthor: " + songData.videoDetails.author.name, m)
                        await sleep(1000)
                        await client.sendAudio(conn, to, Buffer.from(writer.arrayBuffer), m)
                    });
                } else {
                    let arama = await yts(body.slice(8));
                    arama = arama.all;
                    if (arama.length < 1) throw "Data " + body.slice(8) + " tidak ditemukan!"
                    client.reply(conn, to, 'Data ditemukan! tunggu sebentar, lagu sedang di unduh!', m)
                    let title = "output"
                    let stream = ytdl(arama[0].videoId, {
                        quality: 'highestaudio',
                    });
                    got.stream(arama[0].image).pipe(fs.createWriteStream(title + '.jpg'));
                    ffmpeg(stream).audioBitrate(320).save('./' + title + '.mp3').on('end', async () => {
                        const writer = new ID3Writer(fs.readFileSync('./' + title + '.mp3'));
                        writer.setFrame('TIT2', arama[0].title).setFrame('TPE1', [arama[0].author.name]).setFrame('APIC', {
                            type: 3,
                            data: fs.readFileSync(title + '.jpg'),
                            description: arama[0].description
                        });
                        songData = await ytdl.getInfo(arama[0].videoId)
                        writer.addTag();
                        client.sendImage(conn, to, fs.readFileSync(title + ".jpg"), "*Youtube Audio*\n\nTitle: " + arama[0].title + "\nDurasi: " + songData.videoDetails.lengthSeconds + " Detik\nVideo Id: " + arama[0].videoId + "\nRatting: " + songData.player_response.videoDetails.averageRating + "\nAuthro: " + songData.videoDetails.author.name + "\nDescriptions: " + arama[0].description, m)
                        await client.sendAudio(conn, to, Buffer.from(writer.arrayBuffer), m)
                    });
                }
            } else if (txt.startsWith("!?logininsta")) {
                await insta.login()
                const me = await insta.getUserByUsername({
                    username: insta.credentials.username
                })
                console.log(me)
                client.sendImageFromUrl(conn, to, me.profile_pic_url_hd, 'Succses Login As *' + me["full_name"] + '*', m)
            } else if (txt.startsWith("!?logoutinsta")) {
                await insta.logout()
                client.reply(conn, to, 'succses logout!', m)
            } else if (txt.startsWith("!?upinstastory")) {
                if (isMedia && !m.message.videoMessage || isQuotedImage) {
                    const bud = body.slice(12)
                    const decryptMedia = isQuotedImage ? JSON.parse(JSON.stringify(m).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : m
                    const mediaData = await conn.downloadAndSaveMediaMessage(decryptMedia)

                    const photo = await uplod("8b912de52a71d57f207340a097349cf8", mediaData)
                    const media = photo.url
                    console.log(media)
                    await insta.uploadPhoto({
                        photo: media,
                        caption: bud,
                        post: 'story'
                    })
                    client.reply(conn, to, "Succses update Status di instagram!", m)
                } else {
                    throw 'Reply Atau Kirim Foto Dengan Caption *!?upinstastory*'
                }
            } else if (txt.startsWith("!?video")) {
                const bodi = body.slice(8)
                if (args.length < 1) throw "Harap Masukan Sebuah Url Atau Query!"
                if (isUrl(bodi) && bodi.includes("youtu")) {
                    let body = bodi.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
                    let su = body
                    let arama = su
                    client.reply(conn, to, 'Data ditemukan! tunggu sebentar, lagu sedang di unduh!', m)
                    let title = "output"
                    let stream = ytdl(arama, {
                        filter: format => format.container === 'mp4',
                    });
                    ffmpeg(stream).save('./' + title + '.mp4').on('end', async () => {
                        const writer = new ID3Writer(fs.readFileSync('./' + title + '.mp4'));
                        let x = await ytdl.getBasicInfo(arama);
                        songData = await ytdl.getInfo(arama)
                        writer.addTag();
                        client.reply(conn, to, "*Youtube Video*\n\nTitle: " + songData.videoDetails.title + "\nDurasi: " + songData.videoDetails.lengthSeconds + " Detik\nVideo Id: " + arama + "\nRatting: " + songData.player_response.videoDetails.averageRating + "\nAuthor: " + songData.videoDetails.author.name, m)
                        await sleep(1000)
                        await client.sendVideo(conn, to, fs.readFileSync("./output.mp4"), songData.videoDetails.title, m)
                    });
                } else {
                    let arama = await yts(body.slice(8));
                    arama = arama.all;
                    if (arama.length < 1) throw "Data " + body.slice(8) + " tidak ditemukan!"
                    client.reply(conn, to, 'Data ditemukan! tunggu sebentar, lagu sedang di unduh!', m)
                    let title = "output"
                    let stream = ytdl(arama[0].videoId, {
                        filter: format => format.container === 'mp4',
                    });
                    got.stream(arama[0].image).pipe(fs.createWriteStream(title + '.jpg'));
                    ffmpeg(stream).audioBitrate(320).save('./' + title + '.mp4').on('end', async () => {
                        const writer = new ID3Writer(fs.readFileSync('./' + title + '.mp4'));
                        writer.setFrame('TIT2', arama[0].title).setFrame('TPE1', [arama[0].author.name]).setFrame('APIC', {
                            type: 3,
                            data: fs.readFileSync(title + '.jpg'),
                            description: arama[0].description
                        });
                        songData = await ytdl.getInfo(arama[0].videoId)
                        writer.addTag();
                        client.sendImage(conn, to, fs.readFileSync(title + ".jpg"), "*Youtube Audio*\n\nTitle: " + arama[0].title + "\nDurasi: " + songData.videoDetails.lengthSeconds + " Detik\nVideo Id: " + arama[0].videoId + "\nRatting: " + songData.player_response.videoDetails.averageRating + "\nAuthro: " + songData.videoDetails.author.name + "\nDescriptions: " + arama[0].description, m)
                        await client.sendVideo(conn, to, fs.readFileSync("./output.mp4"), songData.videoDetails.title, m)
                    });
                }

            }

        } catch (err) {
            console.log(err)
            client.reply(conn, m.key.remoteJid, "*Message:*\n" + err, m)
        }
    }
}

whatsapp().catch((err) => console.log(`encountered error: ${err}`))