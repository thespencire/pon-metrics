export default class PONMetrics extends BaseTableWidget {
    constructor(config) {
        super(config);
        this.configurable = true;
        this.cachedData = [];
        this.cachedSettings = null;
    }

    getGridOptions() {
        return {
            sizeToContent: 400,
        };
    }

    getMarkup() {
        let $pon_table = this.createTable('ponmetrics-table', {
            headerPosition: 'left',
        });
        return $('<div></div>').append($pon_table);
    }

    async onWidgetOptionsChanged(options) {
        this.cachedSettings = null;
        this._updateMetrics();
    }

    async getWidgetOptions() {
        return {
            show_metrics: {
                title: this.translations.show_metrics,
                type: 'select_multiple',
                options: [
                    {value: 'cpu_temps', label: this.translations.cpu_temps},
                    {value: 'optic_temp', label: this.translations.optic_temp},
                    {value: 'voltage', label: this.translations.voltage},
                    {value: 'rx_power', label: this.translations.rx_power},
                    {value: 'tx_power', label: this.translations.tx_power},
                    {value: 'tx_bias', label: this.translations.tx_bias},
                    {value: 'ploam', label: this.translations.ploam}
                ],
                default: ['cpu_temps', 'optic_temp', 'voltage', 'rx_power', 'tx_power', 'tx_bias', 'ploam']
            },
        };
    }

    async onWidgetTick() {
        await this._updateMetrics();
    }

    async _updateMetrics() {
        if (this.cachedSettings === null) {
            this.cachedSettings = await this.ajaxCall('/api/ponmetrics/settings/get');
        }

        const settings = this.cachedSettings?.ponmetrics || {};
        const ontIp = settings.ont_ip || '192.168.11.1';
        const warnLimit = parseFloat(settings.warn_temp) || 70;
        const data = await this.ajaxCall('/api/ponmetrics/metrics/get', { address: ontIp });

        if (!data || data.error) {
            this.updateTable('ponmetrics-table', [[
                `<b>${this.translations.status || 'Status'}</b>`, 
                `<a href="/ui/ponmetrics/settings">${this.translations.unconfigured}</a>`
            ]]);
            return;
        }

        this.cachedData = data;
        const config = this.getWidgetConfig();
        const ploamMap = { 1: "O1", 2: "O2", 3: "O3", 4: "O4", 5: "O5", 51: "O5.1", 6: "O6", 7: "O7" };
        const tempColor = (temp) => parseFloat(temp) >= warnLimit ? 'text-danger' : 'text-success';
        
        let tableData = [];
        const enabled = config.show_metrics || [];

        if (enabled.includes('cpu_temps')) {
            tableData.push([`<b>${this.translations.cpu_temp1}</b>`, `<span class="${tempColor(data.cpu1_tempC)}">${data.cpu1_tempC} °C</span>`]);
            tableData.push([`<b>${this.translations.cpu_temp2}</b>`, `<span class="${tempColor(data.cpu2_tempC)}">${data.cpu2_tempC} °C</span>`]);
        }
        if (enabled.includes('optic_temp')) {
            tableData.push([`<b>${this.translations.optic_temp}</b>`, `<span class="${tempColor(data.optic_tempC)}">${data.optic_tempC} °C</span>`]);
        }
        if (enabled.includes('voltage')) {
            tableData.push([`<b>${this.translations.voltage}</b>`, `${data.module_voltage} V`]);
        }
        if (enabled.includes('rx_power')) {
            tableData.push([`<b>${this.translations.rx_power}</b>`, `${data.rx_power_dBm} dBm`]);
        }
        if (enabled.includes('tx_power')) {
            tableData.push([`<b>${this.translations.tx_power}</b>`, `${data.tx_power_dBm} dBm`]);
        }
        if (enabled.includes('tx_bias')) {
            tableData.push([`<b>${this.translations.tx_bias}</b>`, `${data.tx_bias_mA} mA`]);
        }
        if (enabled.includes('ploam')) {
            const ploamColor = data.ploam_state == 51 ? 'text-success' : 'text-warning';
            tableData.push([`<b>${this.translations.ploam}</b>`, `<strong class="${ploamColor}">${ploamMap[data.ploam_state] || data.ploam_state}</strong>`]);
        }

        this.updateTable('ponmetrics-table', tableData);
    }
}