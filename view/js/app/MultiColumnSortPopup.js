(function(window){
	var MultiColumnSortPopup=function(){
		flexiciousNmsp.UIComponent.apply(this,["div"]);
		this.setWidth(600);
		this.setHeight(220);

		this.currentSorts=[];
		this.cols  = [];
		this.domElement.className="flexiciousGrid flexiciousSortPopup flexiciousMultiSortPopup";

	};
	var p = MultiColumnSortPopup.prototype= new flexiciousNmsp.UIComponent();
	p.typeName=MultiColumnSortPopup.typeName="MultiColumnSortPopup";
	var uiUtil=flexiciousNmsp.UIUtils;
	var flxConstants=flexiciousNmsp.Constants;
	p.getClassNames=function(){
		return ["MultiColumnSortPopup","UIComponent"];
	};

	p.initialize = function(){
		var self = this;
		this.currentSorts=this.grid.getCurrentSorts();
		this.cols = [];
		flexiciousNmsp.UIComponent.prototype.initialize.apply(this);
		for (var i=0;i<this.grid.multiColumnSortNumberFields;i++){
			var srt = this.currentSorts.length>i?this.currentSorts[i]:null;

			var popupRow = new flexiciousNmsp.UIComponent('div');
			popupRow.domElement.className = 'sortPopupRow';

			var leftLabel = new flexiciousNmsp.UIComponent('span');
			leftLabel.domElement.className = 'sortPopupLabel';
			leftLabel.domElement.innerHTML = i==0?flxConstants.MCS_LBL_SORT_BY_TEXT:flxConstants.MCS_LBL_THEN_BY_TEXT;
			popupRow.addChild(leftLabel);


			var listOpener = new flexiciousNmsp.UIComponent('div');
			listOpener.domElement.id = this.grid.__id+'-sort-button-'+i;
			listOpener.domElement.className = 'sortPopupDropdown';
			if(srt!=null)
				listOpener.domElement.setAttribute('uniqueIdentifier', srt.column ? srt.column.getUniqueIdentifier() : this.grid.getColumnByDataField(srt.sortColumn).getUniqueIdentifier());
			listOpener.domElement.innerHTML = srt==null?flxConstants.MCS_LBL_CHOOSE_COLS:srt.column ? srt.column.getUniqueIdentifier() : this.grid.getColumnByDataField(srt.sortColumn).getHeaderText();
			var arrow = new flexiciousNmsp.UIComponent('span');
			arrow.domElement.className = 'sortPopupDownArrow ui-icon ui-icon-triangle-1-s';
			listOpener.addChild(arrow);
			listOpener.addEventListener(listOpener, 'click', this.onSortButtonClick)
			popupRow.addChild(listOpener);

			var ascendingRadio = new flexiciousNmsp.UIComponent('input');
			ascendingRadio.domElement.type = 'radio';
			if(srt == null)
				ascendingRadio.domElement.disabled = 'disabled';
			else
				ascendingRadio.domElement.checked = srt.isAscending? 'checked' : '';
			ascendingRadio.domElement.id = this.grid.__id+'-sort-radio-asc-'+i;
			ascendingRadio.domElement.name = 'srt' + i;
			ascendingRadio.domElement.value = 'asc';

			var ascendingRadioLabel = new flexiciousNmsp.UIComponent('label');
			ascendingRadioLabel.domElement.className = 'sortPopupRadioLabel'
			if(srt == null)
				ascendingRadioLabel.domElement.className += ' disabledLabel';
			ascendingRadioLabel.domElement.id  = this.grid.__id+'-sort-radio-asc-lbl-'+i;
			//ascendingRadioLabel.domElement.innertHTML=flxConstants.MCS_RBN_ASCENDING_LABEL;
			ascendingRadioLabel.addChild(ascendingRadio);
			var radioLabel = new flexiciousNmsp.UIComponent('span');
			radioLabel.setInnerHTML(flxConstants.MCS_RBN_ASCENDING_LABEL);
			ascendingRadioLabel.addChild(radioLabel);


			popupRow.addChild(ascendingRadioLabel);

			var descendingRadio = new flexiciousNmsp.UIComponent('input');
			descendingRadio.domElement.type = 'radio';
			if(srt == null)
				descendingRadio.domElement.disabled = 'disabled';
			else
				descendingRadio.domElement.checked = srt.isAscending? '' : 'checked';
			descendingRadio.domElement.id = this.grid.__id+'-sort-radio-desc-'+i;
			descendingRadio.domElement.name = 'srt' + i;
			descendingRadio.domElement.value = 'desc';

			var descendingRadioLabel = new flexiciousNmsp.UIComponent('label');
			descendingRadioLabel.domElement.className = 'sortPopupRadioLabel'
			if(srt == null)
				descendingRadioLabel.domElement.className += ' disabledLabel';
			descendingRadioLabel.domElement.id  = this.grid.__id+'-sort-radio-desc-lbl-'+i;
			//descendingRadioLabel.domElement.innertHTML=flxConstants.MCS_RBN_DESCENDING_LABEL;
			descendingRadioLabel.addChild(descendingRadio);
			radioLabel = new flexiciousNmsp.UIComponent('span');
			radioLabel.setInnerHTML(flxConstants.MCS_RBN_DESCENDING_LABEL);
			descendingRadioLabel.addChild(radioLabel);

			popupRow.addChild(descendingRadioLabel);

			this.addChild(popupRow);

			var sortList = new flexiciousNmsp.SortColumnsList(this.grid);
			sortList.dropdown = listOpener;
			listOpener.sortList = sortList;
			sortList.domElement.id = this.grid.__id+'-sort-list-'+i;
			sortList.setVisible(false);
			sortList.addEventListener(sortList, 'change', function(event){self.onMenuItemClick(event)});

			this.addChild(sortList);


		}

		var buttonContainer = new flexiciousNmsp.UIComponent('div');
		buttonContainer.domElement.setAttribute('style', 'float:right;padding-top: 10px;padding-bottom: 10px;padding-right: 10px');

		var clearButton = new flexiciousNmsp.UIComponent('a');
		clearButton.domElement.setAttribute('style', 'margin-right : 5px');
		clearButton.domElement.className = 'BTN_CLEAR_ALL button';
		clearButton.domElement.innerHTML = flxConstants.MCS_BTN_CLEAR_ALL_LABEL;
		clearButton.addEventListener(clearButton, 'click', function(event){self.onClearClick(event)});
		buttonContainer.addChild(clearButton);

		var saveButton = new flexiciousNmsp.UIComponent('a');
		saveButton.domElement.setAttribute('style', 'margin-right : 5px');
		saveButton.domElement.className = 'BTN_SAVE_CHANGES button';
		saveButton.domElement.innerHTML = flxConstants.MCS_BTN_APPLY_LABEL;
		saveButton.addEventListener(saveButton, 'click', function(event){self.onApplyClick(event)});
		buttonContainer.addChild(saveButton);

		var closeButton = new flexiciousNmsp.UIComponent('a');
		closeButton.domElement.className = 'BTN_CLOSE button';
		closeButton.domElement.innerHTML = flxConstants.MCS_BTN_CANCEL_LABEL;
		closeButton.addEventListener(closeButton, 'click', function(event){self.closeWindow(event)});
		buttonContainer.addChild(closeButton);

		this.addChild(buttonContainer);

	};

	p.onSortButtonClick = function(event){
		var sortButtonId = event.currentTarget.domElement.id;
		var sortList = document.getElementById(sortButtonId.replace('button' , 'list')).component;
		if(sortList)
			sortList.setVisible(!sortList.getVisible());
	};

	p.onMenuItemClick= function(event){
		console.log(event.currentTarget.getSelectedItem().getHeaderText());
		var col=event.currentTarget.getSelectedItem();
		var dropdown = event.currentTarget.dropdown;
		var idx = parseInt(dropdown.domElement.id.substr(dropdown.domElement.id.length-1,1));
		var grid =  col.level.grid;
		//var hiddenInput=document.getElementById(grid.__id+'-sort-value-'+idx);


		//if(uiUtil.adapter.typeName=='JQueryAdapter')
		dropdown.domElement.innerHTML= this.getLabelFromColumn(col)+'<span class="sortPopupDownArrow ui-icon ui-icon-triangle-1-s"></span>';
		dropdown.domElement.setAttribute('uniqueIdentifier', col.getUniqueIdentifier());
		var cbAsc=document.getElementById(grid.__id+'-sort-radio-asc-'+idx);
		var cbDesc=document.getElementById(grid.__id+'-sort-radio-desc-'+idx);

		cbAsc.disabled="";
		cbDesc.disabled="";
		if(!cbAsc.checked &&!cbDesc.checked)
			cbAsc.checked="checked";
		uiUtil.detachClass(document.getElementById(grid.__id+'-sort-radio-desc-lbl-'+idx),"disabledLabel");
		uiUtil.detachClass(document.getElementById(grid.__id+'-sort-radio-asc-lbl-'+idx),"disabledLabel");
	}

	p.getLabelFromColumn=function (col){
		var arr= [col.getHeaderText()];
		var i=1;
		while(i<col.getLevel().getNestDepth()){
			i++;
			arr.push(">");
		}
		return arr.reverse().join(" ");

	};
	p.onClearClick = function(evt){
		var grid = this.grid;
		grid.removeAllSorts();
		this.closeWindow(evt);
	};
	p.onApplyClick = function(evt){
		var grid =  this.grid;
		grid.removeAllSorts();
		for (var i=0;i<grid.multiColumnSortNumberFields;i++){
			var uniqueId=document.getElementById(grid.__id+'-sort-button-'+i).getAttribute('uniqueIdentifier');
			if(uniqueId){
				var colUnique = uniqueId;
				var col=grid.getColumnLevel().getColumnByDataField(colUnique ,"uniqueIdentifier",true);
				var ascendingRadio = document.getElementById(grid.__id+'-sort-radio-asc-'+i);
				var srt = new flexiciousNmsp.FilterSort();
				srt.column = col;
				srt.sortColumn=col.getSortFieldName();
				srt.isAscending =ascendingRadio.checked;
				srt.column.getLevel().addSort(srt);
			}
		}
		grid.rebuildBody();
		grid.rebuildHeader();
		this.closeWindow(evt);
	};
	p.closeWindow=function (evt){
		for (var i=0;i<this.grid.multiColumnSortNumberFields;i++){
			document.getElementById(this.grid.__id+'-sort-button-'+i).component.sortList.kill();
		}
		uiUtil.removePopUp(this);
	};

	p.grid=null;
	flexiciousNmsp.CustomMultiColumnSortPopup = MultiColumnSortPopup;
	flexiciousNmsp.CustomMultiColumnSortPopupRenderer = new flexiciousNmsp.ClassFactory(MultiColumnSortPopup);
}(window));

