//验证部分
$.extend($.validator.messages, {
	required: "请输入必填项.",
	max: $.validator.format("请输入一个最大为{0}的值"),
	min: $.validator.format("请输入一个最小为{0}的值"),
	minlength: $.validator.format("请输入一个至少{0}位的值"),
	equalTo: $.validator.format("请输入相同的值")
});

$.validator.addMethod("mobile", function(value, element) {  
    var length = value.length;     
    var mobile = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
	if(value == ""){
		return true;
	}else{
		return (length == 11 && mobile.exec(value))? true:false;
	}
}, "请填写正确的手机号码");

$.validator.addMethod("mid", function(value, element) {       
    var mid = /^\d{1,15}$/;     
    return (mid.exec(value))? true:false;  
}, "请填写正确的商编");

$.validator.addMethod("mcc", function(value, element) {
    var mid = /^\d{4}$/;     
    return (mid.exec(value))? true:false;  
}, "请填写正确的MCC码(4位数字)");

//异步校验注册手机号是否重复
jQuery.validator.addMethod("validMobile", function(value, element){
	var result = false;
	$.ajaxSetup({async: false});// 设置同步
	$.post(contextPath + "v/validMobile", {"param": value}, function(data){result = (1 == data);});//校验
	$.ajaxSetup({async: true});// 恢复异步
	return result;
}, "用户名已经存在");

//异步校验推荐人手机号是否合法
jQuery.validator.addMethod("validReferrerMobile", function(value, element){
	var result = false;
	$.ajaxSetup({async: false});// 设置同步
	$.post(contextPath + "v/validReferrerMobile", {"param": value}, function(data){result = (1 == data);});//校验
	$.ajaxSetup({async: true});// 恢复异步
	return result;
}, "推荐人不存在");

//异步校验推荐人手机号是否合法
jQuery.validator.addMethod("validReferrerMobileWithCrm", function(value, element){
	var result = false;
	$.ajaxSetup({async: false});// 设置同步
	$.post(contextPath + "v/validReferrerMobileWithCrm", {"param": value}, function(data){result = (1 == data);});//校验
	$.ajaxSetup({async: true});// 恢复异步
	return result;
}, "推荐人不存在");

$.mobile.switchPopup = function(sourceElement, destinationElement, onswitched) {
    var afterClose = function() {
        destinationElement.popup("open");
        sourceElement.off("popupafterclose", afterClose);

        if (onswitched && typeof onswitched === "function"){
            onswitched();
        }
    };
    sourceElement.on("popupafterclose", afterClose);
    sourceElement.popup("close");
};


//隐去微信右上角和下方按钮
document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
	WeixinJSBridge.call('hideOptionMenu');
	WeixinJSBridge.call('hideToolbar');
});

//解决fixed toolbat浮动问题
var initialScreenSize = window.innerHeight;
window.addEventListener("resize", function() {
    if(window.innerHeight < initialScreenSize){
        $("[data-role=footer]").hide();
    }
    else{
        $("[data-role=footer]").show();
    }
});

//页面初始化时对form加验证
$(document).on('pageinit', function(){
	//two forms could be shown, force to validate the last form
	$('form.validate:last').validate();
	$(":jqmData(role='page')").attr("data-title", document.title);
	//alert($("div:jqmData(role='page'):last").id);

});

$(document).on('pageinit', '#leadsCreate, #leadsUpdate', function(){
	hideFeedbackDays();
	$("#merchantIntention").change(function(){
		hideFeedbackDays();
	});
});


function hideFeedbackDays(){
	if($('#merchantIntention').val() != 2){
		$('#estimate-feedback-days-div').hide();
	}else{
		$('#estimate-feedback-days-div').show();
	}
}

function refreshRegionByBranch(){
	$('#branchCode').change(function(){
		var branchCode = $('#branchCode').val();
		$.get(contextPath + "/sales/getRegionByBranch",{"branchCode":branchCode},function(data){
			$('#regionCode').html('');
			$.each(data, function(i,e){
				$('#regionCode').append($("<option />").val(e.value).text(e.label));
			});
			$('#regionCode').selectmenu('refresh', true);
		});
	});
}

function refreshRegionByProvince(){
	$('#provinceId').change(function(){
		var provinceId = $('#provinceId').val();
		$.get(contextPath + "/sales/getRegionByProvince",{"provinceId":provinceId},function(data){
			$('#regionId').html('');
			$.each(data, function(i,e){
				$('#regionId').append($("<option />").val(e.id).text(e.name));
			});
			$('#regionId').selectmenu('refresh', true);
		});
	});
}

/**
 * 启用手机短信验证功能
 * @param mobileIptId 手机输入框id
 * @param checkCodeBtnId 获取验证码按钮id
 */
function enableMobileMessageCheck(mobileIptId,checkCodeBtnId){
	
	$(mobileIptId).keyup(function(){
		if(count != 30) return;//表示定时器正在执行
		//获取输入手机号
		var inputMobile = $(this).val();
		//获取输入长度
		var inputMobileLength = inputMobile.length;
		//验证输入长度
		if(inputMobileLength == 11){
			//验证手机号是否合法
			var reg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/; 
			if(reg.test(inputMobile)){
				$(checkCodeBtnId).button('enable');
				$(checkCodeBtnId).button('refresh');
				return;
			}
		}
		//验证不合法按钮禁用
		$(checkCodeBtnId).button('disable');
		$(checkCodeBtnId).button('refresh');
	});
	
	//发送验证码
	var count = 30;
	$(checkCodeBtnId).click(function(){
		
		$(checkCodeBtnId).button('disable');
		$(checkCodeBtnId).button('refresh');
		
		//获取输入手机号
		var inputMobile = $(mobileIptId).val();
		
		//获取验证码
		$.getJSON(contextPath + "/m/getCheckCode", {mobile:inputMobile}, function(data){
			if(data == "1"){
				//表示生成验证码成功
				var countdown = setInterval(countDown, 1000);//定时器
				
             	//倒计时
    			function countDown() {
    				$(checkCodeBtnId).button('disable');
                    $(checkCodeBtnId).val("重新发送(" + count + ")");
    				$(checkCodeBtnId).button('refresh');
    				
                    if (count == 0) {
                        $(checkCodeBtnId).button("enable");
                        $(checkCodeBtnId).val("重新发送");
                        $(checkCodeBtnId).button('refresh');
                        clearInterval(countdown);
                        count = 30;
                    }
                    count--;
                }
			}else{
				//生成验证码异常
				alert("验证码生成异常，请重新获取!");
			}
		});
		
	});
	
}


