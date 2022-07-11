var edit_panel = $("#edit-actions");
var btn_add_test_point = $("#btn-test-termo-point");

edit_panel.append('<div id="dashboard-panel" class="dashboard-panel"></div>');

var dashboard_panel = $("#dashboard-panel");
dashboard_panel.append('<a id="btn-test-termo-point" class="main-btn btn-white noselect" title="Тестовая термическая точка">Тестовая</a>');
dashboard_panel.append('<a id="btn-test-danger" class="main-btn btn-white noselect" title="Вызвать панель">Alert-Панель</a>');
dashboard_panel.append('<a id="btn-test-siren-play" class="main-btn btn-white noselect" title="Проиграть сирену">Alert Siren Play</a>');
dashboard_panel.append('<a id="btn-test-siren-stop" class="main-btn btn-white noselect" title="Остановить сирену">Alert Siren Stop</a>');


// Добавить тестовую строку
$("#btn-test-termo-point").click(function () {

    let table = $('.tabulator-table');
    table.show();
    $('.tabulator-placeholder').hide();

    table.css({display: "block"});
    table.append('' +
        '<div class="tabulator-row text-center" style="background-color: #4d535e!important;">' +
        '<span class="demo">Тестовая термическая точка</span>' +
        '</div>');

    // $('div[tabulator-field="number"] > a').each(function () {
    //     // var i = $(this).attr('id');
    //     let i = $(this).text();
    //     console.log(i);
    // });

    // alert($(".tabulator-table > .tabulator-row").length);

});

$("#btn-test-danger").click(function () {
    $('.alert-panel').show();
});

$("#btn-test-siren-play").click(function () {
    audioNotification('play')
});

$("#btn-test-siren-stop").click(function () {
    audioNotification('stop')
});


// shortcut.add("alt+s", function() {
//     // Do something
// });

shortcut.add("alt+v", function () {
    // dashboard_panel.show();
    $('#dashboard-panel').css('display', 'inherit');
});

shortcut.add("alt+b", function () {
    // dashboard_panel.hide();
    $('#dashboard-panel').css('display', 'hide');
});