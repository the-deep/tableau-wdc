window.deepConfig = {
    apiUrl: 'https://api.thedeep.io/api/v1',
    tableauInit: function(initCallback) {
        tableau.authType = tableau.authTypeEnum.basic;
        initCallback();
    },
    getAjaxHeader: function() {
        const username = $('#username').value;
        const password = $('#password').value;
        return {
            'Authorization': 'Basic ' + btoa(username + ":" + password),
        };
    },
    errorHandler: function(error) {
        if (error.status === 401) {
            tableau.abortWithError('authentication failed');
            // tableau.abortForAuth();
        } else {
            tableau.abortWithError('error pulling data from server');
        }
    },
};
