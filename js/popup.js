document.addEventListener('DOMContentLoaded', function(){

    let a = 0;
    function count() {
        a++;
        document.getElementById('demo').textContent = a;
    }


    document.getElementById('do-count').onclick = function () {
        count()
    };


    // document.getElementById('do-count').onclick = count;

});