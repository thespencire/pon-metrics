<?php

namespace OPNsense\PONMetrics\Api;

use OPNsense\Base\ApiMutableModelControllerBase;

class SettingsController extends ApiMutableModelControllerBase
{
    protected static $internalModelName = 'ponmetrics';
    protected static $internalModelClass = '\OPNsense\PONMetrics\PONMetrics';

    public function getAction()
    {
        $model = new \OPNsense\PONMetrics\PONMetrics();
        return [
            "ponmetrics" => [
                "ont_ip" => (string)$model->ont_ip,
                "warn_temp" => (string)$model->warn_temp
            ]
        ];
    }
}
