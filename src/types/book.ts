export type GetBookResponse = {
   id: string; 
   pagination_id: number;
   title: string;
   author: string;
   description: string;
   is_booked: boolean;
   booked_until?: string;
   created_at: string;
   updated_at: string;
}