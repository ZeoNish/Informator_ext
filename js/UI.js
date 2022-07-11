document.addEventListener('DOMContentLoaded', function () {

    let d = new Date();
    document.getElementById("day").innerHTML = d.getDate();

    let month = new Array();
    month[0] = "Январь";
    month[1] = "Февраль";
    month[2] = "Март";
    month[3] = "Апрель";
    month[4] = "Май";
    month[5] = "Июнь";
    month[6] = "Июль";
    month[7] = "Август";
    month[8] = "Сентябрь";
    month[9] = "Окрябрь";
    month[10] = "Ноябрь";
    month[11] = "Декабрь";
    document.getElementById("month").innerHTML = month[d.getMonth()];

    $("#screen").click(function(){
        chrome.runtime.sendMessage({ msg: "startScreen" });
    });

});