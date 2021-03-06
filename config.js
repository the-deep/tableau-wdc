window.deepConfig = {
    apiUrl: 'https://api.thedeep.io/api/v1',
    tableauInit: function(initCallback) {
        // tableau.authType = tableau.authTypeEnum.basic;
        initCallback();
    },
    getAjaxHeader: function() {
        return {
            'Authorization': 'Basic ' + btoa(tableau.username + ":" + tableau.password),
        };
    },
    setCredentails: function() {
        tableau.username = $('#username').val();
        tableau.password = $('#password').val();
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
