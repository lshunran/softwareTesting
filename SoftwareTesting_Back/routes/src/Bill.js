var Wilddog = require('wilddog');
var ref = new Wilddog("https://wild-boar-13842.wilddogio.com/");
var Bill = ref.child("Bill");
var alipay = ref.child("alipay");
var bankcard = ref.child("bankcard");
var Q = require('q');



module.exports = Bill;

function bill(obj) {
	for (var key in obj) {

	}
}


//获取当前系统时间，格式：yyyy-MM-dd hh:mm:ss，这个函数是没统一规定使用momentjs前写的
function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var seperator2 = ":";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
	+ " " + date.getHours() + seperator2 + date.getMinutes()
	+ seperator2 + date.getSeconds();
	return currentdate;
}
Bill.charge = function(data){
	var deferred = Q.defer();
	Bill.child(data.phoneNum).update({"status": 1},function(err){
		deferred.resolve(err);
	});
	return deferred.promise;
}

Bill.getBill = function(data){
	var deferred = Q.defer();
	//var data = req.body;
	var item = new bill();
	Bill.on('value', function(snapshot){
		snapshot.forEach(function(snap){
			if(snap.key() == data.phoneNum){
				item.phone = snap.key();
				item.mins = snap.child("minutes").val();
				item.times = snap.child("times").val();
				item.remains = snap.child("remains").val();
				item.status = snap.child("status").val();
				item.date = getNowFormatDate();
			}
		});
		var totalNum = 0;
		if(item.mins > 0 && item.mins <= 60 && item.times <= 1){
			totalNum = 25 + item.mins * 0.15 * 0.01;

		}else if(item.mins > 60 && item.mins <=120 && item.times <= 2){
			totalNum = 25 + item.mins * 0.15 * 0.015;

		}else if(item.mins > 120 && item.mins <=180 && item.times <= 3){
			totalNum = 25 + item.mins * 0.15 * 0.02;
			
		}else if(item.mins > 180 && item.mins <=300 && item.times <= 3){
			totalNum = 25 + data.mins * 0.15 * 0.025;
			
		}else if(item.mins > 300 && item.mins <=43200 && item.times <= 6){
			totalNum = 25 + item.mins * 0.15 * 0.03;
			
		}else if(item.mins > 43200){
			item.totalNum = "mins参数错误。";
			deferred.resolve(item);
			return deferred.promise;

		}else{
			totalNum = 25 + item.mins * 0.15;

		};

		if(data.remains > 0){
			totalNum = totalNum +data.remains * 0.05;
		}
		item.totalNum = totalNum;
		deferred.resolve(item);
	})


return deferred.promise;
}

Bill.payway = function(data){//tag=0 alipay  tag=1 bankcard ,account,totalNum
	var deferred = Q.defer();
	//console.log(data.tag+data.account+data.totalNum);
		//console.log(snapshot.child(data.account).exists());
		if(data.tag == 0){
			alipay.once('value', function(snapshot){
		//console.log(snapshot.child(data.account).exists());
		if(!snapshot.child(data.account).exists()){
			deferred.resolve("账户不存在");
			return deferred.promise;
		}else{

			alipay.child(data.account).once('value', function(snapshot){
			//console.log(snapshot.val());

			var balance = snapshot.child("balance").val();
			console.log(balance);
			if(balance < data.totalNum){
				deferred.resolve("账户余额不足");
				//return deferred.promise;
			}else{
				console.log("111");
				balance = balance - data.totalNum;
				alipay.child(data.account).update({"balance":balance},function(err){
					Bill.child(data.phoneNum).update({"status": 1});
					deferred.resolve("支付成功");
				})
								//deferred.resolve("支付成功1");

				//return deferred.promise;
			}
		})

		}
	})
		}else{
			bankcard.once('value', function(snapshot){
		//console.log(snapshot.child(data.account).exists());
		if(!snapshot.child(data.account).exists()){
			deferred.resolve("账户不存在");
			return deferred.promise;
		}else{

			bankcard.child(data.account).once('value', function(snapshot){
			//console.log(snapshot.val());

			var balance = snapshot.child("balance").val();
			console.log(balance);
			if(balance < data.totalNum){
				deferred.resolve("账户余额不足");
				//return deferred.promise;
			}else{
				console.log("111");
				balance = balance - data.totalNum;
				bankcard.child(data.account).update({"balance":balance},function(err){
					Bill.child(data.phoneNum).update({"status": 1});
					deferred.resolve("支付成功");
				})
								//deferred.resolve("支付成功1");

				//return deferred.promise;
			}
		})

		}
	})

		}




//console.log("222");
	//deferred.resolve="未知错误";

	return deferred.promise;

}














