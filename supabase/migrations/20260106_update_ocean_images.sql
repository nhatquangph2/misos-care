-- Update Image URLs for Ocean Items
-- This script updates the existing items to use the newly generated local assets.

-- 1. Clownfish (Cá hề)
UPDATE ocean_items
SET image_url = '/assets/ocean/clownfish.png'
WHERE slug = 'clown_fish' OR name ILIKE '%Cá hề%';

-- 2. Blue Tang (Cá đuôi gai)
UPDATE ocean_items
SET image_url = '/assets/ocean/blue-tang.png'
WHERE slug = 'blue_tang' OR name ILIKE '%Cá đuôi gai%';

-- 3. Coral (San hô)
UPDATE ocean_items
SET image_url = '/assets/ocean/coral.png'
WHERE slug = 'coral_brain' OR name ILIKE '%San hô%';

-- 4. Seaweed (Rong biển)
UPDATE ocean_items
SET image_url = '/assets/ocean/seaweed.png'
WHERE slug = 'seaweed_green' OR name ILIKE '%Rong biển%';

-- 5. Treasure Chest (Optional - if you have it)
-- UPDATE ocean_items SET image_url = '/assets/ocean/chest.png' WHERE slug = 'chest_treasure';
