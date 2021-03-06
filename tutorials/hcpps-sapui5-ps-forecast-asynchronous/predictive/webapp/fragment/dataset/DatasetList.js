sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";

	return Controller.extend("pspredictive.fragment.dataset.DatasetList", {
		getDatasetList: function() {
			// set the busy indicator to avoid multi clicks
			var oBusyIndicator = new sap.m.BusyDialog();
			oBusyIndicator.open();

			// get the current view
			var oView = this.getView();

			// get the model
			var oModel = oView.getModel("dataset_fragment");

			// call the service and define call back methods
			$.ajax({
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				url: "/ps/api/analytics/dataset",
				type: "GET",
				async: true,
				timeout: 3000000,
				success: function(data) {
					try {
						//Save data set description data in the model
						oModel.setProperty("/datasets", data);
					} catch (err) {
						MessageToast.show("Caught - dataset fragment get list [ajax success] :" + err.message);
					}
					oBusyIndicator.close();
				},
				error: function(request, status, error) {
					MessageToast.show("Caught - dataset fragment get list [ajax error] :" + request.responseText);
					oBusyIndicator.close();
				}
			});
		},
		getDatasetDescription: function(oControlEvent) {
			// set the busy indicator to avoid multi clicks
			var oBusyIndicator = new sap.m.BusyDialog();

			// get the current view
			var oView = this.getView();

			// get the model
			var oModel = oView.getModel("dataset_fragment");

			if (oModel.getProperty("/datasets") !== undefined && oModel.getProperty(
					"/datasets")[oControlEvent.getParameter("rowIndex")] !== undefined) {
				oBusyIndicator.open();
				var dataSetId = oModel.getProperty("/datasets")[oControlEvent.getParameter("rowIndex")].ID;
				// call the service and define call back methods
				$.ajax({
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					url: "/ps/api/analytics/dataset/" + dataSetId,
					type: "GET",
					async: true,
					timeout: 3000000,
					success: function(data) {
						try {
							//Save data set description data in the model
							oModel.setProperty("/dataset", data);
						} catch (err) {
							MessageToast.show("Caught - dataset fragment get dataset description [ajax success] :" + err.message);
						}
						oBusyIndicator.close();
					},
					error: function(request, status, error) {
						MessageToast.show("Caught - dataset fragment get dataset description [ajax error] :" + request.responseText);
						oBusyIndicator.close();
					}
				});
			}
		}
	});
});
