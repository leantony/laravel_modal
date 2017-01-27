# Ajax based bootstrap modal
Purpose of this package, is to allow quick and easy creation and triggering of modal forms via ajax, from a laravel controller.

## Installation
### Requirements
+ laravel. At least version 5.1+
+ composer
+ jquery
+ Bootstrap3

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
> The javascript files will be copied into the "public/vendor/leantony/modal" folder

The view will be copied to resources/views/vendor/leantony/modal

You can then refrence the assets (bootstrap, jquery, pnotify, and etc) on your page

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

Add the javascript assets to your page. Like the layout for instance.
```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Document</title>
        <link rel="stylesheet" media="screen" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
    </head>
    <body>

     <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad animi architecto deleniti eius odio odit quas quisquam quod repellendus sapiente. Autem deserunt fugiat ipsum iusto molestias odio provident repudiandae voluptates!
    </p>
    <hr>
    <!-- a link to a named route, that displays the modal form -->
    <a href="{{ route('posts.create') }}" class="btn btn-default show_modal_form">New post</a>



    <script src="https://code.jquery.com/jquery.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
    <script src="{{ asset('vendor/public/leantony/modal/modal.min.js') }}"></script>
    <!-- initialize the modal js plugin -->
    <script>
        leantony.modal();
    </script>

    <!-- Add the modal container to your layout. This is where the html for the modal form will be injected by the javascript ajax call. Put it ideally just before the footer -->

    @include('modal::container')
    <footer>
        some text here
    </footer>
    </body>
</html>
```

```php

```
Make a copy of the modal form copied, to your views, and edit as necessary. This will obviously be different depending on your needs, as its the actual form that the user.

In this case, the modal will be triggered on create action. It is assumed that named your modal form 'create.blade.php'
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
> check the variables in the form sample, to know what else can be passed into the modal view. Fee free to add your own

Add a link to your page, that will trigger the modal. Give the link a class of 'show_modal_form'

> The class name is important as it instructs the javascript to send an ajax request to the link's href attribute for a view. Which will then be displayed on the page, as a modal.

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

        // return json response. The message is, as it will be used to notify the user of their action
        return new JsonResponse([
            'success' => true,
            'message' => 'record created',
        ], 200);
    }
```
For validation, you can use a form request. Dont worry about the validation errors, as this will be displayed automatically on the modal

Feel free to play around with this. :)