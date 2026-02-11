<script>
    $(document).ready(function () {
        var data_get_map = {'form_ponmetrics': "/api/ponmetrics/settings/get"};
        mapDataToFormUI(data_get_map).done(function (data) {
            formatTokenizersUI();
            $('.selectpicker').selectpicker('refresh');
        });

        $("#reconfigureAct").SimpleActionButton({
            onPreAction: function () {
                const dfObj = new $.Deferred();
                saveFormToEndpoint("/api/ponmetrics/settings/set", 'form_ponmetrics', function () { dfObj.resolve(); }, true, function () { dfObj.reject(); });
                return dfObj;
            }
        });
    });
</script>

<div class="content-box __mb">
    {{ partial("layout_partials/base_form", ['fields': ponmetricsForm, 'id': 'form_ponmetrics']) }}
</div>

{{ partial('layout_partials/base_apply_button', {'data_endpoint': '/api/ponmetrics/settings/set','id': 'reconfigureAct'})}}