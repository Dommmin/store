@component('mail::message')
Hey {{ $cartItem->user->name }},

You still have items in your cart.

@component('mail::button', ['url' => env('FRONTEND_URL'), 'color' => 'success'])
Check it out!
@endcomponent

@endcomponent
