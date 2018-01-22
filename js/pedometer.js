document.addEventListener('plusready', acc, false)

var oriValuesX = []; //存放x轴数据

var oriValuesY = []; //存放y轴数据

var oriValuesZ = []; //存放z轴数据

var oriValuesSqrt = []; //存放xyz平方相加再开根的数据

var timeX = []; //存放图表x轴的时间，单位：毫秒

var x = y = z = 0; //用以获取xyz轴当前的数据

var startTime = new Date().getTime(); //最初的开始时间，单位：毫秒

var string = ''; //定义一个字符串用来显示数据
var s = 12; //每秒采集多少次
var intensity = 11; //运动强度

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

	timeX.push(currTime); //将当前时间差存放
	x = a.xAxis;
	y = a.yAxis;
	z = a.zAxis;
	oriValuesX.push(x); //将x轴当前加速度存放

	oriValuesY.push(y); //将y轴当前加速度存放

	oriValuesZ.push(z); //将z轴当前加速度存放
	oriValuesSqrt.push(Math.sqrt(x * x + y * y + z * z)); //将当前xyz加速度平方相加再开根存放
	var SMA = x + y + z;

	if(oriValuesSqrt.length >= s + 1) {
		oriValuesSqrt.shift()
		timeX.shift()
	}
	var index1 = oriValuesSqrt.indexOf(Math.max.apply(Math, oriValuesSqrt))

	//	var num = oriValuesSqrt[oriValuesSqrt.length - 1] - oriValuesSqrt[oriValuesSqrt.length - 2];
	var state = standardDeviation(oriValuesSqrt, oriValuesSqrt.length);
	if(state.m > 0.5) {
		//		for(var i = 0; i = oriValuesSqrt.length; i++) {

		if(oriValuesSqrt[oriValuesSqrt.length - 1] > intensity) {
			for(var i = 0; i < timeX.length; i++) {
				var nn = -(timeX[0] - timeX[i])
				//					$('.da').html('两次时间:' + nn)
				if(200 < nn < 1000) {
					n++
					timeX = []
					oriValuesSqrt = []
				}
			}
		} else {
			//				break
		}
		//		}

		//		}
	}

	$('.data').html(oriValuesSqrt[oriValuesSqrt.length - 1] + '<br/>标准差:' + state.m + '<br/>整体加速度:' + oriValuesSqrt[oriValuesSqrt.length - 1])
	$('#p').html('你走了' + n + '步')
}

$('#btn').click(function() {
	n = 0
	oriValuesSqrt = []
	timeX = []
})

$('#jia').click(function() {
	intensity++
	$('#num').html(intensity)
})
$('#jian').click(function() {
	intensity--
	$('#num').html(intensity)
})
$('#num').html(intensity)

$('#jia1').click(function() {
	s++
	$('#num1').html(s)
})
$('#jian1').click(function() {
	s--
	$('#num1').html(s)
})
$('#num1').html(s)

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

if(window.plus) {
	acc()
} else {
	document.addEventListener("plusready", acc, false)
}

exports.n = n