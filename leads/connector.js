(function() {
    const deepConfig = window.deepConfig;
    const apiUrl = deepConfig.apiUrl,
        errorHandler = deepConfig.errorHandler,
        tableauInit = deepConfig.tableauInit,
        getAjaxHeader = deepConfig.getAjaxHeader,
        setCredentails = deepConfig.setCredentails;

    const url = apiUrl + '/leads/';

    // Create the connector object
    const deepConnector = tableau.makeConnector();

    // Define the schema
    deepConnector.getSchema = function(schemaCallback) {
        const cols = [{
            id: "id",
            alias: "id",
            dataType: tableau.dataTypeEnum.int,
        }, {
            id: "title",
            alias: "title",
            dataType: tableau.dataTypeEnum.string,
        }, {
            id: "text",
            alias: "text",
            dataType: tableau.dataTypeEnum.string,
        }, {
            id: "noOfEntries",
            alias: "noOfEntries",
            dataType: tableau.dataTypeEnum.int,
        },{
            id: "website",
            alias: "website",
            dataType: tableau.dataTypeEnum.string,
        }, {
            id: "url",
            alias: "url",
            dataType: tableau.dataTypeEnum.string,
        }, {
            id: "createdByName",
            alias: "createdByName",
            dataType: tableau.dataTypeEnum.string,
        }, {
            id: "status",
            alias: "status",
            dataType: tableau.dataTypeEnum.string,
        }, {
            id: "source",
            alias: "source",
            dataType: tableau.dataTypeEnum.string,
        }, {
            id: "sourceType",
            alias: "sourceType",
            dataType: tableau.dataTypeEnum.string,
        }, {
            id: "confidentiality",
            alias: "confidentiality",
            dataType: tableau.dataTypeEnum.string,
        }, {
            id: "assigneeDetails__displayName",
            alias: "assigneeDetails__displayName",
            dataType: tableau.dataTypeEnum.string,
        }, {
            id: "assigneeDetails__email",
            alias: "assigneeDetails__email",
            dataType: tableau.dataTypeEnum.string,
        },{
            id: "projectId",
            alias: "projectId",
            dataType: tableau.dataTypeEnum.string,
        }, {
            id: "publishedOn",
            alias: "publishedOn",
            dataType: tableau.dataTypeEnum.string,
        }];

        const tableInfo = {
            id: "leads",
            alias: "Deep leads Info",
            columns: cols,	
        };

        schemaCallback([tableInfo]);
    };

    // Init function for connector, called during every phase
    deepConnector.init = tableauInit

    // Download the data
    deepConnector.getData = function(table, doneCallback) {
        const getData = function(resp) {
            const leads = resp.results;
            const tableData = leads.map(function(lead) {
                return {
                    id: lead.id,
                    title: lead.title,
                    text: lead.text,
                    noOfEntries: lead.noOfEntries,
                    website: lead.website,
                    url: lead.url,
                    createdByName: lead.createdByName,
                    status: lead.status,
                    source: lead.source,
                    sourceType: lead.sourceType,
                    confidentiality: lead.confidentiality,
                    assigneeDetails__displayName: (lead.assigneeDetails || {}).displayName,
                    assigneeDetails__email: (lead.assigneeDetails || {}).email,
                    projectId: lead.project,
                    publishedOn: lead.publishedOn,
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
            tableau.connectionName = "Deep Leads"; // This will be the data source name in Tableau
            tableau.submit(deepConnector); // This sends the connector object to Tableau
        }).text("Get Deep Leads Data!");;
    });
})();
