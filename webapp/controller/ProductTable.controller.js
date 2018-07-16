sap.ui.define(["sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	'sap/ui/model/Filter',
	"sap/ui/core/routing/History"
], function(BaseController, MessageBox, Utilities, Filter, History) {
	"use strict";

	return BaseController.extend("com.sap.build.standard.products.controller.ProductTable", {
		_oDialog: null,
		handleRouteMatched: function(oEvent) {
			var oParams = {};

			if (oEvent.mParameters.data.context) {
				this.sContext = oEvent.mParameters.data.context;
				var oPath;
				if (this.sContext.substr(0,4) === "supp") {
					oPath = {
						path: "/Suppliers(" + this.sContext.substr(4,1) + ")/Products",
						parameters: oParams
					};
					this.getView().bindObject(oPath);
					
					var aFilters = [];
					var sQuery = this.sContext.substr(4,1);
					if (sQuery && sQuery.length > 0) {
						var filter = new Filter("Supplier/ID", sap.ui.model.FilterOperator.EQ, sQuery);
						aFilters.push(filter);
					}
				}else if (this.sContext.substr(0,4) === "cate"){
					oPath = {
						path: "/Categories(" + this.sContext.substr(4,1) + ")/Products",
						parameters: oParams
					};
					this.getView().bindObject(oPath);
					
					aFilters = [];
					sQuery = this.sContext.substr(4,1);
					if (sQuery && sQuery.length > 0) {
						filter = new Filter("Category/ID", sap.ui.model.FilterOperator.EQ, sQuery);
						aFilters.push(filter);
					}
				}
				// update list binding
				var oTab = this.byId("prodTable");
				var binding = oTab.getBinding("items");
				binding.filter(aFilters, "Application");
			}
		
		},
		_onPageNavButtonPress: function() {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			var oQueryParams = this.getQueryParameters(window.location);

			if (sPreviousHash !== undefined || oQueryParams.navBackToLaunchpad) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("default", true);
			}

		},
		getQueryParameters: function(oLocation) {
			var oQuery = {};
			var aParams = oLocation.search.substring(1).split("&");
			for (var i = 0; i < aParams.length; i++) {
				var aPair = aParams[i].split("=");
				oQuery[aPair[0]] = decodeURIComponent(aPair[1]);
			}
			return oQuery;

		},
		onInit: function() {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getTarget("ProductTable").attachDisplay(jQuery.proxy(this.handleRouteMatched, this));
			var oView = this.getView();
			oView.addEventDelegate({
				onBeforeShow: function() {
					if (sap.ui.Device.system.phone) {
						var oPage = oView.getContent()[0];
						if (oPage.getShowNavButton && !oPage.getShowNavButton()) {
							oPage.setShowNavButton(true);
							oPage.attachNavButtonPress(function() {
								this.oRouter.navTo("ProductDetails", {}, true);
							}.bind(this));
						}
					}
				}.bind(this)
			});

		}
	});
}, /* bExport= */ true);
