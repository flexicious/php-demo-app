<?php
    require_once "model/api_response.php";
    require_once "model/server_records.php";
    require_once "utis/utils.php";
    
    $api_name = "";
    if(isset($_GET["name"]))
        $api_name = $_GET["name"];

    if($api_name != "top_data" && $api_name != "child_data"){
        $response = new Response();
        $response->data = null;
        $response->success = false;
        $response->message = "Unknown Api Call";
        echo json_encode($response);
    } else if($api_name == "top_data"){
        echo json_encode(getTopLevelDataResponse());
    } else if($api_name == "child_data"){
        echo json_encode(getChildLevelDataResponse());
    }

    function getConnection(){
        $serverName = "localhost";
        $username = "root";
        $password = "sa";
        $dbName = "sal_php";
        $conn = new mysqli($serverName, $username, $password, $dbName);
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }
        return $conn;
    }

    function getTopLevelDataResponse(){
        $conn = getConnection();
        $sql = "SELECT * FROM server_records;";
        $result = $conn->query($sql);

        $rawList = array();
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $serverRecord = new ServerRecord();
                $serverRecord->copyFrom($row);
                array_push($rawList, $serverRecord);
            }
        }
        $conn->close();

        $topArray = groupByTopLevel($rawList);

        if(!isset($_GET["filterPageSort"])){
            $response = new Response();
            $response->message = "Data Fetched";
            $response->success = true;
            $response->data = $topArray;
            return $response;
        }

        $filterPageSort = json_decode((string)$_GET["filterPageSort"]);
        $response = doFilterPageSort($topArray, $filterPageSort);
        return $response;
    }
    function getChildLevelDataResponse(){
        $parentId = null;
        if(isset($_GET["parent_id"]))
            $parentId = $_GET["parent_id"];
        if(!isset($parentId)){
            $response = new Response();
            $response->success = false;
            $response->data = null;
            $response->message = "Parent ID is invalid for fetching child..";
            return ($response);
        }

        $conn = getConnection();
        $sql = "SELECT * FROM server_records WHERE record_id = ".$parentId;
        $result = $conn->query($sql);

        $rawList = array();
        if ($result->num_rows > 0) {
            while($row = $result->fetch_assoc()) {
                $serverRecord = new ServerRecord();
                $serverRecord->copyFrom($row);
                array_push($rawList, $serverRecord);
            }
        }
        $conn->close();

        if(!isset($_GET["filterPageSort"])){
            $response = new Response();
            $response->message = "Data Fetched";
            $response->success = true;
            $response->data = $rawList;
            return $response;
        }

        $filterPageSort = json_decode($_GET["filterPageSort"]);
        echo '<span style="color: red; font-size: 30px">'.var_dump($filterPageSort).'</span>' ;
        $response = doFilterPageSort($rawList, $filterPageSort);
        return $response;
    }


    function doFilterPageSort($array, $filterPageSort){
        $utils = new Utils();
        $resultArray = $array;
        if(property_exists($filterPageSort, "filters"))
            $resultArray = $utils->filterArray($array,$filterPageSort->filters);

        //echo '<span style="color: red; font-size: 30px">'.$filterPageSort["sorts"] != null.'</span>' ;
      //  echo '<span style="color: red; font-size: 30px">'.$filterPageSort["sorts"].'</span>' ;

        if(property_exists($filterPageSort, "sorts")) {
            $utils->sortArray($resultArray, $filterPageSort->sorts);
        }

        $response = new Response();
        $totalRecords = count($resultArray);
        if(property_exists($filterPageSort, "pageSize") && $filterPageSort->pageSize != -1){
            if($totalRecords <= $filterPageSort->pageSize){
                $response->details = (object)array("pageSize" => $filterPageSort->pageSize, "pageIndex" => 1, "totalRecords" => $totalRecords);
            } else {
                $startIndex = $filterPageSort->pageSize * ($filterPageSort->pageIndex);
                $resultArray = array_slice($resultArray, $startIndex, $startIndex+$filterPageSort->pageSize < $totalRecords ? $filterPageSort->pageSize : $totalRecords-$startIndex );
                $response->details = (object)array("pageSize" => $filterPageSort->pageSize, "pageIndex" => $filterPageSort->pageIndex, "totalRecords" => $totalRecords);
            }
        }
        $response->data=$resultArray;
        $response->success=true;
        $response->message="Data Fetched Successfully";
        return $response;
    }

    function groupByTopLevel($array){
        $newArray = array();
        $field = "record_id";

        foreach($array as $item){
            if((int)$item->$field == 0)
                array_push($newArray, $item);
        }

        foreach($array as $item){
            foreach($newArray as $parent){
                if($item->$field == $parent->id) {
                    $parent->childCounts++;
                    break;
                }
            }
        }
        return $newArray;
    }
?>

