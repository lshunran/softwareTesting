var Bill = require('./Bill');
var Q = require('q');


exports.charging = function(req, res, next){
	//基本月租25元，每分钟通话0.15元
	//跨年未交费部分要交滞纳金
	//参数有通话分钟数，累计未交费次数，跨年未交费部分
	var data = req.body;
	var totalNum = 0;
	if(data.mins && data.times && data.remains){
		if(data.mins > 0 && data.mins <= 60 && data.times <= 1){
			totalNum = 25 + data.mins * 0.15 * 0.01;

		}else if(data.mins > 60 && data.mins <=120 && data.times <= 2){
			totalNum = 25 + data.mins * 0.15 * 0.015;

		}else if(data.mins > 120 && data.mins <=180 && data.times <= 3){
			totalNum = 25 + data.mins * 0.15 * 0.02;
			
		}else if(data.mins > 180 && data.mins <=300 && data.times <= 3){
			totalNum = 25 + data.mins * 0.15 * 0.025;
			
		}else if(data.mins > 300 && data.mins <=43200 && data.times <= 6){
			totalNum = 25 + data.mins * 0.15 * 0.03;
			
		}else if(data.mins > 43200){
			res.json({
				error: "mins参数错误！"
			})
		}else{
			totalNum = 25 + data.mins * 0.15;

		};

		if(data.remains > 0){
			totalNum = totalNum +data.remains * 0.05;
		}

		res.json({
			totalNum: totalNum
		})

	}else{
		res.json({
			error: "所有参数都不能为空!"
		})
	}
};


exports.bill = function(req, res, next){
	var data = req.body;
	 Bill.getBill(data).done(function(data){
        if(data){
            res.json({
                Bill: data
            });
        }else{
            res.json({
                error: 未知错误 
            });
        }
    });


}

exports.charge = function(req, res, next){
	var data = req.body;
	Bill.charge(data).done(function(data){
        if(!data){
            res.json({
                errorCode: 0
            });
        }else{
            res.json({
                error: 未知错误
            });
        }
    });
}

exports.payway = function(req, res, next){
	var data = req.body;
	Bill.payway(data).done(function(data){
		console.log("data:"+data);
        if(data){
            res.json({
                result: data
            });
        }else{
            res.json({
                error: 未知错误
            });
        }
    });
}







