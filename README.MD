# Ajax based bootstrap modal. (Not yet finished, but will soon)

## Installation
### Requirements
+ laravel. At least version 5.1+
+ composer
+ [jquery](http://code.jquery.com/jquery.js) for obvious reasons, and [pnotify](http://sciactive.com/pnotify/) for simple non-UI blocking notifications

Use composer to install the package.
```bash
composer require leantony/laravel_modal:dev-master
```

Add the service provider, in app.php.
```php
Leantony\Modal\ServiceProvider::class
```
Publish the assets
```bash
# publish the javascript assets
php artisan vendor:publish --tag=public --force
# publish the views
php artisan vendor:publish --provider="Leantony\Modal\ServiceProvider"
```
**Note** that the javascript files will be copied into the public/vendor/leantony/modal, and resources/assets/vendor/leantony/modal.
> I did this, to allow for customizations to the javascript, while also retaining the latest copy from the package.

The views will be copied to resources/views/vendor/leantony/modal

You can then use elixir to publish the assets, or directly refrence the ones in the public/vendor/leantony/modal folder

# Usage
The modal view provided looks like this. Bootform isnt really a necessity, so feel free to change this. So long as the form_id and variables remain. The form ID is used in javascript, so be sure to update accordingly.
```php
{!! BootForm::openHorizontal(['sm' => [4, 8], 'lg' => [2, 10]])->action($route)->class('form-horizontal')->id('modal_form')->method(isset($method) ? $method : 'POST') !!}

<div class="modal-header">
    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
    <h4 class="modal-title">{{ ucwords($action . ' '. class_basename($model)) }}</h4>
</div>
<div class="modal-body">
    <div class="hidden" id="modal-notification"></div>
    @if(isset($data))
        {!! BootForm::bind($data) !!}
    @endif
    {!! BootForm::text('Title', 'title') !!}
    {!! BootForm::textArea('Content', 'content') !!}
</div>
<div class="modal-footer">
    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
    <button type="submit" class="btn btn-primary">Save Changes</button>
</div>
{!! BootForm::close() !!}
```

Add the javascript assets to your page. Like the layout for instance. You can use elixir for this
```html
<!-- any other required assets should come before. Like jquery, pnotify -->
<script src="{{ asset('vendor/public/leantony/modal/utils.js') }}"></script>
<script src="{{ asset('vendor/public/leantony/modal/notify.js') }}"></script>
<script src="{{ asset('vendor/public/leantony/modal/modal.js') }}"></script>
<!-- initialize the modal js -->
<script>
    leantony.modal({});
</script>
```
Add the modal container to your layout. This is where the html for the modal form will be injected by the javascript ajax call. Put it ideally just before the footer
```php
@include('modal::container')
```
Make a copy of the modal form copied, to your controller's views, and edit as necessary. Like add form fields, etc.

Assuming the modal form will be triggered on a create action, make the action look like this. In this case, I assume you copied the modal form and named it 'create.blade.php'
```php
    /**
     * Display the view to create the resource
     *
     * @return Response
     */
    public function create()
    {
        // use render so that only the html for the view is returned as opposed to the layout within which it is in
        return view('posts.create', [
            'route' => route('posts.store'),
            'model' => Post::class,
            'action' => 'create'
        ])->render();
    }
```
> check the arguments in the form sample, to know what else can be passed into the modal.

Add a link to your page, that will trigger the modal. Give the link a class of 'show_modal_form'
```html
<a href="{{ route('posts.create') }}" class="btn btn-default show_modal_form">Create</a>
```
When you click on the button, the modal should be displayed.

Your store action should return json. For example;
```php
    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request
     * @return Response
     */
    public function store(Request $request)
    {
        // quick validation. You can a form request for this
        $this->validate($request, ['title' => 'required', 'content' => 'required|between:5,1000']);

        // save the data
        $post = Post::create($request->all());

        // return json response. You can use this in the javascript accordingly. By default, a notification message is displayed
        return new JsonResponse([
            'success' => true,
            'data' => $post,
            'message' => 'record created',
        ], 200);
    }
```
For validation, you can use a form request. Whichever suits you, so long as the errors get returned to the client, as json
> The errors will be displayed on the notification

Feel free to play around with this. :)