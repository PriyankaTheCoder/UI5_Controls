jQuery.sap.declare("sap.demo.controls.Text");

sap.ui.define(["sap/m/Text"],function(Text){
	Text.extend("sap.demo.controls.Text",{
		metadata:{
			events:{
				doubleClick:{}
			}
		},
		renderer:{},
		onAfterRendering:function(){
			if(Text.prototype.onAfterRendering){
				Text.prototype.onAfterRendering.apply(this,arguments);
			}
			var txt = this;
			this.ondblclick=function(){
				txt.fireEvent("doubleClick")
			}
		}
	});
	
});