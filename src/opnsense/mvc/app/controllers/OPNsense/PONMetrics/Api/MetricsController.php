<?php

namespace OPNsense\PONMetrics\Api;

use OPNsense\Base\ApiControllerBase;

use OPNsense\PONMetrics\PONMetrics;

class MetricsController extends ApiControllerBase
{
    public function beforeExecuteRoute($dispatcher)
    {
        return true;
    }

    public function getAction()
    {
        $this->response->setContentType('application/json', 'UTF-8');
        
        $model = new PONMetrics();
        $ontIp = (string)$model->ont_ip;
        $temp = (string)$model->warn_temp;
        $url = "https://{$ontIp}/cgi-bin/luci/8311/metrics";
        
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        
        $response = curl_exec($ch);
        $error = curl_error($ch);
        curl_close($ch);

        if ($response === false) {
            return ["error" => "ONT ($ontIp) Unreachable: " . $error];
        }

        return json_decode(trim($response), true) ?: ["error" => "Invalid JSON"];
    }
}
