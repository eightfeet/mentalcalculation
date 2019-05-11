
var question = document.getElementById('question');
var answer = document.getElementById('answer');
var startBtn = document.getElementById('start');
var resetBtn = document.getElementById('reset');
var submitBtn = document.getElementById('submit');
var nInp = document.getElementById('n');
var totalInp = document.getElementById('total');
var reportTimeInp = document.getElementById('reporttime');
var resultTimeInp = document.getElementById('resulttime');

var timer1, timer2, timer3;

var url = "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text=" + encodeURI('开始');

var audio = document.createElement('audio') //生成一个audio元素 

var formData = {
    n: 4,
    total: 10,
    reportTime: 5,
    resultTime: 5,
};

// 运算计数器
var i = 0;
// 题数计数器
var count = 0;
// 运算次数
var n = formData.n;
nInp.value = n;
// 题目总数
var total = formData.total;
totalInp.value = total;
// 播报间隔时间
var reportTime = formData.reportTime;
reportTimeInp.value = reportTime;
// 公布答案时间
var resultTime = formData.resultTime;
resultTimeInp.value = resultTime;
// 正在收听
var answering = false;

audio.controls = true //这样控件才能显示出来 
audio.src = url //音乐的路径 

function speckText(str) {
    console.log(str.replace('.00', ''));
    var url = "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text=" + encodeURI(str);
    audio.src = url;
    audio.play();
}

function run(callback, next, arr) {
    timer1 = setTimeout(() => { 
        var div = document.createElement('div');
        div.innerHTML = arr[i].replace(/加上/g,"+").replace(/减去/g,"-").replace(/等于/g,"");
        question.appendChild(div);
        speckText(arr[i]); 
        i++;
        if (i < arr.length) {
            run(callback, next, arr);
        } else {
            i = 0;
            callback && callback(arr, next);
        }
    }, reportTime * 1000);
}

function formula(n) {
    var arr = [];
    for (var index = 0; index < n; index++) {

        var oldresult = calculation(arr) || 0;
        var rat = 50;

        if (oldresult > 50) {
            rat = -50;
        }

        if (oldresult < 50) {
            rat = 50;
        }

        var num = randomNumber(rat);

        if(num > 0) {
            arr.push('加上'+num);
        }
        if(num < 0) {
            arr.push('减去'+num*-1);
        }
    }
    arr.push('等于');
    return arr;
}

function calculation(arr) {
    var e = arr.join('').replace(/加上/g,"+").replace(/减去/g,"-").replace(/等于/g,"");
    return eval(e);
}

function result(arr, next) {
    var result = calculation(arr);
    var div = document.createElement('div');
        div.innerHTML = result;
    timer2 = setTimeout(() => {
        speckText(result.toString()+'.00');
        answer.appendChild(div);
        timer3 = setTimeout(function(){
            next(start);
        }, 3000);
    }, resultTime * 1000);
}

function randomNumber(number) {
   return window.Math.floor(window.Math.random()*number)
}

function start(next){
    answering = true;
    resetBtn.style.display = "block";
    if (total <= 0) {
        speckText('答题完毕');
        reset();
        return;
    }
    speckText(total === formData.total ? '开始' : '请听题');
    total--;
    
    question.innerHTML = '';
    answer.innerHTML = '';
    run(result, next, formula(n));
}

// 重置数据
function reset() {
    i = 0;
    count = 0;
    n = formData.n;
    total = formData.total;
    reportTime = formData.reportTime;
    resultTime = formData.resultTime;
    answering = false;
    startBtn.style.display = "block";
    resetBtn.style.display = "none";
    question.innerHTML = '';
    answer.innerHTML = '';
}

function letsGo () {
    if (answering) {
        console.log('正在答题！');
        return;
    }
    startBtn.style.display = "none";
    start(start);
}

function setRem() {
    document.getElementsByTagName('html').style.fontSize=window.innerWidth/24+'px';
    document.body.style.fontSize=window.innerWidth/24+'px';
}

function submit() {
    // 运算次数
    formData.n = nInp.value;
    n = formData.n;
    // 题目总数
    formData.total = totalInp.value;
    total = formData.total;
    // 播报间隔时间
    formData.reportTime =  reportTimeInp.value;
    reportTime = formData.reportTime;
    // 公布答案时间
    formData.resultTime =  resultTimeInp.value;
    resultTime = formData.resultTime;

    document.getElementById('set').style.display = 'none';
}

submitBtn.onclick = submit;