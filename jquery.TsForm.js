/**
 * jquery.TsForm v1.37
 * 20 Jun 2015
 *
 * 修复当一个对象同时含有ph和rge的时候所引发的js报错
 * 修复当密码框含有ph属性时,无法正确验证是否为空 (03 Jan 2015 v1.36)
 * 修复当文本域含有ph属性时,可能导致脚本错误
 * 修复含有dv的标签在页面加载时未赋默认值 (06 May 2015 v1.35)
 * 修改邮箱以及网址的正则 (07 Apr 2015 v1.34)
 * 新增 ph ev (15 Mar 2015 v1.33)
 * 修改 ev => dv
 * 新增 cp 
 * 对含有ph属性的密码框进行了效果优化 (21 Jan 2015 v1.3)
 * 修复可以为空的对象无法正确进行正则验证 (07 Jan 2015 v1.25)
 * 增加含有 ph 的对象可以不进行非空验证 (25 Dec 14 v1.22)
 * 
 * 使用方法:
 *
 * 进行验证: $("#form").TsForm();
 * 清空表单: $("#form").TsFormReset();
 *
 * 属性:
 *
 * minlength:最短长度,多选框最少选择数量
 * maxlength:最长长度,多选框最多选择数量
 * ph:placeholder默认值
 * dv:默认值
 * em:错误信息
 * cp:对比对象
 *    ie:#id (两者选填一项)
 * cpem:对比错误信息
 * pwem:密码不一致提示信息
 * rg:正则表达式名称
 * rge:正则表达式
 * rgem:正则错误信息
 * tabindex:进行验证的顺序
 *
 * By Johnny Wong
 *
 */

