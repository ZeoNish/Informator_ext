var path = location.pathname.substring(1);
var url = path.split("/");

var tp = 'thermal-point';
var tp_reg = 'registry';
var tp_url_user = 'user';

// Интервал для таймера
var delay = 200;

// Кнопка Clear
var btn_clear = $("#btn-clear").click();

// Кнопка фильтра
var btn_filter = $("#btn-filter").click();

/////////////////////////////////////////////////////
// document.addEventListener('click', () => {})
/////////////////////////////////////////////////////

const edds_arr = {
    'edds11': 'ЕДДС Красногвардейского округа',
    // '': '',
    // Любая почта до символа @ в формате - 'Идентификатор' : 'Выводимый текст',
};
let edds_email = $('#dropdownMenuUser').text();
let edds_cut = edds_email.split('@');
let header = '';

if (edds_arr[edds_cut[0]]) {
    $('.header__user').append('<p class="text-center">' + edds_email + '</p>');
    $('#dropdownMenuUser').text(edds_arr[edds_cut[0]]);
    header = edds_arr[edds_cut[0]];
}

/* ------------------------------------------------------------------------------- */

// Страница термических точек
if (url[0] == tp) {
    if (url[1] == tp_reg) {

        $("#filter-form").append('<div id="label-informator" class="label-informator noselect">'
            + header + '</div>');

        $("#edit-actions").append('<a id="btn-reload" class="main-btn btn-white noselect">Обновить</a>');

        // $("#edit-actions").append('<a id="btn-play" class="main-btn btn-white noselect"> &#9193; </a>');
        // $("#edit-actions").append('<a id="btn-stop" class="main-btn btn-white noselect"> &#11035; </a>');

        $("#edit-actions").append('' +
            '<div class="points__filter-status bg-warning pause" id="btn-pause">' +
            '<span class="points__filter-status-type nobefore p-0 color-white" title="Пауза"> &#10074;&#10074; </span>' +
            '</div>');

        $("#edit-actions").append('' +
            '<div class="points__filter-status bg-success play" id="btn-play">' +
            '<span class="badge badge-danger badge-sm">Не забудьте запустить оповещение</span>' +
            '<span class="points__filter-status-type nobefore p-0 color-white" title="Запустить"> &#9658; </span>' +
            '</div>');

        // Оповещение включено - Индикатор
        $("#edit-actions").append('' +
            '<a id="marker-notifi" class="main-btn btn-dark noselect marker-notifi" title="Нажмите что бы продолжить оповещение">' +
            '<span id="bar" class="bar"></span>' +
            '<p class="color-white">Идет оповещение</p>' +
            '</a>');
        $("body").append('' +
            '<div class="alert-panel color-white noselect">' +
            '<span class="alert-text noselect">ВНИМАНИЕ</span>' +
            '<a class="alert-btn">СТОП</a>' +
            '<div class="line-1"></div><div class="line-2"></div><div class="line-3"></div><div class="line-4"></div>' +
            '</div>');

        // Добавить тег audio в дерево сайта
        $("body").append('<audio id="alert_audio" loop><source id="alert_source" src="" type="audio/mpeg"></audio>');

        // Добавляем путь к аудио файлу
        $('#alert_source').attr('src', chrome.runtime.getURL('sound/sound_siren.mp3'));

        // Добавить текст в список термических точек
        $('.tabulator-placeholder span').text('Термических точек нет');
        $('.tabulator-placeholder span').addClass('no_termo');

        // ~~~~~ Обработка Кликов - START
        // Клик по кнопке "СТОП"
        $(".alert-btn").click(function () {
            $('.alert-panel').hide();
            audioNotification('stop');

            pause_on();
            remove_class_new_active();
            clear_all();
        });

        // Клик по кнопке "перезагрузки"
        $("#btn-reload").click(function () {
            document.location.reload(true);
        });

        // Клик по кнопке "Пауза"
        $("#btn-pause").click(function () {
            remove_class_new_active();
            pause_on();
        });

        $("#btn-play, #marker-notifi").click(function () {
            pause_off();
            $('a[data-status="new"] span').click();
        });

        // ~~~~~~~~~~~~~~~~~~~~~~~~

        // Клик по вкладке "Новые" (Перехват)
        $('a[data-status="new"]').click(function () {
            pause_off();
        });

        // Клик по вкладкам "В работе" "Проверенные" "Все" (Перехват)
        $('a[data-status="work"], a[data-status="done"], a[data-status="all"]').click(function () {
            pause_on();
        });
        // ~~~~~ Обработка Кликов - END

        // ~~~~~ Функции - START
        function audioNotification(action) {

            if (action === 'play') {
                $('#alert_audio')[0].play();
            }

            if (action === 'stop') {
                $('#alert_audio')[0].pause();
                $('#alert_audio')[0].currentTime = 0;
            }
        }

        function pause_on() {

            // Индикация
            $('#btn-play').css('display', 'inherit');
            $('#btn-pause').css('display', 'none');

            $('#marker-notifi').addClass('off');
            $('#marker-notifi p').text('Остановлено');
        }

        function pause_off() {

            $('#btn-play').css('display', 'none');
            $('#btn-pause').css('display', 'inherit');

            $('#marker-notifi').removeClass('off');
            $('#marker-notifi p').text('Идет оповещение');

            // clear_all();
        }

        function clear_all() {
            btn_clear.click();
            btn_filter.click();
        }

        function remove_class_new_active() {
            $('a[data-status="new"]').removeClass("active");
        }

        function get_first_termo_list() {

            let arr = [];
            $('div.tabulator-cell[tabulator-field="number"] > a').each(function () {
                // let i = $(this).text();
                let i = $(this).attr('href');
                arr.push(i);
                // console.log(i);
            });

            chrome.storage.local.set({points: arr}, function () {
            });

        }

        function get_termo_list() {

            let results = ['3', '4'];
            chrome.storage.local.get('points', function (items) {

                results.forEach(function (entry) {
                    items.points.push(entry);
                });

                chrome.storage.local.set({points: items.points}, function () {
                    chrome.storage.local.get('points', function (result) {
                        console.log(result)
                    });
                });

            });

        }

        // Таймер автоматического обновления списка термических точек
        function move() {

            $('#btn-pause').css('display', 'inherit');

            $('#btn-stop').removeClass('d-none');


            if (!$('a[data-status="new"]').hasClass("active")) {
                pause_on()
            }

            let i = 0;
            if (i == 0) {
                i = 1;
                let elem = document.getElementById("bar");
                let width = 1;
                let id = setInterval(frame, delay);

                function frame() {
                    if (width >= 100) {
                        clearInterval(id);
                        i = 0;

                        // if ($(".points__filter-statuses > .points__filter-status:first-child").hasClass("active")) {
                        if ($('a[data-status="new"]').hasClass("active")) {
                            // Обновляем список точек - Принудительно
                            clear_all();

                            // Таймер по кругу
                            move();
                            Timer();
                        }

                    } else {

                        // if ($(".points__filter-statuses > .points__filter-status:first-child").hasClass("active")) {
                        if ($('a[data-status="new"]').hasClass("active")) {
                            width++;
                            elem.style.width = width + "%";
                        }

                    }
                }
            }
        }

        // Функция для таймера
        function Timer() {

            // Считаем кол-во TR в таблице
            let count_termopoints_now = $(".tabulator-table > .tabulator-row").length;
            let arr = [];

            if (count_termopoints_now > 0) {

                if ($('a[data-status="new"]').hasClass("active")) {

                    // Показать кнопку СТОП
                    $('.alert-panel').show();

                    // Проиграть сирену
                    audioNotification('play');

                    $('a[data-status="new"]').removeClass('active');

                    // $('a#count-t').text(count_termopoints_now);

                } else {
                    $('.tabulator-placeholder span').text('Термических точек нет');
                    $('.tabulator-placeholder span').addClass('no_termo');
                }
            }
        }

        /////////////////////////////////// ЗАПУСК ///////////////////////////////////
        move();

    }
}

