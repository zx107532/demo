document.addEventListener('plusready', acc, false)

var oriValuesX = []; //存放x轴数据

var oriValuesY = []; //存放y轴数据

var oriValuesZ = []; //存放z轴数据

var oriValuesSqrt = []; //存放xyz平方相加再开根的数据

var timeX = []; //存放图表x轴的时间，单位：毫秒

var x = y = z = 0; //用以获取xyz轴当前的数据

var startTime = new Date().getTime(); //最初的开始时间，单位：毫秒

var string = ''; //定义一个字符串用来显示数据

//var u = 0; //用于存放加速度值的平均值

var m = 0; //用于存放加速度标准差

var n = 24; //数据量总数

function acc() {
	var acc = document.getElementById("acc");
	plus.accelerometer.watchAcceleration(function(a) {
		acc.innerText = "x:" + a.xAxis + "\ny:" + a.yAxis + "\nz:" + a.zAxis;
		passometer(a)
	}, function(e) {
		alert("Acceleration error: " + e.message);
	}, {
		frequency: 200
	});
}

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
	var aa = Math.sqrt(x * x + y * y + z * z);
	/**
	 *   计算加速度标准差
	 */
	var num = oriValuesSqrt[oriValuesSqrt.length - 1] - oriValuesSqrt[oriValuesSqrt.length - 2];

	//	$('.data').html(oriValuesSqrt[oriValuesSqrt.length - 1]);

	if(oriValuesSqrt.length >= n + 1) { //当数组长度达到25，删除数组第零个
		oriValuesSqrt.shift()
		//		console.log(oriValuesSqrt[0])
	}
	var summation = eval(oriValuesSqrt.join('+')); //求和
	var mean = summation / n; //求平均值
	for(var i = 0; i < oriValuesSqrt.length; i++) {
		m = Math.sqrt(((oriValuesSqrt[i] - mean) * (oriValuesSqrt[i] - mean)) / n) //计算加速度标准差
	}

	//	console.log(m1)r

	/**
	 * 重新計算
	 */
	if(oriValuesSqrt.length == 24) {
		var bArr = []; //  bArrqy的标准差
		var arr = []; //aArray与bArray的自相关
		var aArray = [];
			var bArray = [];
		for(var i = 1; i <8; i++) {
			//alert(i)
			
			for(var j = 0; j <= i + 4; j++) {
				aArray.push(oriValuesSqrt[j])
//				alert(oriValuesSqrt[j]+''+j)
				bArray.push(oriValuesSqrt[j + 7])
			}
			bArr.push(standardDeviation(bArray, bArray.length));
			arr.push(autocorrelation(aArray, bArray, aa))
			aArray = [];
			bArray = [];
		}
			
	}

	/**
	 *   计算自相关 
	 */

	var u = [];
	for(var i = 0; i < n - 1; i++) {
		u.push(aa * (i + 1));
	}
	var mean1 = eval(u.join('+')) / u.length; //求u的平均值  待用   u(m,t)
	var m1 = 0; //存放u的标准差   待用   ₀(m,t)
	for(var i = 0; i < u.length; i++) { //计算u的标准差
		var w = (u[i] - mean1) * (u[i] - mean1)
		m1 = Math.sqrt(w / u.length)
	}
	//	console.log(m1)

	$('.data').html(m)
	//调用line函数，生成图表用的
	//	line();
	//	$('#p').html('你走了' + m + '步');

}

$('#btn').click(function() {
	n = 0
	oriValuesSqrt = []
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

function autocorrelation(aArrey, bArrey, aa) { //计算自相关
	//console.log(aa)
	var m = 0;
	var t;
	var a = [];
	var mean1 = standardDeviation(aArrey, aArrey.length); //求平均值和标准差
	var mean2 = standardDeviation(bArrey, bArrey.length);
	var num1 = 0;
	var num2 = 0;
	var num3 = 0;
	for(var i = 4; i <= 10; i++) {
		t = i / 10
		//		console.log(t)
		for(var k = 0; k <= 24- 1; k++) {
			//			a.push(A * k)
			num1 = aa*(k) - mean1.mean
			num2 = bArrey[k] - mean2.mean
		}
		num3 = t * mean1.m * mean2.m
			m = (num1 * num2) / num3
	}
	return m
}

var line = function() {

	var ctx = document.getElementById("canvas");

	var myChart = new Chart(ctx, {

		type: 'line',

		data: {

			//			labels: timeX,

			datasets: [

				{

					label: "运动",

					fill: false,

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