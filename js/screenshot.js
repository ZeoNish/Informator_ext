function setScreenshotUrl(url, path) {

    let lnk = path.split("/");

    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
    let dateTime = date + ' ' + time;

    document.getElementById('target').src = url;
    document.getElementById('href').href = url;
    document.title = 'Термическая точка #' + lnk[lnk.length - 1] + ' - ' + dateTime;
    document.getElementById('href').setAttribute("download", 'Термическая точка #' + lnk[lnk.length - 1] + ' - ' + dateTime);


}