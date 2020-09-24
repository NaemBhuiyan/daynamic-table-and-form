<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: *');


$filename = 'reorder/reorder.json';

echo file_get_contents($filename);


exit();