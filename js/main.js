$("document").ready(function () {
    // $(".new").click(function(e){  //.on("click", function()
    //     var section = jQuery(".main-line").clone();
    //     $("article").append(section);
    // });
    //
    // $(".add").on("click", function(){
    //     var sum = parseFloat(jQuery(".sum").val());
    //     var plus = parseFloat(jQuery(".plus").val().replace(",", "."));
    //     rezult = sum + plus;
    //     $(".sum").val(rezult); // val - html for div
    // });
    auto.addLot();
    auto.addLot();
    auto.addLot();
    auto.addLot();
    auto.addLot();
    auto.addLot();
    auto.addLot();
});

var timer = {
    time: 600000,
    timerID: 0,
    timeString: '10:00.000',
    min: 10,
    sec: 0,
    dateAct: new Date(),
    dateStart: new Date(),
    dateEnd: 0,

    // Умный тик
    smartTick: function(tickValue) {
        if (this.time >= tickValue) {
            this.dateAct = new Date();
            this.time = this.dateEnd.getTime() - this.dateAct.getTime();
        } else {
            clearInterval(this.timerID);
            this.timerID = 0;
            timer.clockTimeFieldRefresh();
            this.time = 0;
            document.querySelector('.start-stop-btn').innerHTML = 'Start';
        };
        timer.clockTimeFieldRefresh();
    },

    // Ф-ция кнопки обнулить
    clear: function() {
        this.time = 0;
        this.stop();
        timer.clockTimeFieldRefresh();
        this.timerID = 0;
        this.dateEnd = 0;
    },

    // Старт
    start: function(tickValue) {
        this.dateEndRefresh();
        if (this.timerID == 0) {
            let _this = this;
            this.timerID = setInterval(function () {_this.smartTick(tickValue);}, tickValue, tickValue);
        } else {console.log("already started");}
        document.querySelector('.start-stop-btn').innerHTML = 'Pause';
    },

    // Стоп
    stop: function() {
        clearInterval(this.timerID);
        this.timerID = 0;
        timer.clockTimeFieldRefresh();;
        document.querySelector('.start-stop-btn').innerHTML = 'Start';
    },

    // Добавить время таймера
    addTime: function(addValue) {
        this.time += addValue;
        // if {this.time > }
        timer.clockTimeFieldRefresh();
        this.dateEndRefresh();
    },

    // Установить время таймера
    setTime: function(setValue) {
        this.time = setValue;
        timer.clockTimeFieldRefresh();
        this.dateEndRefresh();
    },
    timeToMinSec: function() {
        let _this = this;
        this.min = Math.floor(_this.time / 60000);
        this.sec = ((this.time - this.min * 60000) / 1000);
    },
    minSecToString: function() {
        let _this = this;
        this.timeToMinSec();
        let _sec = ('00' + Math.floor(_this.sec)).slice(-2);
        let _min = ('00' + this.min).slice(-2);
        this.timeString = _min + ':' + _sec + ".";
        this.timeStringEnd = ("00" + this.sec.toFixed(3)).slice(-3);
    },
    minSecToTime: function(min, sec) {
        return min*60000+sec*1000;
    },

    // Ф-ция для кнопки старт/стоп
    startStop: function (tickValue) {
        if (this.timerID == 0) {
            this.start(tickValue);
        } else {this.stop();}
    },

    // Обновить текстовое поле с обратным отсчётом
    clockTimeFieldRefresh: function () {
        this.minSecToString();
        document.getElementById('aside-timer').innerHTML = this.timeString + "<span>" + this.timeStringEnd + "</span>";
    },

    // Обновить время окончания таймера
    dateEndRefresh: function() {
        this.dateEnd = new Date(new Date().getTime() + this.time);
    },

    // Обновить текущее время
    dateActRefresh: function() {
        this.dateAct = new Date();
        var deltaOregon = 7;
        document.getElementById('date-act-moscow').innerHTML = ('00' + this.dateAct.getUTCHours().toFixed(0)).slice(-2) - 0 + 3 + ':' + ('00' + this.dateAct.getMinutes().toFixed(0)).slice(-2) + ':' + ('00' + this.dateAct.getSeconds().toFixed(0)).slice(-2);
        document.getElementById('date-act-oregon').innerHTML = ('00' + this.dateAct.getUTCHours().toFixed(0)).slice(-2) - 0 - deltaOregon + ':' + ('00' + this.dateAct.getMinutes().toFixed(0)).slice(-2) + ':' + ('00' + this.dateAct.getSeconds().toFixed(0)).slice(-2);
        let timeSpend = this.dateAct.getTime() - timer.dateStart.getTime();

        let hourSpend = Math.floor(timeSpend / (60000 * 60));
        let minSpend = Math.floor((timeSpend - hourSpend * (60000 * 60))/ 60000);
        let secSpend = Math.floor((timeSpend - minSpend * 60000 - hourSpend * (60000 * 60)) / 1000);
        document.getElementById('time-spend').innerHTML = ('00' + hourSpend).slice(-2) + ':' + ('00' + minSpend).slice(-2) + ':' + ('00' + secSpend).slice(-2);

    },
};




