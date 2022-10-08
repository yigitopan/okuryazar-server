const fetch = require("isomorphic-fetch")
const cheerio = require("cheerio")

const getContent = async(req, res, next) => {
    const newspaper = req.params.newspaper


//// --MILLIYET-- Codesequenz, um die Daten einer Nachricht, deren Link bestimmt ist, aufzurufen --MILLIYET-- ////
    if(newspaper === "milliyet") {
            const response = await fetch(
                'http://www.milliyet.com.tr/ekonomi/memur-sen-genel-baskani-ali-yalcindan-onemli-aciklamalar-6837129'
            );
            const text = await response.text();
            const $ = cheerio.load(text);
            var content = ""

            $('.nd-content-column p').each((i,p)=>{
                content = content.concat($(p).text().trim());
            });

            var newsObject = 
            {
                title: $('h1.nd-article__title').text(),
                spot: $('h2.nd-article__spot').text(),
                date: $('.nd-article__info-block').first().contents().filter(function() {
                    return this.type === 'text';
                }).text().substring(0,8),
                
                image: $('.nd-article__spot-img').find('img').attr('data-src'),
                content
            }
    }
//// --MILLIYET-- Codesequenz, um die Daten einer Nachricht, deren Link bestimmt ist, aufzurufen --MILLIYET-- ////





//// --SABAH-- Codesequenz, um die Daten einer Nachricht auf, deren Link bestimmt ist, aufzurufen --SABAH-- ////
    else if (newspaper === "sabah") {
        const response = await fetch(
            'https://www.sabah.com.tr/gundem/2022/10/07/son-dakika-mansur-yavastan-ankarada-tum-su-tarifelerine-yuzde-50-indirim-getiren-karara-veto?paging=2'
        );
        const text = await response.text();
        const $ = cheerio.load(text);
        var scripts = ""
        var mainScript = ""
        var content = ""
        var spot = ""

        $('script').each((idx, script) => {
            scripts = scripts.concat($(script).text());
            if($(script).text().includes('NewsArticle')) {
                mainScript = $(script).text()
            }
        });

        scripts =  scripts.split(`NewsArticle"`).pop().split(`keywords`)[0].trim(); // returns 'two'

        content =  scripts.split(`articleBody`).pop().split(`description`)[0].trim();  // returns 'two'
        spot =  scripts.split(`description`).pop().split(`articleBody`)[0].trim();  // returns 'two'

        $('.newsBox.selectionShareable p').each((i ,p)=>{
            content = content.concat($(p).text());
        });

        var newsObject = 
        {
            title: $('figure.newsImage img').attr('alt'),
            spot,
            date: $('.news-detail-info span span').first().text(),
            image: $('figure.newsImage').find('img').attr('src'),
            content
        }

        
    }
//// --SABAH-- Codesequenz, um die Daten einer Nachricht, deren Link bestimmt ist, aufzurufen --SABAH-- ////




//// --SOZCU-- Codesequenz, um die Daten einer Nachricht auf, deren Link bestimmt ist, aufzurufen --SOZCU-- ////
else if (newspaper === "sozcu") {
    const response = await fetch(
        'https://www.sozcu.com.tr/2022/gundem/esi-ile-cocugunu-olduren-kisi-yakalanacagini-anlayinca-intihar-etti-7407389/?utm_source=anasayfa&utm_medium=free&utm_campaign=alt_surmanset'
    );
    const text = await response.text();
    const $ = cheerio.load(text);

    var content = ""

    $('article p').each((i,p)=>{
        content = content.concat($(p).text().trim());
    });


    var newsObject = 
    {
        title: $('article').find('h1').first().text(),
        spot: $('h2.spot').text(),
        date: $('div.content-meta-dates span.content-meta-date').first().text(),
        image: $('.img-holder').find('img').attr('src'),
        content
    }
}
//// --SOZCU-- Codesequenz, um die Daten einer Nachricht, deren Link bestimmt ist, aufzurufen --SOZCU-- ////


    res.status(200).json({data:newsObject});
}

module.exports = {
    getContent
}