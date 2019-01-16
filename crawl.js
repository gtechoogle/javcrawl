var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var path = require('path'); //系统路径模块
var base_url = 'https://www.javbus.com/'
var modelLink = new Array()

var proxyUrl = "http://127.0.0.1:63187";

var proxiedRequest = request.defaults({ 'proxy': proxyUrl });

var jsondata = []

fs.access('images', (err) => {
    if (err) {
        console.log('images folder not exist, create one')
        fs.mkdir('images')
    }
});
// request(url).pipe((fs.createWriteStream('suren.html')));


function openPage(url) {
    proxiedRequest(url, function(error, res, body) {
        if (!error && res.statusCode == 200) {
            console.log('----------------------')
            var $ = cheerio.load(body)
            $("a.movie-box").each(function(index, ele) {
                openDetailPage($(this).attr('href'))
            })
            next = $("#next").attr('href')
            console.log(next)
            if (next == '/page/3') {
                write_json_data(jsondata)
                return;
            }
            openPage(base_url + next)
        } else {
            console.log('============================')
            console.log(error)
        }
    })
}

function openDetailPage(url) {
    proxiedRequest(url, function(error, res, body) {
        if (!error && res.statusCode == 200) {
            var $ = cheerio.load(body)
            img_url = $('a.bigImage').attr('href')
            console.log(img_url)
            actor_name = $('span.genre').children()
            name = $(actor_name[actor_name.length - 1]).text()
            console.log(name)
            descp = $('h3').text()
            console.log(descp)
            $("span").each(function(index, ele) {
                var stylevalue = $(this).attr('style')
                if (typeof(stylevalue) != "undefined" && stylevalue == 'color:#CC0000;') {
                    img_title = $(this).text()
                    console.log(img_title)
                        // savedImg(img_url, img_title)
                    var tmp = {
                        imageurl: img_url,
                        id: img_title,
                        des: descp,
                        actor: [
                            name
                        ]
                    }
                    jsondata.push(tmp)
                }
            })
        }
    })
}

function savedImg(url, news_title) {
    var img_filename = news_title + '.jpg';
    proxiedRequest(url).pipe(fs.createWriteStream('images/' + img_filename))
}

function get_model_main_page($) {
    var icons = $('.rankli_imgdiv').find('a')
    icons.each(function(index, ele) {
        var href = $(this).attr('href')
        modelLink.push(rank_url + href)
    })
}

function get_next_page_data(url) {
    request(url, function(error, res, body) {
        var $ = cheerio.load(body)
        get_model_main_page($)
    })
}
openPage(base_url)

function write_json_data(data) {
    console.log(data)
    var content = JSON.stringify(data);
    var file = path.join(__dirname, 'data/test.json');
    fs.writeFile(file, content, function(err) {
        if (err) {
            return console.log(err);
        }
        console.log('create file:' + file);
    });

}