$(function() {
	//用户名
	var rgeAC = /^[0-9a-zA-Z-_]{1,20}$/;
	//密码
	var rgePW = /^\w{6,16}$/;
	//联系方式(中国)
	var rgePhone = /^(\d{11})|((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$/;
	//联系方式2
	var rgePhone2 = /^[-+0-9]{1,20}$/;
	//手机(中国)
	var rgeHP = /^\d{11}$/;
	//电话(中国)
	var rgeTel = /^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$/;
	//电子邮箱
	var rgeEmail = /^[0-9a-zA-Z_]+(\.[0-9a-zA-Z_]+)*@[0-9a-zA-Z-_]+((\.[0-9a-zA-Z_]{2,3}){1,3})$/;
	//邮政编码(中国)
	var rgeZIP = /^\d{6}$/;
	//身份证(中国)
	var rgeIDF = /^(\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x))$/;
	//网址
	var rgeWS = /^((http|ftp|https):\/\/)?(([0-9a-zA-Z\._-]+\.[a-zA-Z]{2,6})|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,4})*(\/[0-9a-zA-Z\&%_\.\/-~-]*)?$/;

	$(this).find("[ph]").each(function() {
		$(this).css({
			"color": "#c0c0c0"
		});
		$(this).val($(this).attr("ph"));
		$(this).focus(function() {
			if ($(this).val() == $(this).attr("ph")) {
				$(this).css({
					"color": "#000"
				});
				$(this).val("");
			}
		});

		$(this).blur(function() {
			if ($(this).val() == "") {
				$(this).css({
					"color": "#c0c0c0"
				});
				$(this).val($(this).attr("ph"));
			}
		});
	});
	
	$(this).find("[dv]").each(function(){
		$(this).html($(this).attr("dv"));
	});

	var tempPw = "";
	$(this).find(":password[ph]").each(function() {
		//tempPw = $(this).clone();
		//$(this).hide().after(tempPw.addClass("TsFormHPWR").css({ "color": "#c0c0c0" }).attr("type", "text").attr("value", $(this).attr("ph")));
		//alert($(this).attr("ph"))
		tempPw = $(this).clone().addClass("TsFormHPWR").css({
			"color": "#c0c0c0"
		}).attr("value", $(this).attr("ph")).removeAttr("minlength").removeAttr("ph").removeAttr("em").removeAttr("pwem").removeAttr("rg").removeAttr("rge").removeAttr("rgem").wrap("<span></span>").parent().html().replace("password", "text");
		//alert(tempPw)
		$(this).hide().after(tempPw);
		$(this).next(".TsFormHPWR").attr("value", $(this).attr("ph"));
		$(this).blur(function() {
			if ($(this).val() == $(this).attr("ph") || $(this).val() == "") {
				$(this).hide().next(".TsFormHPWR").focus().show();
			}
		});
	});

	$(".TsFormHPWR").focus(function() {
		$(this).hide().prev(":password").show().focus();
	});

	$.fn.TsForm = function() {
		var form = $(this);

		var passValidate = true;
		var errorMessages = new Array();

		var texts = $(this).find(":text");
		var passwords = $(this).find(":password");
		var textarea = $(this).find("textarea");
		var radios = $(this).find(":radio");
		var checkboxs = $(this).find(":checkbox");
		var selects = $(this).find("select");
		var others = $(this).find("[dv]");

		texts.each(function() {
			if (typeof($(this).attr("ph")) != "undefined") {
				if (typeof($(this).attr("minlength")) != "undefined") {
					if ($(this).val() == $(this).attr("ph")) {
						if (typeof($(this).attr("em")) == "undefined") {
							errorMessages[parseInt($(this).attr("tabindex"))] = $(this).attr("ph");
						} else {
							errorMessages[parseInt($(this).attr("tabindex"))] = $(this).attr("em");
						}
					}
				}
			}

			if (typeof($(this).attr("minlength")) != "undefined") {
				if ($(this).val().length < parseInt($(this).attr("minlength"))) {
					if (typeof(errorMessages[parseInt($(this).attr("tabindex"))]) == "undefined") {
						errorMessages[parseInt($(this).attr("tabindex"))] = $(this).attr("em");
					}
				}
			}

			if (typeof($(this).attr("rg")) != "undefined") {
				if (typeof($(this).attr("ph")) == "undefined") {
					if ($(this).val().length > 0) {
						if (!eval("rge" + $(this).attr("rg")).test($(this).val())) {
							if (typeof(errorMessages[parseInt($(this).attr("tabindex"))]) == "undefined") {
								errorMessages[parseInt($(this).attr("tabindex"))] = $(this).attr("rgem");
							}
						}
					}
				} else {
					if ($(this).val() != $(this).attr("ph")) {
						if (!eval("rge" + $(this).attr("rg")).test($(this).val())) {
							if (typeof(errorMessages[parseInt($(this).attr("tabindex"))]) == "undefined") {
								errorMessages[parseInt($(this).attr("tabindex"))] = $(this).attr("rgem");
							}
						}
					}
				}
			}

			if (typeof($(this).attr("rge")) != "undefined") {
				if (typeof($(this).attr("ph")) == "undefined") {
					if ($(this).val().length > 0) {
						if (!(eval($(this).attr("rge")).test($(this).val()))) {
							if (typeof(errorMessages[parseInt($(this).attr("tabindex"))]) == "undefined") {
								errorMessages[parseInt($(this).attr("tabindex"))] = $(this).attr("rgem");
							}
						}
					}
				} else {
					if ($(this).val() != $(this).attr("ph")) {
						if (!eval($(this).attr("rge")).test($(this).val())) {
							if (typeof(errorMessages[parseInt($(this).attr("tabindex"))]) == "undefined") {
								errorMessages[parseInt($(this).attr("tabindex"))] = $(this).attr("rgem");
							}
						}
					}
				}
			}

			if (typeof($(this).attr("cp")) != "undefined") {
				if (typeof($(this).attr("ph")) == "undefined") {
					if ($(this).attr("cp").substring(0, 2) == "ie") {
						if ($(this).val().length == 0 && eval($("#" + $(this).attr("cp").substring(3))).val().length == 0) {
							errorMessages[parseInt($(this).attr("tabindex"))] = $(this).attr("cpem");
						}
					}
				} else {
					if ($(this).val() == $(this).attr("ph")) {
						if ($(this).attr("cp").substring(0, 2) == "ie") {
							if ($(this).val().length == 0 && eval($("#" + $(this).attr("cp").substring(3))).length == 0) {
								errorMessages[parseInt($(this).attr("tabindex"))] = $(this).attr("cpem");
							}
						}
					}
				}
			}
		});

		var confirmPassword = ""
		passwords.each(function() {
			if (typeof($(this).attr("ph")) != "undefined") {
				if (typeof($(this).attr("minlength")) != "undefined") {
					if ($(this).val() == $(this).attr("ph")) {
						if (typeof($(this).attr("em")) == "undefined") {
							errorMessages[parseInt($(this).attr("tabindex"))] = $(this).attr("ph");
						} else {
							errorMessages[parseInt($(this).attr("tabindex"))] = $(this).attr("em");
						}
					}
				}
			}

			if (typeof($(this).attr("minlength")) != "undefined") {
				if ($(this).val().length < parseInt($(this).attr("minlength"))) {
					if (typeof(errorMessages[parseInt($(this).attr("tabindex"))]) == "undefined") {
						errorMessages[parseInt($(this).attr("tabindex"))] = $(this).attr("em");
					}
				}
			}

			if (typeof($(this).attr("rg")) != "undefined") {
				if (typeof($(this).attr("ph")) == "undefined") {
					if ($(this).val().length > 0) {
						if (!eval("rge" + $(this).attr("rg")).test($(this).val())) {
							if (typeof(errorMessages[parseInt($(this).attr("tabindex"))]) == "undefined") {
								errorMessages[parseInt($(this).attr("tabindex"))] = $(this).attr("rgem");
							}
						}
					}
				} else {
					if ($(this).val() != $(this).attr("ph")) {
						if (!eval("rge" + $(this).attr("rg")).test($(this).val())) {
							if (typeof(errorMessages[parseInt($(this).attr("tabindex"))]) == "undefined") {
								errorMessages[parseInt($(this).attr("tabindex"))] = $(this).attr("rgem");
							}
						}
					}
				}
			}

			if (typeof($(this).attr("rge")) != "undefined") {
				if (typeof($(this).attr("ph")) == "undefined") {
					if ($(this).val().length > 0) {
						if (!(eval($(this).attr("rge")).test($(this).val()))) {
							if (typeof(errorMessages[parseInt($(this).attr("tabindex"))]) == "undefined") {
								errorMessages[parseInt($(this).attr("tabindex"))] = $(this).attr("rgem");
							}
						}
					}
				} else {
					if ($(this).val() != $(this).attr("ph")) {
						if (!eval($(this).attr("rge")).test($(this).val())) {
							if (typeof(errorMessages[parseInt($(this).attr("tabindex"))]) == "undefined") {
								errorMessages[parseInt($(this).attr("tabindex"))] = $(this).attr("rgem");
							}
						}
					}
				}
			}

			if (confirmPassword == "")
				confirmPassword = $(this).val();
			else {
				if (typeof($(this).attr("pwem")) != "undefined") {
					if ($(this).val() != confirmPassword) {
						if (typeof(errorMessages[parseInt($(this).attr("tabindex"))]) == "undefined") {
							errorMessages[parseInt($(this).attr("tabindex"))] = $(this).attr("pwem");
						}
					}
				}
			}
		});

		textarea.each(function() {
			if (typeof($(this).attr("ph")) != "undefined") {
				if (typeof($(this).attr("minlength")) != "undefined") {
					if ($(this).val() == $(this).attr("ph")) {
						if (typeof($(this).attr("em")) == "undefined") {
							errorMessages[parseInt($(this).attr("tabindex"))] = $(this).attr("ph");
						} else {
							errorMessages[parseInt($(this).attr("tabindex"))] = $(this).attr("em");
						}
					}
				}
			}

			if (typeof($(this).attr("minlength")) != "undefined") {
				if ($(this).val().length < parseInt($(this).attr("minlength"))) {
					if (typeof(errorMessages[parseInt($(this).attr("tabindex"))]) == "undefined") {
						errorMessages[parseInt($(this).attr("tabindex"))] = $(this).attr("em");
					}
				}
			}

			if (typeof($(this).attr("rg")) != "undefined") {
				if (typeof($(this).attr("ph")) == "undefined") {
					if ($(this).val().length > 0) {
						if (!eval("rge" + $(this).attr("rg")).test($(this).val())) {
							if (typeof(errorMessages[parseInt($(this).attr("tabindex"))]) == "undefined") {
								errorMessages[parseInt($(this).attr("tabindex"))] = $(this).attr("rgem");
							}
						}
					}
				} else {
					if ($(this).val() != $(this).attr("ph")) {
						if (!eval("rge" + $(this).attr("rg")).test($(this).val())) {
							if (typeof(errorMessages[parseInt($(this).attr("tabindex"))]) == "undefined") {
								errorMessages[parseInt($(this).attr("tabindex"))] = $(this).attr("rgem");
							}
						}
					}
				}
			}

			if (typeof($(this).attr("rge")) != "undefined") {
				if (typeof($(this).attr("ph")) == "undefined") {
					if ($(this).val().length > 0) {
						if (!(eval($(this).attr("rge")).test($(this).val()))) {
							if (typeof(errorMessages[parseInt($(this).attr("tabindex"))]) == "undefined") {
								errorMessages[parseInt($(this).attr("tabindex"))] = $(this).attr("rgem");
							}
						}
					}
				} else {
					if ($(this).val() != $(this).attr("ph")) {
						if (!eval($(this).attr("rge")).test($(this).val())) {
							if (typeof(errorMessages[parseInt($(this).attr("tabindex"))]) == "undefined") {
								errorMessages[parseInt($(this).attr("tabindex"))] = $(this).attr("rgem");
							}
						}
					}
				}
			}

			if (typeof($(this).attr("cp")) != "undefined") {
				if (typeof($(this).attr("ph")) == "undefined") {
					if ($(this).attr("cp").substring(0, 2) == "ie") {
						if ($(this).val().length == 0 && eval($("#" + $(this).attr("cp").substring(3))).val().length == 0) {
							errorMessages[parseInt($(this).attr("tabindex"))] = $(this).attr("cpem");
						}
					}
				} else {
					if ($(this).val() == $(this).attr("ph")) {
						if ($(this).attr("cp").substring(0, 2) == "ie") {
							if ($(this).val().length == 0 && eval($("#" + $(this).attr("cp").substring(3))).length == 0) {
								errorMessages[parseInt($(this).attr("tabindex"))] = $(this).attr("cpem");
							}
						}
					}
				}
			}
		});

		var cbGroup = new Array();
		checkboxs.each(function() {
			if ($.inArray($(this).attr("name"), cbGroup) == -1) {
				cbGroup.push($(this).attr("name"));
			}
		});
		$.each(cbGroup, function() {
			if (typeof(form.find(":checkbox[name='" + this + "']:first").attr("minlength")) != "undefined") {
				if (form.find(":checkbox[name='" + this + "']:checked").length < parseInt(form.find(":checkbox[name='" + this + "']:first").attr("minlength"))) {
					errorMessages[parseInt(form.find(":checkbox[name='" + this + "']:first").attr("tabindex"))] = form.find(":checkbox[name='" + this + "']:first").attr("em");
				}
			}

			if (typeof(form.find(":checkbox[name='" + this + "']:first").attr("maxlength")) != "undefined") {
				if (form.find(":checkbox[name='" + this + "']:checked").length > parseInt(form.find(":checkbox[name='" + this + "']:first").attr("maxlength"))) {
					if (typeof(form.find(":checkbox[name='" + this + "']:first").attr("maxem")) != "undefined") {
						if (typeof(errorMessages[parseInt(form.find(":checkbox[name='" + this + "']:first").attr("tabindex"))]) == "undefined") {
							errorMessages[parseInt(form.find(":checkbox[name='" + this + "']:first").attr("tabindex"))] = form.find(":checkbox[name='" + this + "']:first").attr("maxem");
						}
					} else {
						errorMessages[parseInt(form.find(":checkbox[name='" + this + "']:first").attr("tabindex"))] = form.find(":checkbox[name='" + this + "']:first").attr("em");
					}
				}
			}
		});

		selects.each(function() {
			if (typeof($(this).attr("em")) != "undefined") {
				if ($(this).find("option:first").prop("selected")) {
					errorMessages[parseInt($(this).attr("tabindex"))] = $(this).attr("em");
				}
			}
		});

		others.each(function() {
			if (typeof($(this).attr("dv")) != "undefined") {
				if ($(this).text() == $(this).attr("dv")) {
					errorMessages[parseInt($(this).attr("tabindex"))] = $(this).attr("em");
				}
			}
		});

		$.each(errorMessages, function(i) {
			if (typeof(errorMessages[i]) != "undefined") {
				alert(errorMessages[i]);
				$(form.find("[tabindex='" + i + "']").focus());
				passValidate = false;
				return false;
			}
		});

		if (passValidate) {
			return true;
		} else {
			return false;
		}
	}

	$.fn.TsFormReset = function() {
		var form = $(this);

		$(this).find(":text").val("");
		$(this).find(":password").val("");
		$(this).find("textarea").val("");

		var rdGroup = new Array();
		$(this).find(":radio").each(function() {
			//console.log($(this).attr("name"));
			if ($.inArray($(this).attr("name"), rdGroup) == -1) {
				rdGroup.push($(this).attr("name"));
			}
		});
		$.each(rdGroup, function() {
			form.find(":radio[name='" + this + "']:first").prop("checked", true);
		});

		$(this).find(":checkbox").prop("checked", false);
		$(this).find("select").each(function() {
			$(this).find("option:first").prop("selected", true);
		});

		$(this).find("[dv]").each(function() {
			$(this).text($(this).attr("dv"));
		});

		$(this).find("[ph]").each(function() {
			$(this).css({
				"color": "#c0c0c0"
			});
			$(this).val($(this).attr("ph"));
		});
	}
});