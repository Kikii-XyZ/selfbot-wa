const {
    WAConnection,
    MessageType,
    Presence,
    MessageOptions,
    Mimetype,
    WALocationMessage,
    WA_MESSAGE_STUB_TYPES,
    ReVHectMode,
    ProxyAgent,
    waChatKey
} = require("@adiwajshing/baileys");
const sharp = require("sharp")
const request = require('request')
const ffmpeg = require("fluent-ffmpeg")
const https = require('https');
const {
    createExif,
    modifExif,
    modifWebp
} = require("./lib/sticker")
const {
    spawn,
    exec,
    execSync
} = require("child_process");
const http = require('http');
const fs = require("fs")
const nhentai = require('nhentai')
const imgToPDF = require('image-to-pdf')
class bot {
    constructor() {
        try {



            this.sendText = function sendText(conn, jid, message) {
                conn.sendMessage(jid, message, MessageType.text)
            }
            this.reply = function reply(conn, jid, message, m) {
                conn.sendMessage(jid, message, MessageType.text, {
                    quoted: m
                })
            }

            this.sendPtt = function sendPtt(conn, jid, audio, m) {
                conn.sendMessage(jid, audio, MessageType.audio, {
                    quoted: m,
                    ptt: true
                })
            }
            this.sendAudio = function sendAudio(conn, jid, audio, m) {
                conn.sendMessage(jid, audio, MessageType.audio, {
                    quoted: m,
                    mimetype: "audio/mp4",
                    filename: Date.now() + ".mp3"
                })
            }
            this.sendImage = function sendImage(conn, jid, image, caption, m) {
                conn.sendMessage(jid, image, MessageType.image, {
                    quoted: m,
                    caption: caption,
                    mimetype: Mimetype.png
                })
            }
            this.sendVideo = function sendVideo(conn, jid, video, caption, m) {
                conn.sendMessage(jid, video, MessageType.video, {
                    quoted: m,
                    caption: caption,
                    mimetype: "video/mp4"
                })
            }
            this.sendImageFromUrl = function sendImageFromUrl(conn, jid, url, caption, m) {
                var names = Date.now() / 10000;
                var download = function(uri, filename, callback) {
                    request.head(uri, function(err, res, body) {
                        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
                    });
                };
                download(url, './media/' + names + '.jpeg', async function() {
                    console.log('done');
                    let media = fs.readFileSync('./media/' + names + '.jpeg')
                    await conn.sendMessage(jid, media, MessageType.image, {
                        quoted: m,
                        mimetype: Mimetype["png"],
                        caption: caption
                    })
                });
            }
            this.sendSticker = function sendSticker(conn, jid, sticker, jam, m) {
                sharp(sticker).resize({
                    width: 512,
                    height: 512,
                    fit: sharp.fit.contain,
                    background: {
                        r: 0,
                        g: 0,
                        b: 0,
                        alpha: 0
                    }
                }).webp().toBuffer().then(buffer => {
                    modifExif(buffer, jam, (res) => {
                        conn.sendMessage(jid, res, MessageType.sticker, {
                            quoted: m,
                        })
                    })
                })
            }
            this.sendAnimatedSticker = function sendAnimatedSticker(conn, jid, sticker, jam, m) {
                modifWebp(jam, sticker).then(res => {
                    conn.sendMessage(jid, res, MessageType.sticker, {
                        thumbnail: fs.readFileSync("./undefined.jpeg"),
                        quotedMessage: {
                            imageMessage: sticker,
                            conversation: ':v'
                        },
                        quoted: m,
                    })
                })
            }
            this.sendAudioFromUrl = function sendAudioFromUrl(conn, jid, url, caption, m) {
                var names = Date.now() / 10000;
                var download = function(uri, filename, callback) {
                    request.head(uri, function(err, res, body) {
                        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
                    });
                };
                download(url, './media/' + names + '.mp3', async function() {
                    console.log('done');
                    let media = fs.readFileSync('./media/' + names + '.mp3')
                    await conn.sendMessage(jid, media, MessageType.audio, {
                        mimetype: 'audio/mp4',
                        quoted: m,
                        caption: caption
                    })
                });
            }
            this.sendVideoFromUrl = function sendVideoFromUrl(conn, jid, url, caption, m) {
                var names = Date.now() / 10000;
                var download = function(uri, filename, callback) {
                    request.head(uri, function(err, res, body) {
                        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
                    });
                };
                download(url, './media/' + names + '.mp3', async function() {
                    console.log('done');
                    let media = fs.readFileSync('./media/' + names + '.mp3')
                    conn.sendMessage(jid, media, MessageType.video, {
                        mimetype: 'video/mp4',
                        quoted: m,
                        caption: caption
                    })

                });
            }
            this.sendStickerFromUrl = function sendStickerFromUrl(conn, jid, url, m) {
                var names = Date.now() / 10000;
                var download = function(uri, filename, callback) {
                    request.head(uri, function(err, res, body) {
                        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
                    });
                };

                download(url, './media/' + names + '.png', async function() {
                    console.log('done');
                    let filess = './media/' + names + '.png'
                    let asw = './media/' + names + '.webp'
                    exec(`ffmpeg -i ${filess} -vcodec libwebp -filter:v fps=fps=20 -lossless 1 -loop 0 -preset default -an -vsync 0 -s 512:512 ${asw}`, (err) => {
                        let media = fs.readFileSync(asw)
                        conn.sendMessage(jid, media, MessageType.sticker, {
                            quoted: m
                        })
                    });
                });
            }
            this.hitungMundur = function hitungMundur(ms) {
                let seconds = ms / 1000;
                let days = parseInt(seconds / 86400);
                seconds = seconds % 86400;
                let hours = parseInt(seconds / 3600);
                seconds = seconds % 3600;
                let minutes = parseInt(seconds / 60);
                seconds = parseInt(seconds % 60);

                if (days) {
                    return `${days} Hari, ${hours} Jam, ${minutes} Menit`;
                } else if (hours) {
                    return `${hours} Jam, ${minutes} Menit, ${seconds} Detik`;
                } else if (minutes) {
                    return `${minutes} Menit, ${seconds} Detik`;
                }
                return `${seconds} Detik`;
            };
            this.sendDoujin = function sendDoujin(conn, toId, kode, m) {
                let to = toId
                let id = kode
                var names = Date.now() / 10000;
                var download = function(uri, filename, callback) {
                    request.head(uri, function(err, res, body) {
                        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
                    });
                };
                download("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTTn02ntvz4OY8s1o4p_rdA32GV0oUOMFc3Q&usqp=CAU", './media/' + names + '.mp4', async function() {
                    let download_count = 0
                    let PDFpages = []
                    try {
                        const api = new nhentai.API()
                        const doujin = await api.fetchDoujin(kode)
                        const pages_array = doujin.pages
                        const title = doujin.titles.pretty.replace("|", " ", "")
                        conn.sendMessage(toId, 'Downloading: \n*' + title + '*', MessageType.text, {
                            quoted: m
                        })
                        conn.sendMessage(toId, '_Please wait!_', MessageType.text, {
                            quoted: m
                        })

                        for (let index = 0; index < pages_array.length; index++) {
                            const image_name = 'nhentai/' + title + index + '.jpg'
                            await new Promise((resolve) => request(pages_array[index]).pipe(fs.createWriteStream(image_name)).on('finish', resolve))
                            console.log(pages_array[index].url)
                            PDFpages.push(image_name)
                            download_count++
                        }
                        await new Promise((resolve) =>
                            imgToPDF(PDFpages, 'A4')
                            .pipe(fs.createWriteStream('nhentai/' + title + '.pdf'))
                            .on('finish', resolve)
                        )

                        const pdfsize = await fs.statSync('nhentai/' + title + '.pdf').size
                        if (pdfsize < 95000000) {
                            conn.sendMessage(toId, 'Uploading', MessageType.text, {
                                quoted: m
                            })
                            await conn
                                .sendMessage(toId, fs.readFileSync('nhentai/' + title + '.pdf'), MessageType.document, {
                                    mimetype: Mimetype.pdf,
                                    filename: title + ".pdf"
                                })
                                .then((result) => {
                                    fs.unlink('nhentai/' + title + '.pdf', (err) => {
                                        if (err) throw err
                                    })
                                })
                                .catch((erro) => {
                                    console.error('Error when sending: ', erro) //return object error
                                })
                        } else {
                            conn.sendMessage(toId, 'Menunggu upload ke whatsapp!', MessageType.text, {
                                quoted: m
                            })
                            const options = {
                                method: 'POST',
                                url: 'https://api.anonfiles.com/upload',
                                formData: {
                                    file: fs.createReadStream('nhentai/' + title + '.pdf'),
                                },
                            }

                            request(options, function(err, res, body) {
                                if (err) console.log(err)
                                fs.unlink('nhentai/' + title + '.pdf', (err) => {
                                    if (err) throw err
                                })
                                conn.sendMessage(to, 'Link to File: ' + JSON.parse(body).data.file.url.full)
                            })
                        }
                    } catch (error) {
                        if (error.status == 404) {
                            conn.sendMessage(to, 'Nhentai ga ditemukan', MessageType.text, {
                                quoted: m
                            })
                            console.log('No Dōjinshi found')
                        } else {
                            console.log(error)
                        }
                    }
                })
            }
        } catch (err) {
            console.log(err)
        }
    }
}
module.exports = bot;