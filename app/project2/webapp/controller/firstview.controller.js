//import { Fragment } from "react/jsx-runtime";

//const { func } = require("@sap/cds/lib/ql/cds-ql");

//const { message } = require("@sap/cds/lib/log/cds-error");

//const { message } = require("@sap/cds/lib/log/cds-error");

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
    //(Controller) => 
    function (Controller, MessageBox, Fragment, MessageToast, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("captestmvc.project2.controller.firstview", {
            onInit() {
            },

            Submit: function () {
                // alert("You Pressed Submit");
                var title = this.getView().byId("inp1").getValue();
                var author = this.getView().byId("inp2").getValue();
                var price = this.getView().byId("inp3").getValue();
                var stock = this.getView().byId("inp4").getValue();
                var loc = this.getView().byId("inp5").getValue();
                var genre = this.getView().byId("inp6").getValue();
                var oModel = this.getView().getModel();
                //alert(title + " " + author);
                var oContext = oModel.bindList("/Books").create({
                    "title": title,
                    "author": author,
                    "Price": price,
                    "stock": stock,
                    "location": loc,
                    "genre": genre
                });
                oContext.created().then(() => {
                    MessageBox.success("Product Added Successfully");
                    this.getView().byId("inp1").setValue(null);
                    this.getView().byId("inp2").setValue(null);
                    this.getView().byId("inp3").setValue(null);
                    this.getView().byId("inp4").setValue(null);
                    this.getView().byId("inp5").setValue(null);
                    this.getView().byId("inp6").setValue(null);
                }).catch((err) => {
                    MessageBox.error("Error adding item");
                    console.error("Error adding item:" + err);
                });
            },
            onCollapseExpandPress() {
                const oSideNavigation = this.byId("sideNavigation"),
                    bExpanded = oSideNavigation.getExpanded();

                oSideNavigation.setExpanded(!bExpanded);
            },
            onAddBooks() {
                this.hideAllPanels();
                var oPanel = this.byId("_IDGenPanel1");
                oPanel.setVisible(true);
            },

            onViewBooks() {
                this.hideAllPanels();
                var oPanel = this.byId("_IDGenPanel2");
                oPanel.setVisible(true);
            },

            onEditBooks() {
                this.hideAllPanels();
                var oPanel = this.byId("_IDGenPanel3");
                oPanel.setVisible(true);
            },

            hideAllPanels() {
                this.byId("_IDGenPanel1").setVisible(false);
                this.byId("_IDGenPanel2").setVisible(false);
                this.byId("_IDGenPanel3").setVisible(false);

            },
            onActionDel: function (oEvent) {
                var oButton = oEvent.getSource();
                var oContext = oButton.getBindingContext();
                this._oSelectedContext = oContext;

                if (!this._oActionSheet) {
                    Fragment.load({
                        id: this.getView().getId(),
                        name: "captestmvc.project2.view.ActionSheet",
                        controller: this
                    }).then(function (oActionSheet) {
                        this._oActionSheet = oActionSheet;
                        this.getView().addDependent(this._oActionSheet);
                        this._oActionSheet.openBy(oButton);

                    }.bind(this));
                }
                else {
                    this._oActionSheet.openBy(oButton);
                }
            },
            onDeletePress: function () {
                var oContext = this._oSelectedContext;
                var sBookId = oContext.getProperty("ID");
                MessageBox.confirm("Are you sure you want to delete thisbook with id:" + sBookId + "?", {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            oContext.delete("$direct").then(function () {
                                MessageBox.success("Books deleted successfully");
                            }).catch(function (oError) {
                                MessageBox.error("No books Selected for Deletion");
                            });
                        }
                    }
                })

            },
            onEditPress: function () {
                var oData = this._oSelectedContext.getObject();
                this.onEditBooks();
                var product_model = this.getOwnerComponent().getModel();
                let aFilters = [new Filter("ID", FilterOperator.EQ, oData.ID)

                ];
                let oBinding = product_model.bindList("/Books");
                oBinding.filter(aFilters);

                oBinding.requestContexts().then((aContexts) => {
                    //Handel the retrieved Context
                    if (aContexts.length > 0) {
                        aContexts.forEach((oContext) => {
                            let oUser = oContext.getObject();
                            this.getView().byId("inp7").setValue(oUser.title);
                            this.getView().byId("inp9").setValue(oUser.author);
                            this.getView().byId("inp10").setValue(String(oUser.Price));
                            this.getView().byId("inp12").setValue(oUser.stock);
                            this.getView().byId("inp13").setValue(oUser.location);
                            this.getView().byId("inp15").setValue(oUser.genre);
                            this.getView().byId("itemCode").setValue(oUser.ID);

                        });
                    }
                    else {
                        MessageBox.error("No book found with the specified ID");
                    }
                }).catch((oError) => {
                    MessageBox.error("Error retrieving Book details" + oError);
                });


                //var oData = this._oSelectedContext.getObject();
                // MessageToast.show("Edit action for Item ID:" +oData.ID);
            },
            onEdit: function () {
                var itemCode = this.getView().byId("itemCode").getValue();
                var title = this.getView().byId("inp7").getValue();
                var author = this.getView().byId("inp9").getValue();
                var price = this.getView().byId("inp10").getValue();
                var stock = this.getView().byId("inp12").getValue();
                var location = this.getView().byId("inp13").getValue();
                var genre = this.getView().byId("inp15").getValue();

                var update_oModel = this.getView().getModel();
                var sPath = "/Books('" + itemCode + "')";
                var oContext = update_oModel.bindContext(sPath).getBoundContext();
                var oView = this.getView();
                function resetBusy() {
                    oView.setBusy(false);
                }
                oView.setBusy(true);

                oContext.setProperty("title", title);
                oContext.setProperty("author", author);
                oContext.setProperty("Price", price);
                oContext.setProperty("stock", stock);
                oContext.setProperty("location", location);
                oContext.setProperty("genre", genre);

                update_oModel.submitBatch("auto").then(function () {
                    resetBusy();
                    MessageBox.success("Item details updated successfully");
                }).catch(function (err) {
                    resetBusy();
                    MessageBox.error("An error occured while updating the item");
                }
                )
            }
        });
    });