(function(window){
	"use strict";
	var SortColumnsList, uiUtil = flexiciousNmsp.UIUtils ,  flxConstants = flexiciousNmsp.Constants;
	SortColumnsList = function(grid){
		flexiciousNmsp.UIComponent.apply(this, ["div"]);
		this.domElement.className = 'sortColumnList';

		this._grid = grid;
		this._enableMultiSelect = false;
		this._selectedItems = [];
		this._selectedItem = null;
		this._selectedIndices = [];
		this._selectedIndex = -1;
		this._list = [];

		if(grid)
			this.rebuild();
	};

	flexiciousNmsp.SortColumnsList = SortColumnsList; //add to name space
	SortColumnsList.prototype = new flexiciousNmsp.UIComponent(); //setup hierarchy
	SortColumnsList.prototype.typeName = SortColumnsList.typeName = 'SortColumnsList';//for quick inspection
	SortColumnsList.prototype.getClassNames=function(){
		return ["SortColumnsList","UIComponent"]; //this is a mechanism to replicate the "is" and "as" keywords of most other OO programming languages
	};

	var a = SortColumnsList.prototype;

	a.setGrid = function(grid){
		if(this._grid == grid)
			return;
		this._grid = grid;
		this.rebuild();
	};

	a.getGrid = function(){
		return this._grid;
	};

	a.flush = function(){
		for(var i = 0 ; i < this._list.length; i++){
			this._list[i].kill();
		}
	};

	a.rebuild =  function(){
		var level = null;
		this.flush();
		this.domElement.innerHTML = '';
		this._list = [];
	    do{
		    if(!level)
				level = this.getGrid().getColumnLevel();
			else
				level = level.nextLevel;
			if(!level.headerVisible)
				continue;
			var list = new flexiciousNmsp.UIList();
			list.setHeaderText(level.name);
			list.setItemRenderer(new flexiciousNmsp.ClassFactory(flexiciousNmsp.UIListSortColumnItemRenderer));
			list.setDataProvider(level.getSortableColumns());
			list.addEventListener(list,  flexiciousNmsp.UIListEvent.SELECTION_CHANGE, this.onListSelectionChange);
			this.addChild(list);
			this._list.push(list);
		} while(level.nextLevel);
	};

	a.onListSelectionChange = function(event){
		this.parent.setSelectedItem(event.getList().getSelectedItem());
		this.parent.invalidateSelection(event) // TODO propably need to move into  neutraliseSelection
	};

	a.neutraliseSelection = function(from){
		if(from == 'selectedItem'){

		} else if(from == 'selectedIndex') {

		} else {
			// noop
		}
	};

	a.setSelectedIndex = function(selectedIndex){
		if(selectedIndex === this._selectedIndex)
			return;
		this._selectedIndex = selectedIndex;
		// a.neutraliseSelection('selectedIndex'); * TODO need to implement
	};

	a.getSelectedIndex = function(){
	    return this._selectedIndex;
	};

	a.setSelectedItem = function(selectedItem){
		if(this._selectedItem === selectedItem)
		 	return;
		this._selectedItem = selectedItem;
		this.dispatchEvent(new flexiciousNmsp.BaseEvent("change")); // TODO need to move to neutralizeSelection after implement the selectedIndex logic.
		// this.neutralizeSelection('selectedItem') TODO need to implement in future

		//this.invalidateSelection();  TODO need to take care here if enable multi select applied :)
	};


	// TODO hold on baby. this method logic and signature met the current requirement.
	// currently it has a param, that is for refer the UI list change event. mey be we need to remove that param in future.
	// and this method is currently working based on fully depend on single selection. if any selection occur, then it will deselect the previous list selection in the group.
	a.invalidateSelection = function(param){
	    var cList = param.getList();
		for(var i  = 0 ; i < this._list.length; i++){
			if(cList == this._list[i])
				continue;
			this._list[i]._selectedIndex = (-1);
			this._list[i].invalidateSelection();
		}
	};

	a.getSelectedItem = function(){
		return this._selectedItem;
	};


	// oops.. multi select stuffs need to implement
	a.setEnableMultiSelect = function(multiSelect){
		this._enableMultiSelect = multiSelect;
	};

	a.isEnableMultiSelect = function(){
		return this._enableMultiSelect;
	};

	a.setSelectedIndices = function(selectedIndices){

	};

	a.getSelectedIndices = function(){
		return this._selectedIndices;
	};

	a.setSelectedItems = function(selectedItems){

	};

	a.getSelectedItems = function(){
		return this._selectedItems;
	}


}(window));


