/**
 * Created by 19.06.2013-7pm on 03-Oct-15.
 */
var GridConFig = window.GridConFig = {
    ApiCallBaseUrl : "http://localhost/sal/api.php/",
    XmlConfig : {
        sampleGrid: '<grid ' +
                        'height="100%" ' +
                        'width="100%" ' +
                        'enablePrint="true" ' +
                        'enableExport="true" ' +
                        'forcePagerRow="true" ' +
                        'enableFilters="true" ' +
                        'pagerRowHeight = "35" ' +
						'enablePreferencePersistence="true" '+
                        'rowHeight = "30" ' +
                        'pageSize = "15" '+
                        'pageIndex = "1" '+
                        'horizontalScrollPolicy="auto" ' +
                        'selectionColor="transparent" ' +
                        'showSpinnerOnFilterPageSort="true" ' +
                        'enableDrillDown = "true" ' +
                        'nestIndent="36" ' +
                        'filterPageSortMode="server" ' +
                        'enableDefaultDisclosureIcon="false" '+
                        'enablePaging="true" ' +
                        'pagerRenderer="flexiciousNmsp.CustomPagerRenderer" ' +
                        'multiSortRenderer="flexiciousNmsp.CustomMultiColumnSortPopupRenderer" '+
                        'filterPageSortChange="filerPageSortHandle" '+
                        'enableMultiColumnSort="true" ' +
                        'enableColumnHeaderOperation="true" ' +
                        'selectionMode="multipleRows"> ' +
                            '<level name="Top Level" headerHeight="30" childrenField="children" itemLoad="itemLoadHandler"  itemLoadMode="server" childrenCountField="childCounts">' +
                                '<columns>' +
                                    '<column dataField="record_type" width="200" headerText="Record Type" ' +
                                            'enableHierarchicalNestIndent="true" paddingLeft="25" enableExpandCollapseIcon="true"  filterControl="MultiSelectComboBox" filterOperation="Contains" filterTriggerEvent="enterKeyUpOrFocusOut" filterComboBoxDataProvider= "eval__getFilterComboBoxDP_RecordType()" />' +
                                    '<column filterControl="TextInput" filterOperation="Contains" filterTriggerEvent="enterKeyUpOrFocusOut" dataField="record" width="350" headerText="Record"/>' +
                                    '<column filterControl="TextInput" filterOperation="Contains" filterTriggerEvent="enterKeyUpOrFocusOut" dataField="site" width="100" headerText="Site"/>' +
                                    '<column filterControl="TextInput" filterOperation="Contains" filterTriggerEvent="enterKeyUpOrFocusOut" dataField="system" width="100" headerText="System"/>' +
                                    '<column filterControl="DateComboBox"  dataField="start_time"  width="350" headerText="Start Time" labelFunction="startTimeLabelFunction"/>' +
                                    '<column filterControl="TextInput" filterOperation="Contains" filterTriggerEvent="enterKeyUpOrFocusOut" dataField="run_time"  width="100" headerText="Run Time" labelFunction="runTimeLabelFunction"/>' +
                                    '<column filterControl="TextInput" filterOperation="Contains" filterTriggerEvent="enterKeyUpOrFocusOut" dataField="status" headerRenderer="CustomHeaderRender"  width="100" headerText="status" labelFunction="statusLabelFunction"/>' +
                                    '<column filterControl="TextInput" filterOperation="Contains" filterTriggerEvent="enterKeyUpOrFocusOut" dataField="jenkins" width="100" headerText="jenkins" />' +
                                    '<column filterControl="TextInput" filterOperation="Contains" filterTriggerEvent="enterKeyUpOrFocusOut" dataField="result"  width="100" headerText="result"/>' +
									'<column filterControl="DateComboBox"  dataField="start_time"  width="350" headerText="Start Time" labelFunction="startTimeLabelFunction"/>' +
                                    '<column filterControl="TextInput" filterOperation="Contains" filterTriggerEvent="enterKeyUpOrFocusOut" dataField="run_time"  width="100" headerText="Run Time" labelFunction="runTimeLabelFunction"/>' +
                                    '<column filterControl="TextInput" filterOperation="Contains" filterTriggerEvent="enterKeyUpOrFocusOut" dataField="status" headerRenderer="CustomHeaderRender"  width="100" headerText="status" labelFunction="statusLabelFunction"/>' +
                                    '<column filterControl="TextInput" filterOperation="Contains" filterTriggerEvent="enterKeyUpOrFocusOut" dataField="jenkins" width="100" headerText="jenkins" />' +
                                    '<column filterControl="TextInput" filterOperation="Contains" filterTriggerEvent="enterKeyUpOrFocusOut" dataField="result"  width="100" headerText="result"/>' +
                                '</columns>' +
                                '<nextLevel>' +
                                    '<level name="Second Level" nestIndent="36" headerHeight="35" reusePreviousLevelColumns="true" rowHeight="35" childrenField="children" filterVisible="false" />' +
                                '</nextLevel>' +
                            '</level>' +
                        '</grid>'
    }
};

