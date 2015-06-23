# TsForm
表单验证控件 支持文本框,密码框,下拉框,单选框,多选框,文本域以及对象的验证,包括必填,对比,正则等等验证


使用方法:

 进行验证: $("#form").TsForm();
 清空表单: $("#form").TsFormReset();
 
 属性:
 minlength:最短长度,多选框最少选择数量
 maxlength:最长长度,多选框最多选择数量
 ph:placeholder默认值
 dv:默认值
 em:错误信息
 cp:对比对象
    ie:#id (两者选填一项)
 cpem:对比错误信息
 pwem:密码不一致提示信息
 rg:正则表达式名称
 rge:正则表达式
 rgem:正则错误信息
 tabindex:进行验证的顺序