var auto = {
    content: [],
    names: [],
    prices: [],
    adds:[],
    container: $('#auto-sheet'),
    addLot: () => {
        let i = 1 + $('article').children().length;
        $('article').append('<section class="main-line" id="lot-' + i + '">' +
                        '<input type="text" class="name" id="title-' + i + '"> ' +
                            '<span class="split">-</span>' +
                        '<input type="text" class="sum" onchange="auto.sorting(), auto.point(' + i + ')" id="price-' + i + '" data-buttons="false"> ' +
                            '<span class="split">₽</span> ' +
                        '<input type="text" class="plus" id="add-' + i + '" data-buttons="false">' +
                        '<button class="add" onclick="auto.addPrice(' + i + '), auto.sorting();">+</button>' +
                    '</section>');
    },

    read: () => {
        let a = $('article').children().length;
        for (i=1; i <= a; i++) {
            if (auto.content.length < i) {auto.content.push({name: '', price: '', add: '', priceMath: '', addMath: ''})};
            auto.content[(i-1)].name = document.getElementById('title-' + i).value;
            auto.content[(i-1)].price = document.getElementById('price-' + i).value;
            auto.content[(i-1)].add = document.getElementById('add-' + i).value;

            auto.content[(i-1)].priceMath = parseFloat(document.getElementById('price-' + i).value);
            auto.content[(i-1)].addMath = parseFloat(document.getElementById('add-' + i).value);
        };
    },
    write: () => {
        a = auto.content.length;
        for (i=1; i <= a; i++) {
            document.getElementById('title-' + i).value = auto.content[(i-1)].name;
            document.getElementById('price-' + i).value = auto.content[(i-1)].price;
            document.getElementById('add-' + i).value = auto.content[(i-1)].add;
        };
    },
    addPrice: (num) => {
        auto.point(num);
        if ( document.getElementById('add-' + num).value == '') {
            return
        } else if (isNaN(document.getElementById('add-' + num).value)) {
            return
        }
        if ( document.getElementById('price-' + num).value == '') {
            document.getElementById('price-' + num).value = 0
        } else if (isNaN(document.getElementById('price-' + num).value)) {
            return
        }
        document.getElementById('price-' + num).value = 0 + Math.round((parseFloat(document.getElementById('price-' + num).value) + parseFloat(document.getElementById('add-' + num).value))*100)/100;
        document.getElementById('add-' + num).value = '';
    },
    sorting: () => {
        auto.read();
        auto.content.sort(function (a, b) {
            ai = a.priceMath
            bi = b.priceMath
            if (isNaN(a.priceMath)) {ai = 0}
            if (isNaN(b.priceMath)) {bi = 0}
            if (ai > bi) {
                return -1;
            }
            if (ai < bi) {
                return 1;
            }
            return 0;
        });
        auto.write();
    },

    // Меняем запятые на точки в полях price и add
    point: (num) => {
        let strOld = document.getElementById('add-' + num).value;
        let strNew = "";
        for (i=1; i <= strOld.length; i++) {
            if (strOld[(i-1)] == ",") {
                strNew = strNew + ".";
            } else {
                strNew = strNew + strOld[(i-1)];
            }
        };
        document.getElementById('add-' + num).value = strNew;
        strOld = document.getElementById('price-' + num).value;
        strNew = "";
        for (i=1; i <= strOld.length; i++) {
            if (strOld[(i-1)] == ",") {
                strNew = strNew + ".";
            } else {
                strNew = strNew + strOld[(i-1)];
            }
        };
        document.getElementById('price-' + num).value = strNew;
    }
};

timer.dateStart  = new Date();
setInterval(timer.dateActRefresh,500);

