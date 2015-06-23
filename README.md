# TsForm
表单验证控件 支持文本框,密码框,下拉框,单选框,多选框,文本域以及对象等等的验证,包括必填,对比,正则等等验证


使用方法:

 进行验证: $("#form").TsForm();<br />
 清空表单: $("#form").TsFormReset();
 
 属性:<br />
 minlength:最短长度,多选框最少选择数量<br />
 maxlength:最长长度,多选框最多选择数量<br />
 ph:placeholder默认值<br />
 dv:默认值<br />
 em:错误信息<br />
 cp:对比对象<br />
 &nbsp;&nbsp;&nbsp;&nbsp;ie:#id (两者选填一项)<br />
 cpem:对比错误信息<br />
 pwem:密码不一致提示信息<br />
 rg:正则表达式名称<br />
 rge:正则表达式<br />
 rgem:正则错误信息<br />
 tabindex:进行验证的顺序<br />