// grid callbacks
function getFilterComboBoxDP_RecordType(){
	 return [    
        {label:'Batch',data:'batch'},
		{label:'Profile',data:'profile'},        
        {label:'Testcase',data:'testcase'}    
    ];
   } 

var itemLoadHandler = function(event){
    var parentData = event.filter.parentObject;
    $.ajax({
        url : GridConFig.ApiCallBaseUrl,
        data : {name : "child_data", parent_id : parentData.id},
        type : "GET",
        success : function(res){
            var response = JSON.parse(res);
            if(response.success){
                var grid = event.target;
                grid.setChildData(parentData, response.data, event.filter.level.getParentLevel());
            } else {
                alert(response.message);
            }
        }
    });
};


var filerPageSortHandle = function(event){
   setTimeout(function () {
       var filterPageSort = {};
       var grid = event.target;
       if(event.cause == "pageChange"){
           filterPageSort.pageIndex = event.triggerEvent.currentTarget._pageIndex;
       } else{
           filterPageSort.pageIndex = grid.getColumnLevel()._pageIndex;
       }
       filterPageSort.pageSize = grid.getPageSize();
       var sorts = event.target.getCurrentSorts();
       if(sorts && sorts.length){
           filterPageSort.sorts = [];
           for(var i = 0; i <  sorts.length; i++){
               filterPageSort.sorts.push({
                   sortColumn : sorts[i].sortColumn,
                   isAscending : sorts[i].isAscending,
                   sortNumeric : sorts[i].sortNumeric
               });
           }
       }
       var filter = event.target.getRootFilter();
       if(filter.filterExpressions && filter.filterExpressions.length){
           filterPageSort.filters = [];
           for(var i = 0; i <  filter.filterExpressions.length; i++){
               filterPageSort.filters.push({
                   columnName : filter.filterExpressions[i].columnName,
                   value : filter.filterExpressions[i].expression,
                   filterOperation : filter.filterExpressions[i].filterOperation,
                   filterComparisonType : filter.filterExpressions[i].filterComparisionType
               });
           }
       }

       $.ajax({
           url : GridConFig.ApiCallBaseUrl,
           data : {name : "top_data", filterPageSort : JSON.stringify(filterPageSort)},
           type : "GET",
           success : function(res){
               var response = JSON.parse(res);
               if(response.success){
                   grid.setDataProvider(response.data);
                   if(event.cause == "filterChange")
                       grid.setTotalRecords(response.details.totalRecords);
               }else{
                   alert(data);
               }
           }
       });
   },1);
};

var runTimeLabelFunction  = function(data, col){
    var totalSec = Math.round(data["run_time"]/1000);
    var hours = parseInt( totalSec / 3600 ) % 24;
    var minutes = parseInt( totalSec / 60 ) % 60;
    var seconds = totalSec % 60;

    return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
};

var startTimeLabelFunction = function(data, col){
    var start_date = data["start_time"];
    return new Date(Date.parse(start_date)).toString();
};

var statusLabelFunction=function(data, col){
    var status = data["status"];
    if(status.toLowerCase() == "stopped")
        return "<span style='color: #ff4545; font-weight: bold'>Stopped</span>";
    else if(status.toLowerCase() == "running")
        return "<span style='color: #3434FF; font-weight: bold'>Running</span>";
    else if(status.toLowerCase() == "passed")
        return "<span style='color: #458F00; font-weight: bold'>Passed</span>";
    else if(status.toLowerCase() == "failed")
        return "<span style='color: #FF0000; font-weight: bold'>Failed</span>";
    return "";
};
