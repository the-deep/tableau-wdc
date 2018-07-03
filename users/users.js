(function() {
    const {
        apiUrl,
        errorHandler,
        tableauInit,
        getAjaxHeader,
    } = window.deepConfig;

    const url = apiUrl + '/users/';

    // Create the connector object
    const deepConnector = tableau.makeConnector();

    // Define the schema
    deepConnector.getSchema = function(schemaCallback) {
        const cols = [{
            id: "id",
            alias: "id",
            dataType: tableau.dataTypeEnum.int,
        }, {
            id: "email",
            alias: "email",
            dataType: tableau.dataTypeEnum.string,
        }, {
            id: "organization",
            alias: "organization",
            dataType: tableau.dataTypeEnum.string,
        }, {
            id: "loginAttempts",
            alias: "loginAttempts",
            dataType: tableau.dataTypeEnum.int,
        }, {
            id: "lastActiveProject",
            alias: "lastActiveProject",
            dataType: tableau.dataTypeEnum.int,
        }];

        const tableInfo = {
            id: "users",
            alias: "Deep Users Info",
            columns: cols,	
        };

        schemaCallback([tableInfo]);
    };

    // Init function for connector, called during every phase
    deepConnector.init = tableauInit

    // Download the data
    deepConnector.getData = function(table, doneCallback) {
        const getData = function(resp) {
            const users = resp.results;
            const tableData = users.map(function(user) {
                return {
                    id: user.id,
                    email: user.email,
                    organization: user.organization,
                    loginAttempts: user.loginAttempts,
                    lastActiveProject: user.lastActiveProject,
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
            tableau.connectionName = "Deep Users";
            tableau.submit(deepConnector);
        }).text("Get Deep Users Data!");;
    });
})();
