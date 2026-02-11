<?php

namespace OPNsense\PONMetrics;

use OPNsense\Base\IndexController;

class SettingsController extends IndexController
{
    public function indexAction()
    {
        $this->view->ponmetricsForm = $this->getForm("ponmetrics");
        $this->view->pick('OPNsense/PONMetrics/settings');
    }
}