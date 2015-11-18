sap.ui.define([ "sap/ui/core/mvc/Controller","sap/demo/controls/JSONControl"], function(Controller,jsonControl) {
	
	return Controller.extend("sap.demo.views.json",{
		
	onInit: function(){
		var json = new jsonControl();
		json.setJson('{"VCAP_APPLICATION":34}');
		json.setEditable(true);
		this.getView().byId("jsonContent").addContent(json);
	
	}
		
	});
});