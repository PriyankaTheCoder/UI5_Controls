sap.ui.define([ "sap/ui/core/UIComponent" ], function(UIComponent) {

	return UIComponent.extend("sap.demo.Component", {
		metadata : {
			name : "sap.demo",
			version : "1.0",
			dependencies : {
				lib : [ "sap.m" ]
			}
		},

		init : function() {
			UIComponent.prototype.init.apply(this, arguments);
 
		},
		createContent : function() {
			var oViewData = {
				component : this
			};

			return sap.ui.view({
				viewName : "sap.demo.views.json",
				type : sap.ui.core.mvc.ViewType.XML,
				viewData : oViewData
			});
		},

	});

});