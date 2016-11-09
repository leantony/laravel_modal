/**
 * Created by antony on 10/24/16.
 */
leantony.notify = leantony.notify || {};

(function ($) {
    var NOTIFICATION = function (opts) {
        var defaults = {
            addclass: "stack-topright",
            buttons: {
                closer: true,
                sticker: false
            },
            styling: "fontawesome",
            title: function () {
                if (opts.type === undefined) {
                    return "No title";
                }
                // add a title dynamically and automatically
                switch (opts.type) {
                    case "success":
                        return "Action completed successfully.";
                    case "warning":
                        return "Warning!";
                    case "error":
                        return "An error occurred.";
                    case "info":
                        return "We have some information for you.";
                    default:
                        return "Information."
                }
            }
        };

        this.opts = $.extend({}, defaults, opts || {});
    };

    NOTIFICATION.prototype.send = function () {
        var $this = this;
        var opts = $this.opts;
        new PNotify(opts);
    };

    leantony.notify = function (options) {
        var obj = new NOTIFICATION(options);
        obj.send();
    };

})(jQuery);