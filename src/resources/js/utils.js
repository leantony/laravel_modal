var leantony = {};

(function ($) {
    leantony.utils = {

        /**
         * load a link, with timeout
         */
        loadLink: function (url, delay) {
            if (!url) {
                url = location.href;
            }
            if (!delay) {
                window.location = url;
            }
            else {
                setTimeout(function () {
                    window.location = url;
                }, delay);
            }
        },

        /**
         * Laravel returns validation error messages as a json object
         * We process that to respective html here
         * @param message
         * @returns {string}
         */
        processMessageObject: function (message) {
            var errors = '';
            // check if the msg was an object
            if ($.type(message) === "object") {
                $.each(message, function (key, value) {
                    errors += '<li>' + value[0] + '</li>';
                });
            } else {
                errors += '<p>' + message + '</p>';
            }
            return errors;
        },

        /**
         * Render a bootstrap alert to the user. Requires the html to be inserted to the target element
         * @param type
         * @param message
         * @returns {string}
         */
        renderAlert: function (type, message) {
            var validTypes = ['success', 'error', 'notice'], html = '';
            if (typeof type === undefined || ($.inArray(type, validTypes) < 0)) {
                type = validTypes[0];
            }
            if (type === 'success') {
                html += '<div class="alert alert-success">';
            }
            else if (type === 'error') {
                html += '<div class="alert alert-danger">';
            } else {
                html += '<div class="alert alert-warning">';
            }
            html += '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
            // add a heading
            if (type === 'error') {
                html += "<strong>Please fix the following errors:</strong>";
            }
            message = this.processMessageObject(message);
            return html + message + '</div>';
        }
    };
})(jQuery);