(function(window){

	var UIList = function(){
		flexiciousNmsp.UIComponent.apply(this,['div']);
		this.domElement.setAttribute('style', 	'display : inline-block');
		this.domElement.className = 'uilist'

		this._selectedItemUI = null; // refrerence to selected dom in list
		this._itemsUI = [];
		this.listBody = null;

		this._headerText = "Header";
		this._dataProvider = [];
		this._selectedItem = null;
		this._selectedIndex = -1;
		this._itemRenderer = new flexiciousNmsp.ClassFactory(flexiciousNmsp.UIListDefaultItemRenderer);
		this.uiListHeaderStyleName = 'uiListHeaderStyle';
		this.uiListBodyStyleName = 'uilist-body';
		this.uiListItemStyleName = 'uiListItemStyle';
	};

	flexiciousNmsp.UIList = UIList;
	UIList.prototype = new flexiciousNmsp.UIComponent();
	UIList.prototype.typeName = UIList.typeName = 'UIList';
	UIList.prototype.getClassNames=function(){
		return ["UIList","UIComponent"];
	};
	var a = UIList.prototype;

	a.setHeaderText = function(headerText){
		if(this._headerText == headerText)
			return;
		this._headerText = headerText;
		$(this.domElement).find(this.uiListHeaderStyleName).html(headerText);
	};

	a.flush = function(){
		for(var i = 0; i < this._itemsUI.length; i++){
			this._itemsUI[i].kill();
		}
	};

	a.setItemRenderer = function(renderer){
		this._itemRenderer = renderer;
		//this.rebuild();
	};

	a.getItemRenderer = function(){
		return this._itemRenderer;
	};

	a.rebuild = function(){
		this.flush();
		this.setInnerHTML('');
		this._itemsUI = [];
		this.buildHeader();
		this.buildBody();
		var that = this;

		for(var i = 0; i < this._dataProvider.length; i++){
			var item = this._dataProvider[i];
			var itemUI = this.getItemRenderer().newInstance();
			itemUI.setData(item);
			itemUI.domElement.setAttribute('list-index', i);
			itemUI.domElement.className = this.uiListItemStyleName;
			this.listBody.addChild(itemUI);
			this._itemsUI.push(itemUI);

			// events..
			itemUI.addEventListener(itemUI, 'click', function(event){
				var clickedItemUI = event.currentTarget.domElement;
				var index = parseInt(clickedItemUI.getAttribute('list-index'));
				that.setSelectedIndex(index);
			});
		}
	};

	a.buildHeader = function(){
		var header = new flexiciousNmsp.UIComponent('span');
		header.domElement.innerHTML = this._headerText;
		header.domElement.className = this.uiListHeaderStyleName;
		this.addChild(header);
	};

	a.buildBody  = function(){
		this.listBody = new flexiciousNmsp.UIComponent('div');
		this.listBody.domElement.className = this.uiListBodyStyleName;
		this.addChild(this.listBody);
	};



	a.setSelectedIndex = function(selectedIndex){
		if(this._selectedIndex == selectedIndex)
			return;
		if(selectedIndex >= this.getDataProvider().length)
			throw "index out of bounds";
		if(selectedIndex < -1)
			selectedIndex = -1;
		this._selectedIndex = selectedIndex;
		this.neutralizeSelection('selectedIndex');
	};

	a.getSelectedIndex = function(){
		return this._selectedIndex;
	};

	a.setSelectedItem = function(selectedItem){
		if(this._selectedItem == selectedItem)
			return;
		this._selectedItem = selectedItem;
		this.neutralizeSelection('selectedItem');
	};

	a.getSelectedItem = function(){
		return this._selectedItem;
	};

	a.neutralizeSelection = function(from){
		if(from == 'selectedIndex'){
			this._selectedItem = this.getSelectedIndex() > -1 ? this.getDataProvider()[this.getSelectedIndex()] : null;
		} else if(from == 'selectedItem') {
			this._selectedIndex = this.getDataProvider().indexOf(this.getSelectedItem());
		} else {
			// noop
		}
		this.invalidateSelection();
		this.dispatchEvent(new flexiciousNmsp.UIListEvent(flexiciousNmsp.UIListEvent.SELECTION_CHANGE, this));
	};

	a.invalidateSelection = function(){
		if(this._selectedItemUI)
			$(this._selectedItemUI.domElement).removeClass('active');
		if(this._selectedIndex > -1) {
			this._selectedItemUI = this._itemsUI[this._selectedIndex];
			$(this._selectedItemUI.domElement).addClass('active');
		}
	};


	a.setDataProvider = function(dp){
		this._dataProvider = dp;
		this.rebuild();
	}

	a.getDataProvider = function(){
		return this._dataProvider;
	};

}(window));



