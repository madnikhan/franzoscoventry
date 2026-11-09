<?php

return [
    'slug' => 'franzos-coventry',
    'name' => 'Franzos Coventry',
    'siteUrl' => 'https://franzoscoventry.co.uk',
    'address' => [
        'line1' => '14 Corporation St',
        'city' => 'Coventry',
        'postcode' => 'CV1 1GF',
        'country' => 'United Kingdom',
    ],
    'phone' => '024 7509 2252',
    'phoneE164' => '+442475092252',
    'emails' => [
        'franzoscoventry@gmail.com',
        'coventry@franzos.co.uk',
    ],
    'social' => [
        'facebook' => 'https://www.facebook.com/franzoscoventry',
    ],
    'currency' => 'GBP',
    'vatRate' => 0.2,
    'delivery' => [
        'enabled' => true,
        'fee' => 2.5,
        'minOrder' => 12,
        'etaMinutes' => [
            25,
            40,
        ],
        'radiusMiles' => 3,
    ],
    'collection' => [
        'enabled' => true,
        'etaMinutes' => [
            15,
            25,
        ],
    ],
    'payments' => [
        'provider' => 'sumup',
        'deliveryMethods' => [
            'card',
        ],
        'collectionMethods' => [
            'card',
            'cash',
        ],
    ],
    'hours' => [
        'monday' => [
            'open' => '12:00',
            'close' => '22:30',
        ],
        'tuesday' => [
            'open' => '12:00',
            'close' => '22:30',
        ],
        'wednesday' => [
            'open' => '12:00',
            'close' => '01:00',
        ],
        'thursday' => [
            'open' => '12:00',
            'close' => '01:00',
        ],
        'friday' => [
            'open' => '12:00',
            'close' => '01:00',
        ],
        'saturday' => [
            'open' => '12:00',
            'close' => '01:00',
        ],
        'sunday' => [
            'open' => '12:00',
            'close' => '22:30',
        ],
    ],
    'orderPrefix' => 'FZ',
];
