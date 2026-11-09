<?php

namespace App\Support;

/** Auto-generated from packages/shared/schema/domain.json — do not edit */
class Domain
{
    public const ROLES = ['customer', 'driver', 'kitchen', 'till', 'admin'];
    public const ORDER_TYPES = ['DELIVERY', 'COLLECTION', 'TAKEAWAY'];
    public const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
    public const PAYMENT_STATUSES = ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'];
}
