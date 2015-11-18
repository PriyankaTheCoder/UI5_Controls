jQuery.sap.declare("sap.demo.controls.JSONControl");
jQuery.sap.includeStyleSheet("css/style.css");

sap.ui.define(["sap/ui/core/Control", "sap/ui/base/DataType", "sap/m/Panel", "sap/m/Text", "sap/ui/core/Icon", "sap/m/Button", "sap/ui/layout/VerticalLayout", "sap/ui/layout/HorizontalLayout", "sap/demo/controls/Text", "sap/m/Input", "sap/m/TextArea", "sap/m/ScrollContainer", "sap/m/Dialog", "sap/m/Popover", "sap/m/List", "sap/m/CustomListItem","sap/ui/layout/FixFlex","sap/ui/layout/Grid","sap/suite/ui/commons/HeaderContainer"	], function(Control, DataType, Panel, Text, Icon, Button, VerticalLayout, HorizontalLayout, customText, Input, TextArea, ScrollContainer, Dialog, Popover, List, ListItem, FixFlex,Grid,HeaderContainer) {

    Control.extend("sap.demo.controls.JSONControl", {

        metadata: {
            properties: {
                json: {
                    type: "string"
                },
                editable: {
                    type: "boolean",
                    defaultValue: true
                }
            },
            aggregations: {
                _expandbutton: {
                    type: "sap.ui.core.Icon",
                    multiple: false
                },
                _collapsebutton: {
                    type: "sap.ui.core.Icon",
                    multiple: false
                },
                _savebutton: {
                    type: "sap.ui.core.Icon",
                    multiple: false
                },
                _copybutton: {
                    type: "sap.ui.core.Icon",
                    multiple: false
                },
                _mainLayout: {
                    type: "sap.ui.layout.Grid",
                    multiple: false
                }

            }
        },

        init: function() {
            var oControl = this,
                oExpandButton, oCollapseButton, oSave;
            oExpandButton = new Icon({
                src: "sap-icon://expand-group",
                size: "0.875em",
                tooltip: "expand all",
                press: this._expandGroup.bind(oControl)
            });

            oCollapseButton = new Icon({
                src: "sap-icon://collapse-group",
                size: "0.875em",
                tooltip: "collapse all",
                press: this._collapseGroup.bind(oControl)
            });

            oSaveButton = new Icon({
                src: "sap-icon://save",
                size: "0.875em",
                tooltip: "save",
                press: this._save.bind(oControl)
            });

            oCopyButton = new Icon({
                src: "sap-icon://documents",
                size: "0.875em",
                tooltip: "copy",
                press: this._copy.bind(oControl)
            });
            var oMainLayout = new Grid({defaultSpan:"L9 M12 S12"});
            this.setAggregation("_expandbutton", oExpandButton);
            this.setAggregation("_collapsebutton", oCollapseButton);
            this.setAggregation("_savebutton", oSaveButton);
            this.setAggregation("_copybutton", oCopyButton);
            this.setAggregation("_mainLayout", oMainLayout);

        },

        _parseJSONstring: function() {
            var jsonstr = this.getJson();
            if (jsonstr !== undefined) {
                try {
                    var jsonObj = jQuery.parseJSON(jsonstr);
                } catch (e) {
                    this._container.addContent(new Text({
                        text: "Invalid JSON"
                    }));
                    return;
                }

                //  create the object
                this._createJsonObject(jsonObj);
            }
        },

        _createJsonObject: function(obj) {
            var oControl = this;
            var collapse = new Icon({
                src: "sap-icon://collapse",
                size: "0.65rem",
                press: this._collapsed.bind(oControl)
            });

            var remove = new Icon({
                src: "sap-icon://sys-cancel",
                size: "0.65rem",
                press: this._deleteNode.bind(oControl)
            });
            remove.addStyleClass("sapUiTinyMarginBegin");
            var addNodes = new Icon({
                src: "sap-icon://add-product",
                size: "0.8rem",
                press: this._openPopover.bind(oControl)
            });
            addNodes.addStyleClass("sapUiTinyMarginBegin");
            var hlayout = new HorizontalLayout();

            this._setText("{", hlayout, "default");
            hlayout.addContent(collapse);
            if (oControl.getEditable() === true) {
                hlayout.addContent(addNodes);
                hlayout.addContent(remove);
            }
            this._container.addContent(hlayout);
            var content = new VerticalLayout();
            content.addContent(new VerticalLayout());
            var objectKeys = Object.keys(obj);
            for (var keys in obj) {
                var addComma = this._ifaddComma(objectKeys);
                setTimeout(this._getChildren.bind(oControl),0,obj, keys, content, addComma );
                hlayout.addContent(content);
            }

            this._setText("}", this._container, "default");
        },

        _getChildren: function(obj, key, parentNode, comma) {
            var oControl = this;
            var context;
            var objContent = new HorizontalLayout();
            var childObj;
            var collapse = new Icon({
                src: "sap-icon://collapse",
                size: "0.65rem",
                press: this._collapsed.bind(oControl)
            });
            var remove = new Icon({
                src: "sap-icon://sys-cancel",
                size: "0.65rem",
                press: this._deleteNode.bind(oControl)
            });
            remove.addStyleClass("sapUiTinyMarginBegin");
            var addNodes = new Icon({
                src: "sap-icon://add-product",
                size: "0.8rem",
                press: this._openPopover.bind(oControl)
            });
            addNodes.addStyleClass("sapUiTinyMarginBegin");
            context = key;
            this._setText(context, objContent, "key");
            var childObj = obj[key];
            if (Array.isArray(obj[key])) {
            	 setTimeout(this._getArrayChild.bind(oControl),0,parentNode, childObj, objContent, collapse, remove, addNodes, comma, true);
            } else if (!Array.isArray(obj[key]) && typeof(obj[key]) === "object") {
            	setTimeout(this._getObjectChild.bind(oControl),0,parentNode, childObj, objContent, collapse, remove, addNodes, comma, true)

            } else {
                context = ":";
                this._setText(context, objContent, "default");
                setTimeout(this._getValue.bind(oControl),0,childObj, parentNode, objContent, remove, comma);
            }

        },


        _getArrayElements: function(element, parentNode, comma) {
            var oControl = this;
            var context;
            var objContent = new HorizontalLayout();
            var collapse = new Icon({
                src: "sap-icon://collapse",
                size: "0.65rem",
                press: this._collapsed.bind(oControl)
            });
            var remove = new Icon({
                src: "sap-icon://sys-cancel",
                size: "0.65rem",
                press: this._deleteNode.bind(oControl)
            });
            remove.addStyleClass("sapUiTinyMarginBegin");
            var addNodes = new Icon({
                src: "sap-icon://add-product",
                size: "0.8rem",
                press: this._openPopover.bind(oControl)
            });
            addNodes.addStyleClass("sapUiTinyMarginBegin");
            var childObj = element;
            if (Array.isArray(element)) {
            	setTimeout(this._getArrayChild.bind(oControl),0,parentNode, childObj, objContent, collapse, remove, addNodes, comma);

            } else if (!Array.isArray(element) && typeof(element) === "object") {
            	setTimeout(this._getObjectChild.bind(oControl),0,parentNode, childObj, objContent, collapse, remove, addNodes, comma);

            } else {
            	setTimeout(this._getValue.bind(oControl),0,childObj, parentNode, objContent, remove, comma);
            }
        },

        _getArrayChild: function(parentNode, obj, objContent, collapse, remove, addNodes, comma, flag) {
            var context;
            var oControl = this;
            var arr;
            if (flag !== undefined && flag === true) {
                context = ": [";
                arr = JSON.parse(JSON.stringify(obj));
            } else {
                context = '[';
                arr = Object.keys(obj);
            }
            this._setText(context, objContent, "default");
            objContent.addContent(collapse);
            if (oControl.getEditable() === true) {
                objContent.addContent(addNodes);
                objContent.addContent(remove);
            }

            parentNode.addContent(objContent);
            var content = new VerticalLayout();
            content.addContent(new VerticalLayout());

            for (var i = 0; i < obj.length; i++) {
                var addComma = this._ifaddComma(arr);
                setTimeout(this._getArray.bind(oControl),0,obj[i], content, addComma);
                objContent.addContent(content);
            }
            context = ']';
            parentNode.addContent(objContent);
            this._setText(context, parentNode, "default", null, comma);
        },
        _getObjectChild: function(parentNode, obj, objContent, collapse, remove, addNodes, comma, flag) {
            var context;
            var oControl = this;
            if (obj !== null && obj !== undefined) {
                if (flag !== undefined && flag === true) {
                    context = ": {"
                } else {
                    context = '{';
                }

                this._setText(context, objContent, "default");
                objContent.addContent(collapse);

                if (oControl.getEditable() === true) {
                    objContent.addContent(addNodes);
                    objContent.addContent(remove);
                }
                parentNode.addContent(objContent);
                var content = new VerticalLayout();
                content.addContent(new VerticalLayout());
                var objectKeys = Object.keys(obj);
                for (var keys in obj) {
                    var addComma = this._ifaddComma(objectKeys);
                    setTimeout(this._getChildren.bind(oControl),0,obj, keys, content, addComma);
                    objContent.addContent(content);
                }
                context = '}';
                parentNode.addContent(objContent);
                this._setText(context, parentNode, "default", null, comma);
            } else {
                if (flag !== undefined && flag === true) {
                    context = ":";
                    this._setText(context, objContent, "default");
                }
                context = 'null';
                this._setText(context, objContent, "value");
                this._setText(comma, objContent, "default");
                if (oControl.getEditable() === true) {
                    objContent.addContent(remove);
                }
                parentNode.addContent(objContent);

            }
        },

        _getValue: function(obj, parentNode, objContent, remove, comma) {
            var oControl = this;
            if (typeof(obj) === "number" && !Number.isNaN(obj)) {
                context = obj;
            }
            if (typeof(obj) === "string") {
                context = '"' + obj + '"';
            }
            this._setText(context, objContent, "value");
            this._setText(comma, objContent, "default");
            if (oControl.getEditable() === true) {
                objContent.addContent(remove);
            }

            parentNode.addContent(objContent);
        },

        _ifaddComma: function(objectKeys) {
            var addComma = (objectKeys.length > 1) ? "," : "";
            objectKeys.shift();
            return addComma;
        },

        _setText: function(context, Node, identifier, idx, comma) {
            var oControl = this;
            var text;
            if (this.getEditable() === true && identifier !== "default") {
                text = new customText({
                    doubleClick: this._changeKeyAndValue.bind(oControl)
                });
                if (identifier === "key" || identifier === "value" && !/^\d+$/i.test(context)) {
                    if (context.charAt(0) === '"' && context.charAt(context.length - 1) !== '"' || context.charAt(0) !== '"' && context.charAt(context.length - 1) === '"') {
                        context = "'" + context + "'";
                    }
                    if (context.charAt(0) === "'" && context.charAt(context.length - 1) !== "'" || context.charAt(0) !== "'" && context.charAt(context.length - 1) === "'") {
                        context = '"' + context + '"';
                    }
                    if (context.charAt(0) !== '"' && context.charAt(0) !== "'") {
                        context = '"' + context + '"';
                    }
                }
            } else {
                text = new Text();
                if (identifier === "default") {
                    if (comma !== undefined) {
                        if (comma === ",") {
                            context = context + ',';
                        }
                    }
                }
                if (identifier === "key") {
                    context = '"' + context + '"';
                }
            }

            text.setText(context);
            if (identifier === "key") {
                text.addStyleClass("changeKeyFont");
            } else if (identifier === "value") {
                text.addStyleClass("changeValueFont");
            } else if (identifier === "default") {
                text.addStyleClass("changeDefaultFont sapUiTinyMarginEnd sapUiTinyMarginBegin");
            }
            if (idx !== void(0) && idx !== null) {
                Node.insertContent(text, idx);
            } else {
                Node.addContent(text);
            }
        },

        _expandGroup: function() {
            this._getChildNodes(this._container);
        },

        _expanded: function(oEvent) {
            var oControl = this;
            var source = oEvent.getSource().getParent();
            var layoutContent;
            var lastContent;
            var childcontent;
            var contentArray;
            var parent, parentNode, parentNodeContent;
            var content;
            var indx;
            if (this._content.hasOwnProperty(source.getId())) {
                layoutContent = this._content[source.getId()];
                delete this._content[source.getId()];
            }
            contentArray = source.getContent();
            lastContent = contentArray[contentArray.length - 1];
            source.removeAllContent();
            if (layoutContent !== null && layoutContent !== undefined) {
                layoutContent.forEach(this._insertContent.bind(oControl, source));
                parentNode = null;
                parentNodeContent = source.getContent();
                parentNode = parentNodeContent[parentNodeContent.length - 1];
                if (parentNode !== null) {
                    if (Object.keys(this._content).length > 0) {
                    	 setTimeout(this._getChildNodes.bind(oControl),0,parentNode);
                    }
                }
            }
            parent = source.getParent();
            content = parent.getContent();
            indx = content.indexOf(source);
            parent.insertContent(lastContent, indx + 1);
        },


        _getChildNodes: function(layout) {
            var oControl = this;
            var parentContent = layout.getContent();
            parentContent.forEach(oControl._addChildNodes.bind(oControl));
        },

        _addChildNodes: function() {
            var oControl = this;
            var parent, content, source, contentArray, lastContent, indexIcon, val, key, elemPContent, parentType, parentNodeContent, parentContent, indx, elem;
            elem = arguments[0];
            indx = arguments[1];
            parentContent = arguments[2];
            layoutContent = null
            parentNode = null;
            source = elem;
            parent = source.getParent();
            content = parent.getContent();
            indx = content.indexOf(source);
            elemPContent = parent.getParent().getContent();
            if (elemPContent.length > 1) {
                if (elemPContent[1].getText) {
                    parentType = elemPContent[1].getText().charAt(2);
                } else {
                    parentType = elemPContent[0].getText();
                }
            }
            if (this._content.hasOwnProperty(source.getId())) {
                layoutContent = this._content[source.getId()];
                delete this._content[source.getId()];
            }
            if (source.getContent) {
                if (source.getContent().length > 0) {
                    contentArray = source.getContent();
                    contentArray.forEach(oControl._saveJSONTemplate.bind(oControl));
                    if (source === this._container.getContent()[0] || parentType === '[') {
                        indexIcon = 1;
                    } else {
                        indexIcon = 2;
                    }

                    if (contentArray.length > indexIcon) {
                            if (contentArray[indexIcon].mProperties.hasOwnProperty("src")) {
                                if (contentArray[indexIcon].getSrc() === "sap-icon://expand") {
                                    lastContent = contentArray[contentArray.length - 1];
                                    source.removeAllContent();
                                    layoutContent.forEach(oControl._insertContent.bind(oControl, source));
                                }
                            }
                        
                    }
                    parentNodeContent = source.getContent();
                    parentNodeContent.forEach(oControl._savejsonString.bind(oControl));
                    parentNode = parentNodeContent[parentNodeContent.length - 1];
                    if (parentNode.getContent) {
                        if (parentNode !== null) {
                        	this._getChildNodes(parentNode);
                        }

                        if (contentArray.length > indexIcon) {
                            if (contentArray[indexIcon].mProperties.hasOwnProperty("src")) {
                                if (contentArray[indexIcon].getSrc() === "sap-icon://expand") {
                                    parent.insertContent(lastContent, indx + 1);
                                    oControl._jsonString.push(lastContent.getText());
                                }
                            }
                        }
                        if (content.length - 1 > indx) {
                            if (content[indx + 1].mProperties.hasOwnProperty('text')) {
                                oControl._jsonString.push(content[indx + 1].getText());
                            }
                        }
                    }

                }
            }
        },

        _insertContent: function() {
            var source = arguments[0];
            var element = arguments[1];
            source.addContent(element);
        },
        _collapseGroup: function() {
            var oControl = this;
            var source, lastContent, parent, content, childContent1, childContent2;
            source = this._container.getContent()[0];
            if (source.getContent()[1].getSrc() === "sap-icon://collapse") {
            	setTimeout(this._collapseNode.bind(oControl),0,source,true);
            }
        },

        _collapsed: function(oEvent) {
            var oControl = this;
            var source, lastContent, parent, content, childContent1, childContent2, elemPContent;
            source = oEvent.getSource().getParent();
            setTimeout( this._collapseNode.bind(oControl),0,source);
        },
        _collapseNode: function(source, group) {
            var oControl = this;
            var lastContent, parent, content, childContent1, childContent2, elemPContent, indx;
            var expand = new Icon({
                src: "sap-icon://expand",
                size: "0.65rem",
                press: this._expanded.bind(oControl)
            });
            this._content[source.getId()] = source.getContent();
            childContent1 = source.getContent()[0];
            if (source !== this._container.getContent()[0]) {
                childContent2 = source.getContent()[1];
            }
            source.removeAllContent();
            parent = source.getParent();
            content = parent.getContent();
            indx = content.indexOf(source);
            lastContent = content[indx + 1];
            parent.removeContent(indx + 1);
            source.addContent(childContent1);
            if (typeof(group) === "undefined") {
                elemPContent = parent.getParent().getContent();
                if (elemPContent.length > 1) {
                    if (elemPContent[1].getText) {
                        parentType = elemPContent[1].getText().charAt(2);
                    } else {
                        parentType = elemPContent[0].getText();
                    }
                }
            }
            if (source !== this._container.getContent()[0] && typeof(parentType) !== "undefined" && parentType !== '[') {
                source.addContent(childContent2);
            }

            source.addContent(expand)
            source.addContent(lastContent);
        },

        _savejsonString: function() {
            var elem = arguments[0];
            if (elem.getText) {
                elemPContent = elem.getParent().getContent();
                this._jsonString.push(elem.getText());
            }

        },
        _saveJSONTemplate: function() {
        	var oControl=this;
            var elemPNode, parentType, elemPContent, elemP, content, indx;
            var elem = arguments[0];
            if (elem.mProperties.hasOwnProperty("value")) {
                val = elem.getValue();
                elemPNode = elem.getParent();
                content = elemPNode.getContent();
                elemP = elemPNode.getParent().getParent();
                elemPContent = elemP.getContent();
                if (elemPContent[1].getText) {
                    parentType = elemPContent[1].getText().charAt(2);
                } else {
                    parentType = elemPContent[0].getText();
                }
                indx = content.indexOf(elem);
                 elemPNode.removeContent(indx);
                    if (parentType === '{' && indx === 0) {
                        this._setText(val, elemPNode, "key", indx);
                    } else {
                        this._setText(val, elemPNode, "value", indx);
                    }
                
            }
        },
        _save: function() { // this will save the latest json string
        	var oControl =this;
            var json;
            this._jsonString = [];
            setTimeout(function(){
            	oControl._getChildNodes(oControl._container);
                json = oControl._jsonString.join('');
                oControl.setJson(json);
            },0)
            
        },

        _onCancel: function() { // on close the copy dialog
            this._oDialog.close();
            this._oDialog.removeAllContent()
            this._oDialog.removeAllButtons()
            this._oDialog.destroy();
            this._oDialog = null;
        },
        _copy: function() { // a dialog will pop up with text-area which contains the latest saved json in string format. User can copy the json string.
            var oControl = this;
            var json;
            var textarea, button, text, verticalLayout, val;
            var os = {};
            os[sap.ui.Device.os.OS.WINDOWS] = "CTRL+C";
            os[sap.ui.Device.os.OS.MACINTOSH] = "Command-C";
            os[sap.ui.Device.os.OS.LINUX] = " CTRL+C";

            //JSON string
            json = this.getJson();

            // get the OS on which the application is running
            for (var keys in os) {
                if (keys === sap.ui.Device.os.name) {
                    val = 'Press ' + os[keys] + ' to copy';
                }
            }

            //textArea where the json string is available
            textarea = new TextArea({
                enabled: false,
                width: "100%",
                rows: 6
            });

            textarea.setValue(json);
            textarea.addStyleClass("sapUiContentPadding");
            //cancel button for dialog
            button = new Button({
                text: "Cancel",
                press: oControl._onCancel.bind(oControl)
            });
            //verticalLayout
            verticalLayout = new VerticalLayout({
                width: "100%"
            });
            verticalLayout.addStyleClass("sapUiContentPadding");
            verticalLayout.addContent(textarea);
            if (this._oDialog === null) {
                this._oDialog = new Dialog({
                    title: val,
                    contentWidth: "50rem",
                    contentHeight: "10rem"
                });
                jQuery.sap.syncStyleClass("sapUiSizeCompact", this._oDialog);
            }
            this._oDialog.addContent(verticalLayout);
            this._oDialog.addButton(button);
            this._oDialog.open();

        },


        _openPopover: function() { // the popover will open once the user click the "add node" icon
            var oControl = this;
            var context1, context2;
            if (arguments[1] !== undefined) {
                var oEvent = arguments[1];
                var parent = arguments[0];
            } else {
                oEvent = arguments[0];
            }
            var oButton = oEvent.getSource();
            context1 = ': {';
            context2 = ': [';
            var oList1 = new ListItem({
                press: oControl._addNode.bind(oControl, oButton, context1)
            });
            var textObject = new Text({
                text: "Add an Object"
            });
            textObject.addStyleClass("changeDefaultFont sapUiTinyMarginBegin sapUiSmallTinyTopBottom");
            oList1.addContent(textObject);
            oList1.setType("Active");
            var oList2 = new ListItem({
                press: oControl._addNode.bind(oControl, oButton, context2)
            })
            var textArray = new Text({
                text: "Add an Array"
            });
            textArray.addStyleClass("changeDefaultFont sapUiTinyMarginBegin sapUiSmallTinyTopBottom");
            oList2.addContent(textArray);
            oList2.setType("Active");
            var oList3 = new ListItem({
                press: oControl._addNode.bind(oControl, oButton)
            })
            var textValue = new Text({
                text: "Add an Entry",
                class: "changeDefaultFont"
            });
            textValue.addStyleClass("changeDefaultFont sapUiTinyMarginBegin sapUiSmallTinyTopBottom");
            oList3.addContent(textValue);

            if (parent === oControl._container) {
                textValue.addStyleClass("changeBackground");
                oList3.setType("Inactive");
            } else {
                textValue.removeStyleClass("changeBackground");
                oList3.setType("Active");
            }
            var oPopover = new Popover({
                showHeader: false,
                showArrow: false,
                contentWidth: "7.5rem",
                contentHeight: "3.75rem",
                content: new List({
                    width: "100%",
                    items: [oList1, oList2, oList3]
                })
            });
            oPopover.openBy(oButton);

        },

        _addNode: function() { // function to add a node to the parent node when a particular item is selected from list item displayed in the popover "oPopover"
            var parent, content, childNode, childNodeContent, previousContent, lastContent, text; // in method _openPopover
            var hlayout, oInput, oInput1, context, text, vLayout;
            var oEvent;
            var oButton = arguments[0];
            if (arguments.length > 3) {
                context = arguments[1];
                oEvent = arguments[2];
            } else {
                oEvent = arguments[1];
            }
            var oControl = this;
            var oPopover = oEvent.getSource().getParent().getParent();
            var collapse = new Icon({
                src: "sap-icon://collapse",
                size: "0.65rem",
                press: this._collapsed.bind(oControl)
            });
            var remove = new Icon({
                src: "sap-icon://sys-cancel",
                size: "0.65rem",
                press: this._deleteNode.bind(oControl)
            });
            remove.addStyleClass("sapUiTinyMarginBegin");
            var addNodes = new Icon({
                src: "sap-icon://add-product",
                size: "0.8rem",
                press: this._openPopover.bind(oControl)
            });
            vLayout = new VerticalLayout();
            vLayout.addContent(new VerticalLayout());
            addNodes.addStyleClass("sapUiTinyMarginBegin");
            parent = oButton.getParent();
            content = parent.getContent();
            hlayout = new HorizontalLayout();
            childNode = content[content.length - 1];
            if (childNode.getContent) {
                childNodeContent = childNode.getContent();
                lastContent = childNodeContent[childNodeContent.length - 1];
                if (lastContent.getContent) {
                    childNodeContent = lastContent.getContent();
                    if (childNodeContent.length > 0) {
                        oControl._setText(',', lastContent, "default", childNodeContent.length - 1);
                    }
                } else if (lastContent.getText) {
                    text = lastContent.getText();
                    lastContent.setText(text + ',');
                }
            }

            if (parent !== oControl._container) {
                if (parent.getParent() !== oControl._container && content[1].getText) {
                    parentType = content[1].getText().charAt(2);
                } else {
                    parentType = content[0].getText();
                }
                oInput = new Input().addStyleClass('sapUiSizeCompact jsonControlInput');
                if (parentType === '[' && context !== undefined) {
                    context = context.charAt(context.length - 1);
                    oControl._setText(context, hlayout, "default");
                } else {
                    hlayout.addContent(oInput);
                    if (context !== undefined) {
                        oControl._setText(context, hlayout, "default");
                    }
                }
            } else {
                childNode = parent;
                parent.removeContent(0);
                context = context.charAt(context.length - 1);
                oControl._setText(context, hlayout, "default");
            }
            if (context !== undefined || parent === oControl._container) {
                hlayout.addContent(collapse);
                hlayout.addContent(addNodes);
                hlayout.addContent(remove);
                hlayout.addContent(vLayout);
            } else {
                if (parentType !== undefined) {
                    if (parentType === '{') {
                        oControl._setText(":", hlayout, "default");
                        oInput1 = new Input().addStyleClass('sapUiSizeCompact jsonControlInput');
                        hlayout.addContent(oInput1);
                    }
                }
                hlayout.addContent(remove);
            }


            childNode.addContent(hlayout);
            if (typeof(context) !== "undefined") {
                if (context.charAt(context.length - 1) === '{') {
                    oControl._setText("}", childNode, "default");
                } else if (context.charAt(context.length - 1) === '[') {
                    oControl._setText("]", childNode, "default");
                }
            }
            oPopover.close();
        },

        _deleteNode: function(oEvent) { // function to delete a node when delete icon  clicked
            var source, childNode, content, indx, previousContent, childNodeContent, lastContent;
            var oControl = this;
            source = oEvent.getSource();
            childNode = source.getParent();
            parent = childNode.getParent();
            content = parent.getContent();
            indx = content.indexOf(childNode);
            var addNodes = new Icon({
                src: "sap-icon://add-product",
                size: "0.8rem",
                press: this._openPopover.bind(oControl, parent)
            });

            childNode.removeAllContent();
            if (content.length - 1 > indx) {
                if (content[indx + 1].getText) {
                    if (content[indx + 1].getText().charAt(0) === ']' || content[indx + 1].getText().charAt(0) === '}') {
                        parent.removeContent(indx + 1);
                    }
                }
            }
            parent.removeContent(indx);
            if (parent === oControl._container) {
                oControl._container.insertContent(addNodes, 0);
            }
            if (indx === content.length - 1 || content[content.length - 1].getText && indx === content.length - 2) {
                previousContent = content[indx - 1];
                if (typeof(previousContent) !== "undefined") {
                    if (previousContent.getContent) {
                        childNodeContent = previousContent.getContent();
                        if (childNodeContent.length > 2) {
                            lastContent = childNodeContent[childNodeContent.length - 2];
                            if (lastContent.getText() === ',') {
                                previousContent.removeContent(lastContent);
                            }
                        }
                    } else if (previousContent.getText) {
                        text = previousContent.getText();
                        text = text.charAt(0);
                        previousContent.setText(text);
                    }
                }
            }

        },


        _changeKeyAndValue: function(oEvent) { // this method is used when the control in in editable state i.e. editable= true, this method is used to change a text 
            var source, parent, content, index, text; // into input field when double clicked. For the same reason a new control has been developed named "Text.js"
            source = oEvent.getSource();
            parent = source.getParent();
            content = parent.getContent();
            index = content.indexOf(source);
            parent.removeContent(index);
            text = source.getText();
            if (index === 0) {
                text = text.substring(1, text.length - 1);
            }
            var input = new Input({
                value: text
            }).addStyleClass('sapUiSizeCompact jsonControlInput');
            parent.insertContent(input, index);
        },
        _container: null,
        _scroll: null,
        _mainLayout: null,
        _fixLayout:null,
        _panel: null,
        _content: {},
        _jsonString: [],
        _oDialog: null,

        setJson: function(sVal) { // set the property json 
            if (sVal) {
                this.setProperty("json", sVal, true);
            }
        },
        setEditable: function(sVal) { // set the property editable
            if (sVal !== undefined) {
                this.setProperty("editable", sVal, false);
            }
        },
        renderer: function(oRm, oControl) {
            jQuery.sap.syncStyleClass(oControl, 'sapUiSizeCompact')
            if (!oControl._mainLayout) {
                var oMainLayout = oControl.getAggregation("_mainLayout");
                oControl._mainLayout = oMainLayout;
                if (oControl.getEditable() === false) {
                    oControl.getAggregation("_savebutton").setVisible(false);
                } else {
                    oControl.getAggregation("_savebutton").setVisible(true);
                }
                var oPanel = new Panel({
                	height:"15rem",
                	 infoToolbar: new sap.m.Toolbar({
                        content: [oControl.getAggregation("_expandbutton"), oControl.getAggregation("_collapsebutton"), oControl.getAggregation("_savebutton"), oControl.getAggregation("_copybutton")]
                    })
                });
                var vlayout = new VerticalLayout();
                var scrollContainer = new ScrollContainer();
                var fixFlex = new FixFlex();
                if (!oControl._scroll) {
                    oControl._scroll = scrollContainer;
                }
                if (!oControl._panel) {
                    oControl._panel = oPanel;
                }
                if (!oControl._container) {
                    oControl._container = vlayout;
                }
                oControl._scroll.addContent(oControl._container);
                oControl._panel.addContent(oControl._scroll);
                oControl._mainLayout.addContent(oControl._panel);
                oControl._parseJSONstring();
                oRm.renderControl(oControl._mainLayout);
            } 
        }

    });

});