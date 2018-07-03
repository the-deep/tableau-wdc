(function() {
    const deepConfig = window.deepConfig;
    const apiUrl = deepConfig.apiUrl,
        errorHandler = deepConfig.errorHandler,
        tableauInit = deepConfig.tableauInit,
        getAjaxHeader = deepConfig.getAjaxHeader,
        setCredentails = deepConfig.setCredentails;

    const projectsFields = [
        'id', 'title', 'description', 'analysis_framework_title',
        'number_of_leads', 'number_of_users',
    ];
    const url = apiUrl + '/projects/?fields=' + projectsFields.join(',');

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
            id: "description",
            alias: "description",
            dataType: tableau.dataTypeEnum.string,
        }, {
            id: "analysisFrameworkTitle",
            alias: "analysisFrameworkTitle",
            dataType: tableau.dataTypeEnum.string,
        },{
            id: "numberOfLeads",
            alias: "numberOfLeads",
            dataType: tableau.dataTypeEnum.int,
        }, {
            id: "numberOfUsers",
            alias: "numberOfUsers",
            dataType: tableau.dataTypeEnum.int,
        }];

        const tableInfo = {
            id: "projects",
            alias: "Deep projects Info",
            columns: cols,	
        };

        schemaCallback([tableInfo]);
    };

    // Init function for connector, called during every phase
    deepConnector.init = tableauInit

    // Download the data
    deepConnector.getData = function(table, doneCallback) {
        const getData = function(resp) {
            const projects = resp.results;
            const tableData = projects.map(function(project) {
                return {
                    id: project.id,
                    title: project.title,
                    description: project.description,
                    analysisFrameworkTitle: project.analysisFrameworkTitle,
                    numberOfUsers: project.numberOfUsers,
                    numberOfLeads: project.numberOfLeads,
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
            tableau.connectionName = "Deep Projects"; // This will be the data source name in Tableau
            tableau.submit(deepConnector); // This sends the connector object to Tableau
        }).text("Get Deep Projects Data!");;
    });
})();
