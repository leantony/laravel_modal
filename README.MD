# Ajax based bootstrap modal. (Not yet finished, but will soon)

## Installation
+ composer
+ jquery, pnotify
+ adding service provider
+ publishing of assets

# Usage
The modal view provided looks like this. Bootform isnt really a necessity, so feel free to change this. So long as the variables remain
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
sample, without bootform
```
<form class="form-horizontal" role ="form" action={{ $route }}>
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h4 class="modal-title">{{ ucwords($action . ' '. class_basename($model)) }}</h4>
    </div>
    <div class="modal-body">
        // form inputs go here
    </div>
    <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary">Save changes</button>
    </div>
</form>
```
run the following, if you haven't already
```
# publish the javascript assets
php artisan vendor:publish --tag=public --force
# publish the view
artisan vendor:publish --provider="Leantony\Modal\ServiceProvider"
```
Add the javascript assets to your page. Like the layout for instance
```
<script src="{{ asset('vendor/public/leantony/modal/utils.js') }}></script>
<script src="{{ asset('vendor/public/leantony/modal/notify.js') }}></script>
<script src="{{ asset('vendor/public/leantony/modal/modal.js') }}></script>
```
Initialize the modal js module, in your main js file. Like this
```js
leantony.modal({});
```
Add the modal container to your layout. Like just before the footer
```
@include('modal::modal_container')
```
Make a copy of the modal form copied, to your controller's views, and edit as necessary. Like add form columns, etc

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

Add a link to your page, that will trigger the modal. Give the link a class of 'show_modal_form'
```
<a href="{{ route('posts.create') }}" class="btn btn-default show_modal_form">Create</a>
```
When you click on the button, the modal should be displayed.