(function() {
    const deepConfig = window.deepConfig;
    const apiUrl = deepConfig.apiUrl,
        errorHandler = deepConfig.errorHandler,
        tableauInit = deepConfig.tableauInit,
        getAjaxHeader = deepConfig.getAjaxHeader,
        setCredentails = deepConfig.setCredentails;

    const entriesFields = [
        'id', 'lead', 'created_at', 'analysis_framework',
        'order', 'excerpt', 'entry_type',
    ];

    // FIXME: Add Offset limit and project filter
    const url = apiUrl + '/entries/?fields=' + entriesFields.join(',') + '&offset=0&limit=100';

    // Create the connector object
    const deepConnector = tableau.makeConnector();

    // Define the schema
    deepConnector.getSchema = function(schemaCallback) {
        const cols = [{
            id: "id",
            alias: "id",
            dataType: tableau.dataTypeEnum.int,
        }, {
            id: "leadId",
            alias: "leadid",
            dataType: tableau.dataTypeEnum.int,
        }, {
            id: "createdAt",
            alias: "createdAt",
            dataType: tableau.dataTypeEnum.string,
        }, {
            id: "analysisFramework",
            alias: "analysisFramework",
            dataType: tableau.dataTypeEnum.int,
        },{
            id: "order",
            alias: "order",
            dataType: tableau.dataTypeEnum.int,
        }, {
            id: "excerpt",
            alias: "excerpt",
            dataType: tableau.dataTypeEnum.string,
        }, {
            id: "entryType",
            alias: "entryType",
            dataType: tableau.dataTypeEnum.string,
        }];

        const tableInfo = {
            id: "entries",
            alias: "Deep entries Info",
            columns: cols,	
        };

        schemaCallback([tableInfo]);
    };

    // Init function for connector, called during every phase
    deepConnector.init = tableauInit

    // Download the data
    deepConnector.getData = function(table, doneCallback) {
        const getData = function(resp) {
            const entries = resp.results.entries;
            const tableData = entries.map(function(entry) {
                return {
                    id: entry.id,
                    lead: entry.lead,
                    createdAt: entry.createdAt,
                    analysisFramework: entry.analysisFramework,
                    order: entry.order,
                    excerpt: entry.excerpt,
                    entryType: entry.entryType,
                };
            });

            table.appendRows(tableData);
            doneCallback();
        };

        $.ajax({
            dataType: "json",
            url: url,
            headers: getAjaxHeader(),
            error: errorHandler,
            success: getData,
        });
    };

    tableau.registerConnector(deepConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            setCredentails();
            tableau.connectionName = "Deep Entries"; // This will be the data source name in Tableau
            tableau.submit(deepConnector); // This sends the connector object to Tableau
        }).text("Get Deep Entries Data!");;
    });
})();
