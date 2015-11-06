<?php
/**
 * possible filter operations.
 *   FILTER_OPERATION_TYPE_NONE = "None";
 *   FILTER_OPERATION_TYPE_EQUALS = "Equals";
 *   FILTER_OPERATION_TYPE_NOT_EQUALS = "NotEquals";
 *   FILTER_OPERATION_TYPE_BEGINS_WITH = "BeginsWith";
 *   FILTER_OPERATION_TYPE_ENDS_WITH = "EndsWith";
 *   FILTER_OPERATION_TYPE_CONTAINS="Contains";
 *   FILTER_OPERATION_TYPE_DOES_NOT_CONTAIN = "DoesNotContain";
 *   FILTER_OPERATION_TYPE_GREATER_THAN = "GreaterThan";
 *   FILTER_OPERATION_TYPE_LESS_THAN = "LessThan";
 *   FILTER_OPERATION_TYPE_GREATER_THAN_EQUALS = "GreaterThanEquals";
 *   FILTER_OPERATION_TYPE_LESS_THAN_EQUALS = "LessThanEquals";
 *   FILTER_OPERATION_TYPE_IN_LIST = "InList";
 *   FILTER_OPERATION_TYPE_NOT_IN_LIST = "NotInList";
 *   FILTER_OPERATION_TYPE_BETWEEN = "Between";
 *   FILTER_OPERATION_TYPE_IS_NOT_NULL = "IsNotNull";
 *   FILTER_OPERATION_TYPE_IS_NULL = "IsNull";
 *
 */
class Utils
{
    private $FILTER_OPERATION_TYPE_NONE = "None";
    private $FILTER_OPERATION_TYPE_EQUALS = "Equals";
    private $FILTER_OPERATION_TYPE_NOT_EQUALS = "NotEquals";
    private $FILTER_OPERATION_TYPE_BEGINS_WITH = "BeginsWith";
    private $FILTER_OPERATION_TYPE_ENDS_WITH = "EndsWith";
    private $FILTER_OPERATION_TYPE_CONTAINS = "Contains";
    private $FILTER_OPERATION_TYPE_DOES_NOT_CONTAIN = "DoesNotContain";
    private $FILTER_OPERATION_TYPE_GREATER_THAN = "GreaterThan";
    private $FILTER_OPERATION_TYPE_LESS_THAN = "LessThan";
    private $FILTER_OPERATION_TYPE_GREATER_THAN_EQUALS = "GreaterThanEquals";
    private $FILTER_OPERATION_TYPE_LESS_THAN_EQUALS = "LessThanEquals";
    private $FILTER_OPERATION_TYPE_IN_LIST = "InList";
    private $FILTER_OPERATION_TYPE_NOT_IN_LIST = "NotInList";
    private $FILTER_OPERATION_TYPE_BETWEEN = "Between";

    // need to implement
    private $FILTER_OPERATION_TYPE_IS_NOT_NULL = "IsNotNull";
    private $FILTER_OPERATION_TYPE_IS_NULL = "IsNull";


    private $FILTER_COMPARISION_TYPE_AUTO = "auto";
    private $FILTER_COMPARISION_TYPE_STRING = "string";
    private $FILTER_COMPARISION_TYPE_NUMBER = "number";
    private $FILTER_COMPARISION_TYPE_DATE = "date";
    private $FILTER_COMPARISION_TYPE_BOOLEAN = "boolean";

    /**
     * @param $array
     * @param $filters
     *
     * filters = [{
     *      value = {} || [],
     *      filterOperation = "",
     *      columnName = "",
     *      filterComparisonType = ""
     * }, ....]
     * @return array
     */
    function filterArray($array, $filters)
    {
        $result = array();
        foreach ($array as $item) {
            if ($this->isMatch($item, $filters))
                array_push($result, $item);
        }
        return $result;
    }


    /**
     * @param $array
     * @param $sortList
     *
     * sorts = [
     *   {
     *       columnName  = string,
     *       isAscending = boolean,
     *       sortNumeric = boolean
     *   } , .....
     * ]
     */
    function sortArray(&$array, $sortList)
    {
        $this->sorts = $sortList;
        usort($array, array($this, "compare"));
    }

    private $sorts; // store the sort list to re use in the callback
    public function compare($aObj, $bObj)
    {
         $toReturn = -1;
        foreach ($this->sorts as $sort){
            $columnName = $sort->columnName;
            $aObjValue = $sort->isAscending ? $aObj->$columnName : $bObj->$columnName;
            $bObjValue = $sort->isAscending ? $bObj->$columnName : $aObj->$columnName;
            if($sort->sortNumeric) {
                if (strpos($aObjValue, ".") !== false || strpos($bObjValue, ".") !== -false)
                    $toReturn = (float)$aObjValue < (float)($bObjValue) - 1 ? -1 : (float)$aObjValue == (float)$bObjValue ? 0 : 1;
                else
                    $toReturn = (int)$aObjValue < (int)($bObjValue) - 1 ? -1 : (int)$aObjValue == (int)$bObjValue ? 0 : 1;
            } else {
                $toReturn = strcmp((string)$aObjValue,(string)$bObjValue);
            }
            if($toReturn !== 0)
                return $toReturn;
        }
        return $toReturn;
    }


