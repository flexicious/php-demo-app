<?php
  class ServerRecord{
    public $id;
    public $record_type;
    public $record_id;
    public $record;
    public $site;
    public $system;
    public $start_time;
    public $run_time;
    public $status;
    public $jenkins;
    public $result;

    public $childCounts; // for data grid ref.
    public $children;

    function __construct(){
      $this->children = array();
      $this->childCounts = 0;
    }

    public function copyFrom($object){
      $this->id = $object["id"];
      $this->record_type = $object["record_type"];
      $this->record_id = $object["record_id"];
      $this->record = $object["record"];
      $this->site = $object["site"];
      $this->system = $object["system"];
      $this->start_time = $object["start_time"];
      $this->run_time = $object["run_time"];
      $this->status = $object["status"];
      $this->jenkins = $object["jenkins"];
      $this->result = $object["result"];
    }
  }
?>

