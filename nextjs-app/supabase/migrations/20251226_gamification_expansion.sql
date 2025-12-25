-- Ocean Garden Items Catalog
CREATE TABLE IF NOT EXISTS public.ocean_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK (type IN ('coral', 'fish', 'decoration', 'plant')),
    unlock_price INTEGER DEFAULT 0, -- Points cost
    image_url TEXT, -- Path to asset
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User's Ocean Inventory & Placement
CREATE TABLE IF NOT EXISTS public.user_ocean_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES public.ocean_items(id) ON DELETE CASCADE,
    position_x INTEGER DEFAULT 0, -- relative percent or pixels
    position_y INTEGER DEFAULT 0,
    scale DECIMAL(3,2) DEFAULT 1.0,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily Quests
CREATE TABLE IF NOT EXISTS public.daily_quests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT CHECK (type IN ('check_in', 'journal', 'meditate', 'breathing', 'mood_log', 'read_article')),
    reward_points INTEGER DEFAULT 10,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
    completed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL, -- Usually end of day
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.ocean_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ocean_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_quests ENABLE ROW LEVEL SECURITY;

-- Policies for Ocean Items (Public Read)
CREATE POLICY "Ocean items are viewable by everyone" 
ON public.ocean_items FOR SELECT 
USING (true);

-- Policies for User Ocean Items
CREATE POLICY "Users can view their own garden items" 
ON public.user_ocean_items FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own garden items" 
ON public.user_ocean_items FOR ALL 
USING (auth.uid() = user_id);

-- Policies for Daily Quests
CREATE POLICY "Users can manage their own quests" 
ON public.daily_quests FOR ALL 
USING (auth.uid() = user_id);

-- Seed Ocean Items
INSERT INTO public.ocean_items (slug, name, type, unlock_price, image_url) VALUES 
('coral_brain', 'San hô trí não', 'coral', 0, '/assets/ocean/coral_brain.svg'),
('seaweed_green', 'Rong biển xanh', 'plant', 50, '/assets/ocean/seaweed_green.svg'),
('clown_fish', 'Cá hề', 'fish', 100, '/assets/ocean/clown_fish.svg'),
('rock_small', 'Đá cuội nhỏ', 'decoration', 20, '/assets/ocean/rock_small.svg'),
('chest_treasure', 'Rương kho báu', 'decoration', 500, '/assets/ocean/chest_treasure.svg')
ON CONFLICT (slug) DO NOTHING;
