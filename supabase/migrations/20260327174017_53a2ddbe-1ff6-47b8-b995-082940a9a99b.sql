UPDATE public.admins 
SET password_hash = crypt('Admin@2026!', gen_salt('bf'))
WHERE username = 'decolandoemviagens@admin';