-- Migration: Gamification System - "Đại dương của Miso"
-- Description: Tạo hệ thống điểm thưởng (Bubbles) và cấp độ đại dương
-- Created: 2024-12-15

-- 1. Tạo bảng user_gamification
CREATE TABLE IF NOT EXISTS public.user_gamification (
    user_id UUID REFERENCES auth.users(id) PRIMARY KEY,
    bubbles INTEGER DEFAULT 0,           -- Tiền tệ (Bọt biển)
    ocean_level INTEGER DEFAULT 1,       -- Cấp độ đại dương (1-5)
    streak_days INTEGER DEFAULT 0,       -- Chuỗi ngày liên tiếp
    last_interaction_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Thêm comment cho bảng và các cột
COMMENT ON TABLE public.user_gamification IS 'Hệ thống gamification - Đại dương của Miso';
COMMENT ON COLUMN public.user_gamification.bubbles IS 'Số điểm bọt biển (Bubbles) - tiền tệ trong game';
COMMENT ON COLUMN public.user_gamification.ocean_level IS 'Cấp độ đại dương hiện tại (1-5)';
COMMENT ON COLUMN public.user_gamification.streak_days IS 'Số ngày liên tiếp người dùng tương tác';

-- 3. Tạo index để tối ưu query
CREATE INDEX IF NOT EXISTS idx_user_gamification_ocean_level ON public.user_gamification(ocean_level);
CREATE INDEX IF NOT EXISTS idx_user_gamification_bubbles ON public.user_gamification(bubbles DESC);

-- 4. Bật bảo mật RLS (Row Level Security)
ALTER TABLE public.user_gamification ENABLE ROW LEVEL SECURITY;

-- 5. Tạo Policy: Cho phép user xem và sửa dữ liệu của chính mình
CREATE POLICY "Users can view own gamification"
ON public.user_gamification FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own gamification"
ON public.user_gamification FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own gamification"
ON public.user_gamification FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 6. Function RPC để cộng điểm an toàn (Tránh race condition)
CREATE OR REPLACE FUNCTION increment_bubbles(user_id_param UUID, amount_param INTEGER)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.user_gamification (user_id, bubbles, last_interaction_at, updated_at)
  VALUES (user_id_param, amount_param, NOW(), NOW())
  ON CONFLICT (user_id)
  DO UPDATE SET
    bubbles = user_gamification.bubbles + amount_param,
    last_interaction_at = NOW(),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Function để update streak days
CREATE OR REPLACE FUNCTION update_streak_days(user_id_param UUID)
RETURNS VOID AS $$
DECLARE
  last_interaction TIMESTAMPTZ;
  current_streak INTEGER;
BEGIN
  -- Lấy thông tin streak hiện tại
  SELECT last_interaction_at, streak_days
  INTO last_interaction, current_streak
  FROM public.user_gamification
  WHERE user_id = user_id_param;

  -- Nếu chưa có record, tạo mới
  IF last_interaction IS NULL THEN
    INSERT INTO public.user_gamification (user_id, streak_days, last_interaction_at, updated_at)
    VALUES (user_id_param, 1, NOW(), NOW());
    RETURN;
  END IF;

  -- Kiểm tra xem có phải ngày tiếp theo không
  IF DATE(last_interaction) = DATE(NOW() - INTERVAL '1 day') THEN
    -- Tăng streak
    UPDATE public.user_gamification
    SET streak_days = current_streak + 1,
        last_interaction_at = NOW(),
        updated_at = NOW()
    WHERE user_id = user_id_param;
  ELSIF DATE(last_interaction) < DATE(NOW() - INTERVAL '1 day') THEN
    -- Reset streak nếu bỏ lỡ 1 ngày
    UPDATE public.user_gamification
    SET streak_days = 1,
        last_interaction_at = NOW(),
        updated_at = NOW()
    WHERE user_id = user_id_param;
  ELSE
    -- Cùng ngày, chỉ update last_interaction
    UPDATE public.user_gamification
    SET last_interaction_at = NOW(),
        updated_at = NOW()
    WHERE user_id = user_id_param;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Function để tính toán ocean level dựa trên bubbles
CREATE OR REPLACE FUNCTION calculate_ocean_level(bubbles_count INTEGER)
RETURNS INTEGER AS $$
BEGIN
  -- Quy tắc:
  -- Level 1: 0-99 bubbles
  -- Level 2: 100-299 bubbles
  -- Level 3: 300-599 bubbles
  -- Level 4: 600-999 bubbles
  -- Level 5: 1000+ bubbles
  IF bubbles_count >= 1000 THEN
    RETURN 5;
  ELSIF bubbles_count >= 600 THEN
    RETURN 4;
  ELSIF bubbles_count >= 300 THEN
    RETURN 3;
  ELSIF bubbles_count >= 100 THEN
    RETURN 2;
  ELSE
    RETURN 1;
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 9. Trigger để tự động update ocean_level khi bubbles thay đổi
CREATE OR REPLACE FUNCTION update_ocean_level_trigger()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ocean_level := calculate_ocean_level(NEW.bubbles);
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_ocean_level
BEFORE INSERT OR UPDATE OF bubbles ON public.user_gamification
FOR EACH ROW
EXECUTE FUNCTION update_ocean_level_trigger();