(function(window){
	var UIListDefaultItemRenderer = function(){
		flexiciousNmsp.UIComponent.apply(this,['span']);
		this._data = null;
	};


	flexiciousNmsp.UIListDefaultItemRenderer = UIListDefaultItemRenderer; //add to name space
	UIListDefaultItemRenderer.prototype = new flexiciousNmsp.UIComponent(); //setup hierarchy
	UIListDefaultItemRenderer.prototype.typeName = UIListDefaultItemRenderer.typeName = 'UIListDefaultItemRenderer';//for quick inspection
	UIListDefaultItemRenderer.prototype.getClassNames=function(){
		return ["UIListDefaultItemRenderer","UIComponent"]; //this is a mechanism to replicate the "is" and "as" keywords of most other OO programming languages
	};

	UIListDefaultItemRenderer.prototype.setData = function(data){
		this._data = data;
		this.domElement.innerHTML = data;
	};

}(window));



(function(window){
	var UIListSortColumnItemRenderer = function(){
		flexiciousNmsp.UIComponent.apply(this,['span']);
		this._data = null;
	};

	flexiciousNmsp.UIListSortColumnItemRenderer = UIListSortColumnItemRenderer; //add to name space
	UIListSortColumnItemRenderer.prototype = new flexiciousNmsp.UIComponent(); //setup hierarchy
	UIListSortColumnItemRenderer.prototype.typeName = UIListSortColumnItemRenderer.typeName = 'UIListSortColumnItemRenderer';//for quick inspection
	UIListSortColumnItemRenderer.prototype.getClassNames=function(){
		return ["UIListSortColumnItemRenderer","UIComponent"]; //this is a mechanism to replicate the "is" and "as" keywords of most other OO programming languages
	};

	UIListSortColumnItemRenderer.prototype.setData = function(data){
		this._data = data;
		this.domElement.innerHTML = data.getHeaderText();
	};

}(window));


(function(window){
	var UIListEvent = function(type, list, bubble, cancelable){
		flexiciousNmsp.BaseEvent.apply(this, [type, bubble, cancelable]);
		this._list = list;
	}
	flexiciousNmsp.UIListEvent = UIListEvent;
	UIListEvent.prototype = new flexiciousNmsp.UIComponent();
	UIListEvent.prototype.typeName = UIListEvent.typeName = 'UIListEvent';
	UIListEvent.prototype.getClassNames=function(){
		return ["UIListEvent","UIComponent"];
	};
	var a = UIListEvent.prototype;

	a.getList = function(){
		return this._list;
	};

	a.getType = function(){
		return this.type;
	};

	UIListEvent.SELECTION_CHANGE = 'selectionChange';
}(window));
