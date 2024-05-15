@component('mail::message')
Hello {{ $order->user->name }},

Thank you for your order! You can find all the details below:

<table style="width: 100%; border-collapse: collapse;">
    <thead>
    <tr style="background-color: #f2f2f2;">
        <th style="padding: 10px; border: 1px solid #ddd;">Product</th>
        <th style="padding: 10px; border: 1px solid #ddd;">Quantity</th>
        <th style="padding: 10px; border: 1px solid #ddd;">Price</th>
    </tr>
    </thead>
    <tbody>
    @foreach($order->items as $item)
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd;">
                {{$item->product->name}} <br>
            </td>
            <td style="padding: 10px; border: 1px solid #ddd;">
                {{$item->quantity}}
            </td>
            <td style="padding: 10px; border: 1px solid #ddd;">
                {{ number_format(($item->price * $item->quantity) / 100, 2, ',', '.') }} zł
            </td>
        </tr>
    @endforeach
    </tbody>
    <tfoot>
    <tr>
        <td colspan="3" style="text-align: right; padding: 10px; border: 1px solid #ddd;">
            <strong>Total: {{ number_format($order->total / 100, 2, ',', '.') }} zł </strong>
        </td>
    </tr>
    </tfoot>
</table>

@component('mail::button', ['url' => env('FRONTEND_URL') . '/orders/' . $order->id, 'color' => 'success'])
View order
@endcomponent

@endcomponent
