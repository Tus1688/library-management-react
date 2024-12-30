export type GetBookingResponse = {
    id: string;
    pagination_id: number;
    book_id: string;
    book_title: string;
    book_author: string;
    customer_name: string;
    customer_phone: string;
    booked_until: string;
    is_returned: boolean;
    created_at: string;
    updated_at: string;
    updated_by : string;
    returned_at?: string;
}