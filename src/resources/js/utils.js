/**
 * Created by antony on 8/1/16.
 */
var leantony = {};

(function ($) {
    leantony.utils = {
        /**
         * Ajax setup
         */
        setupAjax: function () {
            $.ajaxSetup({
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                }
            });
        },

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
         * @param html
         * @param tag
         * @returns {string}
         */
        processMessageObject: function (message, html, tag) {
            html = html || '';
            // check if the msg was an object
            if ($.type(message) === "object") {
                // display all errors in this alert box
                $.each(message, function (key, value) {
                    html += '<li>' + value[0] + '</li>';
                });
            } else {
                html += '<p>' + message + '</p>';
            }
            if (tag) {
                html += '<' + tag + '>' + html + '</' + tag + '>';
            }
            return html;
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
                html += '<div class="alert alert-success alert-block">';
            }
            else if (type === 'error') {
                html += '<div class="alert alert-danger alert-block">';
            } else {
                html += '<div class="alert alert-warning alert-block">';
            }
            html += '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>';
            // add a heading
            if (type === 'error') {
                html += "<strong>Please fix the following errors:</strong>";
            }

            html = this.processMessageObject(message, html, 'div');
            return html;
        }
    };
    return leantony;
})(jQuery);