// Страница термической точки
if (url[0] == tp) {

    if (isInteger(parseInt(url[1]))) {
        // $(".point-detail__map").prepend('<a class="btn-termo">&#8250;</a>');
        // $(".point-detail__info").prepend('<div class="btn-termo">&#8249;</div>');
    }

    if (isInteger(parseInt(url[1])) && url[2] !== 'edit') {

        // Табы
        $(".point-detail__map").prepend('<div class="tabs tabs-btns"><ul class="tab-links"><li class="active"><a id="map-id-mchs" href="#tab1">Карта МЧС</a></li><li><a id="map-id-yandex" href="#tab2">Карта Яндекс</a></li></ul></div>');

        $(".point-detail__map").append('<div class="tabs"><div class="tab-content"><div id="tab1" class="tab active"></div><div id="tab2" class="tab"></div></div></div>');

        $(".mapboxgl-container").detach().appendTo('#tab1');

        var script = document.createElement('script');
        script.src = "https://api-maps.yandex.ru/2.1/?apikey=baca7dec-3714-4c0a-b4de-b3ba91aab08a&lang=ru_RU";
        script.onload = function () {
            var script = document.createElement('script');

            script.textContent = '(' + function () {

                ymaps.ready(init);

                var latitude = document.getElementById('latitude').innerText;
                var longitude = document.getElementById('longitude').innerText;

                var termo_name = document.getElementById('block-firenotification-page-title').children[0].innerText;

                function init() {
                    var
                        // geolocation = ymaps.geolocation,
                        myMap = new ymaps.Map("tab2", {
                            center: [latitude, longitude],
                            zoom: 10,
                            controls: ['zoomControl', 'typeSelector', 'fullscreenControl', 'rulerControl']
                        }, {
                            suppressMapOpenBlock: true
                        });

                    myMap.geoObjects
                        .add(new ymaps.Placemark([latitude, longitude], {
                            balloonContent: '<strong>' + termo_name + '</strong>'
                        }, {
                            preset: 'islands#blueAttentionCircleIcon',
                            iconColor: '#ff0000'
                        }));

                    // ГЕОЛОКАЦИЯ ПО IP
                    // Сравним положение, вычисленное по ip пользователя и
                    // положение, вычисленное средствами браузера.
                    /*
                    geolocation.get({
                        provider: 'yandex',
                        mapStateAutoApply: true

                    }).then(function (result) {
                        // Красным цветом пометим положение, вычисленное через ip.
                        result.geoObjects.options.set('preset', 'islands#redCircleIcon');
                        result.geoObjects.get(0).properties.set({
                            balloonContentBody: 'Мое местоположение'
                        });
                        myMap.geoObjects.add(result.geoObjects);
                    });
                    geolocation.get({
                        provider: 'browser',

                        mapStateAutoApply: true

                    }).then(function (result) {
                        // Синим цветом пометим положение, полученное через браузер.
                        // Если браузер не поддерживает эту функциональность, метка не будет добавлена на карту.
                        result.geoObjects.options.set('preset', 'islands#blueCircleIcon');
                        myMap.geoObjects.add(result.geoObjects);
                    });
                    */
                }

            } + ')()';
            document.head.appendChild(script);
        };

        document.head.appendChild(script);

        $(document).ready(function () {
        });

        //
        $('.tabs .tab-links a').on('click', function (e) {
            var currentAttrValue = jQuery(this).attr('href');

            // Show/Hide Tabs
            $('.tabs ' + currentAttrValue).show().siblings().hide();

            // Change/remove current tab to active
            $(this).parent('li').addClass('active').siblings().removeClass('active');

            e.preventDefault();
        });


        // let arr = $('.copied-element').attr('data-clipboard-text');
        // if (arr) {
        //     var res = arr.split(", ");
        //     var parr = $('.copied-element').parent();
        //
        //     parr.append('<a href="https://yandex.ru/maps/?ll=' + res[1] + '%2C' + res[0] + '&mode=search&sll=4.000000%2C5.000000&sspn=0.119734%2C0.070152&text=' + res[0] + '%2C%20' + res[1] + '&z=12" target="_blank" class="btn btn-sm btn-coords btn-danger view-in-map">ПОКАЗАТЬ НА КАРТЕ</a>');
        // }
    }

    if (url[2] == 'edit') {
        $('#edit-owner-0-value').attr('placeholder','Собственник земель');
        $('#edit-owner-phone-0-value').attr('placeholder','Телефон');
        $('#edit-unit-0-value').attr('placeholder','Подразделение');
        $('#edit-person-count-0-value').attr('placeholder','Сколько человек личного состава');
        $('#edit-technic-count-0-value').attr('placeholder','Сколько единиц техники');
        $('#edit-comment-0-value').attr('placeholder','Дополнительный комментарий');
        $("#edit-actions").addClass('fix-edit-actions');
    }

}

if (url[2]) {
    $("#map-id-yandex").hide();
} else {
    $("#map-id-yandex").show();
}
/* ------------------------------------------------------------------------------- */

// ---------------------------------------------------------

function isInteger(num) {
    return (num ^ 0) === num;
}

// ---------------------------------------------------------

let manifestData = chrome.runtime.getManifest();

$(".header__logo span").html('<span>Информатор</span>');
$(".header__logo").append('<span>[Версия : ' + manifestData.version + ']</span>');
$('.header__logo img').attr('src', chrome.runtime.getURL('images/icon.png'));