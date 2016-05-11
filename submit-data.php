<?php
  $log_file_name = 'data.txt';
  $data = $_POST['data'];
  file_put_contents($log_file_name, $data."\n", FILE_APPEND);
?>
