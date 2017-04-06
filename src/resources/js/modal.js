leantony.modal = leantony.modal || {};

(function ($) {
    'use strict';
    var modal = function (options) {
        var defaultOptions = {
            // id of modal form template on page
            modal_id: 'bootstrap_modal',
            // id of notification element where messages will be displayed on the modal. E.g validation errors
            notification_id: 'modal-notification',
            // the id of the form that contains the data that will be sent to the server
            form_id: 'modal_form',
            // the class of the element that will trigger the modal. typically a link
            modalTriggerSelector: '.show_modal_form',
            onShown: function (e, modal) {
                // do sth once the modal is shown
            },
            onHidden: function (e, modal) {
                $(this).removeData('bs.modal');
            },
            onShow: function (e, modal) {
                // display a loader, when the modal is being displayed
                var spinner_content = '<div class="row"><div class="col-md-12"><i class="fa fa-spinner fa-5x fa-spin text-info"></i></div></div>';
                $('#' + modal.options.modal_id).find('.modal-content').html(spinner_content);
            },
            onLoaded: function (e, modal) {
                // load any extras

            }
        };
        this.options = $.extend({}, defaultOptions, options || {});
    };

    /**
     * Display the modal. This will send an AJAX request to an endpoint, that returns html. E.g a form
     * The html will be rendered in the modal container specified, by the ID
     */
    modal.prototype.show = function () {
        var $this = this;
        var modal_id = $this.options.modal_id;
        var clickHandler = function (e) {
            var modal_size = $(e).data('modal-size');
            if (modal_size) {
                $('#' + modal_id).find('.modal-dialog').addClass(modal_size);
            }
            var url = $(e).attr('href');
            var modal = $('#' + modal_id);
            modal
                .on('shown.bs.modal', function () {
                    $this.options.onShown.call(this, e, $this);
                })
                .on('hidden.bs.modal', function () {
                    $this.options.onHidden.call(this, e, $this);
                })
                .on('show.bs.modal', function () {
                    $this.options.onShow.call(this, e, $this);
                })
                .on('loaded.bs.modal', function () {
                    $this.options.onLoaded.call(this, e, $this);
                })
                .modal({
                    remote: url,
                    backdrop: 'static',
                    refresh: true
                });
        };

        $(document.body).off('click.leantony.modal').on('click.leantony.modal', $this.options.modalTriggerSelector, function (e) {
            e.preventDefault();
            clickHandler(this);
        });
    };

    /**
     * submit the modal form
     */
    modal.prototype.submitForm = function () {
        var $this = this;

        var submit_form = function (e) {
            var form = $('#' + $this.options.form_id);
            var data = form.serialize();
            var action = form.attr('action');
            var method = form.attr('method') || 'POST';
            var originalButtonHtml = $(e).html();
            $.ajax({
                type: method,
                url: action,
                data: data,
                dataType: 'json',
                success: function (response) {
                    if (response.success) {
                        var message = '<i class=\"fa fa-check\"></i> ';
                        message += response.message;
                        $('#' + $this.options.notification_id).html(leantony.utils.renderAlert('success', message));
                        // if a redirect is required...
                        if (response.redirectTo) {
                            leantony.utils.loadLink(response.redirectTo, response.redirectTimeout || 1000);
                        } else {
                            // hide the modal after 1000 ms
                            setTimeout(function () {
                                $('#' + $this.options.modal_id).modal('hide');
                            }, 1000);
                        }
                    }
                    else {
                        // display message and hide modal
                        $('#' + $this.options.notification_id).html(leantony.utils.renderAlert('error', response.message));
                        setTimeout(function () {
                            $('#' + $this.options.modal_id).modal('hide');
                        }, 1000);
                    }
                },
                beforeSend: function () {
                    $(e).attr('disabled', 'disabled').html('Please wait....');
                },
                complete: function () {
                    $(e).html(originalButtonHtml).removeAttr('disabled');
                },
                error: function (data) {
                    var msg;
                    // error handling
                    switch (data.status) {
                        case 500:
                            msg = 'A server error occurred...';
                            break;
                        default:
                            msg = leantony.utils.renderAlert('error', data.responseJSON);
                            break;
                    }
                    // display errors
                    $('#' + $this.options.notification_id).html(msg);

                }
            });
        };

        $('#' + $this.options.modal_id).off("click.leantony.modal").on("click.leantony.modal", '#' + $this.options.form_id + ' button[type="submit"]', function (e) {
            e.preventDefault();
            submit_form(this);
        });
    };

    leantony.modal = function (options) {
        var obj = new modal(options);
        obj.show();
        obj.submitForm();
    };
}(jQuery));