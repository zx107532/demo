document.addEventListener('plusready', acc, false)

var oriValuesX = []; //存放x轴数据

var oriValuesY = []; //存放y轴数据

var oriValuesZ = []; //存放z轴数据

var oriValuesSqrt = []; //存放xyz平方相加再开根的数据

var timeX = []; //存放图表x轴的时间，单位：毫秒

var x = y = z = 0; //用以获取xyz轴当前的数据

var startTime = new Date().getTime(); //最初的开始时间，单位：毫秒

var string = ''; //定义一个字符串用来显示数据
var s = 10; //每秒采集多少次
var list = [];

function acc() {
	var acc = document.getElementById("acc");
	plus.accelerometer.watchAcceleration(function(a) {
		acc.innerText = "x:" + a.xAxis + "\ny:" + a.yAxis + "\nz:" + a.zAxis;
		passometer(a)
	}, function(e) {
		alert("Acceleration error: " + e.message);
	}, {
		frequency: 1000 / s
	});
}
var n = 0;

function passometer(a) {
	var currTime = new Date().getTime(); //当前时间

	var diffTime = currTime - startTime; //当前时间减最初时间，得到当前时间差

	timeX.push(diffTime); //将当前时间差存放
	x = a.xAxis;
	y = a.yAxis;
	z = a.zAxis;
	oriValuesX.push(x); //将x轴当前加速度存放

	oriValuesY.push(y); //将y轴当前加速度存放

	oriValuesZ.push(z); //将z轴当前加速度存放
	oriValuesSqrt.push(Math.sqrt(x * x + y * y + z * z)); //将当前xyz加速度平方相加再开根存放
	var SMA = x + y + z;

	//调用line函数，生成图表用的

	line();

	if(oriValuesSqrt.length >= s + 1) {
		oriValuesSqrt.shift()
		timeX.shift()
	}
	var index1 = oriValuesSqrt.indexOf(Math.max.apply(Math, oriValuesSqrt))

	var num = oriValuesSqrt[oriValuesSqrt.length - 1] - oriValuesSqrt[oriValuesSqrt.length - 2];
	var state = standardDeviation(oriValuesSqrt, oriValuesSqrt.length);
	if(state.m > 0.5) {
		if(num > 2.5 && num < 10) {
//			startTime = new Date().getTime();
//			if(200 < timeX[oriValuesSqrt.length] < 1000) {
//				n++
//				timeX = []
//			}
			//				n++
			if(200<timeX[oriValuesSqrt.length-1]-timeX[oriValuesSqrt.length-2]<1000){
				n++
				timeX = []
				oriValuesSqrt = []
			}
	}
	}

	$('.data').html(num + '<br/>标准差:' + state.m + '<br/>整体加速度:' + oriValuesSqrt[oriValuesSqrt.length - 1] + '<br/>两次时间:' + timeX[timeX.length - 1])
	$('#p').html('你走了' + n + '步')
}
$('#btn').click(function() {
	n = 0
	oriValuesSqrt = []
	timeX = []
})

function standardDeviation(array, n) { //计算标准差
	var m = 0;
	var num = array[array.length - 1] - array[array.length - 2];
	var summation = eval(array.join('+')); //求和
	var mean = summation / n; //求平均值
	for(var i = 0; i < array.length; i++) {
		m = Math.sqrt(((array[i] - mean) * (array[i] - mean)) / n) //计算加速度标准差
	}
	var a = {
		mean: mean,
		m: m
	}
	return a
}

var line = function() {

	var ctx = document.getElementById("canvas");

	var myChart = new Chart(ctx, {

		type: 'line',

		data: {

			labels: timeX,

			datasets: [

				{

					label: "运动",

					fill: true,

					lineTension: 0.1,

					backgroundColor: "rgba(54, 162, 235, 0.2)",

					borderColor: "rgba(54, 162, 235, 1)",

					borderCapStyle: 'butt',

					borderDash: [],

					borderDashOffset: 0.0,

					borderJoinStyle: 'miter',

					pointBorderColor: "rgba(54, 162, 235, 1)",

					pointBackgroundColor: "#fff",

					pointBorderWidth: 1,

					pointHoverRadius: 5,

					pointHoverBackgroundColor: "rgba(54, 162, 235, 1)",

					pointHoverBorderColor: "rgba(220,220,220,1)",

					pointHoverBorderWidth: 2,

					pointRadius: 1,

					pointHitRadius: 10,

					data: oriValuesSqrt,

					spanGaps: false,

				}

			]

		},

		options: {

			scales: {

				yAxes: [{

					ticks: {

						beginAtZero: true

					}

				}]

			}

		}

	});

};

if(window.plus) {
	acc()
} else {
	document.addEventListener("plusready", acc, false)
}