    function isMatch($item, $filterList){
        $matched = true;
        foreach($filterList as $filter){
            $columnName = $filter->columnName;
            $value = $this->convert($item->$columnName, $filter->filterComparisonType);
            switch($filter->filterOperation){
                case $this->FILTER_OPERATION_TYPE_NONE:
                    if($filter->value == null || $item == null || $filter->columnName == null)
                        $matched = true;
                    break;
                case $this->FILTER_OPERATION_TYPE_EQUALS:
                    $matched = $value == $filter->value;
                    break;
                case $this->FILTER_OPERATION_TYPE_NOT_EQUALS:
                    $matched = $value != $filter->values;
                    break;
                case $this->FILTER_OPERATION_TYPE_BEGINS_WITH:
                    $pos = strpos(strtolower((string)$value), strtolower($filter->value));
                    $matched = is_int($pos) && $pos == 0;
                    break;
                case $this->FILTER_OPERATION_TYPE_ENDS_WITH:
                    $posA = strrpos(strtolower((string)$value),strtolower($filter->value));
                    $posB = strlen((string)$value)-strlen((string)$filter->value);
                    $matched = is_int($posA) && is_int($posB) && $posA == $posB;
                    break;
                case $this->FILTER_OPERATION_TYPE_CONTAINS:
                    $pos = strpos(strtolower((string)$value),strtolower($filter->value));
                    $matched =  is_int($pos) && $pos >= 0;
                    break;
                case $this->FILTER_OPERATION_TYPE_DOES_NOT_CONTAIN:
                    $pos = strpos(strtolower((string)$value),strtolower($filter->value));
                    $matched = is_int($pos) && $pos <= 0;
                    break;
                case $this->FILTER_OPERATION_TYPE_GREATER_THAN:
                    $matched = $value > $filter->value;
                    break;
                case $this->FILTER_OPERATION_TYPE_GREATER_THAN_EQUALS:
                    $matched = $value >= $filter->value;
                    break;
                case $this->FILTER_OPERATION_TYPE_LESS_THAN:
                    $matched = $value < $filter->value;
                    break;
                case $this->FILTER_OPERATION_TYPE_LESS_THAN_EQUALS:
                    $matched = $value <= $filter->value;
                    break;
                case $this->FILTER_OPERATION_TYPE_IN_LIST:
                    $matched = false;
                    foreach($filter->value as $val) {
                        if (is_int(strpos(strtolower((string)$value), strtolower($val))) && strpos(strtolower((string)$value), strtolower($val)) == 0) {
                            $matched = true;
                            break;
                        }
                    }
                    break;
                case $this->FILTER_OPERATION_TYPE_NOT_IN_LIST:
                    $matched = false;
                    foreach($filter->value as $val) {
                        if (is_int(strpos(strtolower((string)$value), strtolower($val))) && strpos(strtolower((string)$value), strtolower($val)) != 0) {
                            $matched = true;
                            break;
                        }
                    }
                    break;
                case $this->FILTER_OPERATION_TYPE_BETWEEN:
                    if(count($filter->value) != 2) {
                        $matched = false;
                        break;
                    }
                    if($filter->filterComparisonType == "date"){
                        $date1 = new DateTime($filter->value[0]);
                        $date2 = new DateTime($filter->value[1]);
                        $date = new DateTime($value);
                        $matched = $date1 <= $date && $date2 >= $date;
                    } else {
                        $matched = $filter->value[0] <= $value && $filter->value[1] >= $value;
                    }
                    break;
                default:
                    $matched =true;
            }
            if(!$matched)
                return false;
        }
        return $matched;
    }

    function convert($item, $filterComparisonType){
        if($item === null)
            return $item;
        if($filterComparisonType == $this->FILTER_COMPARISION_TYPE_NUMBER && !(is_numeric($item))) {
            return (float)($item);
        }elseif($filterComparisonType == $this->FILTER_COMPARISION_TYPE_DATE){
            //$str = (string)$item;
            ///return strlen($str) > 0 ? date_parse($item) : null;
            return $item;
        }else if($filterComparisonType == $this->FILTER_COMPARISION_TYPE_BOOLEAN && !(is_bool($item))){
            return (boolean)($item);
        }else if($filterComparisonType == $this->FILTER_COMPARISION_TYPE_STRING && !(is_string($item))){
            return (string)$item;
        }
		return $item;
    }
}
?>