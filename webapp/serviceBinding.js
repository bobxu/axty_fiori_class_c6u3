function initModel() {
	var sUrl = "/FioriDemo/V2/(S(x44wubq0mo3mapkxnhhwcqhn))/OData/OData.svc/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}