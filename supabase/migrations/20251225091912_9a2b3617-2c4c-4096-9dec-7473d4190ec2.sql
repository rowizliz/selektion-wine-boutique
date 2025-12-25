-- Add CHECK constraints for birthday_gift_requests table
ALTER TABLE birthday_gift_requests 
ADD CONSTRAINT sender_phone_format CHECK (sender_phone ~ '^[0-9]{10,11}$');

ALTER TABLE birthday_gift_requests 
ADD CONSTRAINT sender_name_length CHECK (char_length(sender_name) BETWEEN 1 AND 100);

ALTER TABLE birthday_gift_requests 
ADD CONSTRAINT recipient_name_length CHECK (char_length(recipient_name) BETWEEN 1 AND 100);

ALTER TABLE birthday_gift_requests 
ADD CONSTRAINT birthday_message_length CHECK (birthday_message IS NULL OR char_length(birthday_message) <= 1000);

ALTER TABLE birthday_gift_requests 
ADD CONSTRAINT additional_notes_length_birthday CHECK (additional_notes IS NULL OR char_length(additional_notes) <= 1000);

-- Add CHECK constraints for personalized_wine_requests table
ALTER TABLE personalized_wine_requests 
ADD CONSTRAINT customer_phone_format CHECK (phone ~ '^[0-9]{10,11}$');

ALTER TABLE personalized_wine_requests 
ADD CONSTRAINT customer_name_length CHECK (char_length(customer_name) BETWEEN 1 AND 100);

ALTER TABLE personalized_wine_requests 
ADD CONSTRAINT additional_notes_length_wine CHECK (additional_notes IS NULL OR char_length(additional_notes) <= 1000);

ALTER TABLE personalized_wine_requests 
ADD CONSTRAINT taste_sweet_level_range CHECK (taste_sweet_level IS NULL OR taste_sweet_level BETWEEN 0 AND 100);

ALTER TABLE personalized_wine_requests 
ADD CONSTRAINT taste_spicy_level_range CHECK (taste_spicy_level IS NULL OR taste_spicy_level BETWEEN 0 AND 100);