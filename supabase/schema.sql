-- METALMAX CMS — схема для Supabase
-- Виконайте цей файл повністю в Supabase Dashboard → SQL Editor → New query → Run.
-- Безпечно виконувати повторно (IF NOT EXISTS / DROP POLICY IF EXISTS скрізь, де можливо).

-- 1) Таблиця з контентом сайту.
--    Весь контент (hero, about, contacts, services, equipment, portfolio, testimonials, faq)
--    зберігається одним JSON-об'єктом в одному рядку (id = 1). Це навмисне спрощення:
--    сайт невеликий, і такий підхід дозволяє редагувати/зчитувати все одним запитом.
create table if not exists public.site_content (
  id int primary key default 1,
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Початковий порожній рядок, якщо його ще немає.
insert into public.site_content (id, content)
values (1, '{}'::jsonb)
on conflict (id) do nothing;

alter table public.site_content enable row level security;

-- Читати контент може будь-хто (відвідувачі сайту, анонімний ключ).
drop policy if exists "Public can read content" on public.site_content;
create policy "Public can read content"
  on public.site_content for select
  using (true);

-- Змінювати контент може тільки залогінений адміністратор (Supabase Auth).
drop policy if exists "Authenticated can update content" on public.site_content;
create policy "Authenticated can update content"
  on public.site_content for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop policy if exists "Authenticated can insert content" on public.site_content;
create policy "Authenticated can insert content"
  on public.site_content for insert
  with check (auth.role() = 'authenticated');

-- 2) Realtime — щоб зміни в адмінці одразу з'являлись у всіх відкритих вкладках сайту
--    без перезавантаження сторінки.
alter publication supabase_realtime add table public.site_content;

-- 3) Сховище для фото (обладнання, послуги, портфоліо тощо).
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "Public can view media" on storage.objects;
create policy "Public can view media"
  on storage.objects for select
  using (bucket_id = 'media');

drop policy if exists "Authenticated can upload media" on storage.objects;
drop policy if exists "Anyone can upload media" on storage.objects;
create policy "Anyone can upload media"
  on storage.objects for insert
  with check (bucket_id = 'media');

drop policy if exists "Authenticated can update media" on storage.objects;
create policy "Authenticated can update media"
  on storage.objects for update
  using (bucket_id = 'media' and auth.role() = 'authenticated');

drop policy if exists "Authenticated can delete media" on storage.objects;
create policy "Authenticated can delete media"
  on storage.objects for delete
  using (bucket_id = 'media' and auth.role() = 'authenticated');

-- 4) Таблиця заявок з форми "Отримати розрахунок" (контакти).
create table if not exists public.leads (
  id bigint generated always as identity primary key,
  name text not null,
  phone text not null,
  message text default '',
  files jsonb default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

-- Хто завгодно може створювати заявку (відвідувачі сайту).
drop policy if exists "Anyone can insert leads" on public.leads;
create policy "Anyone can insert leads"
  on public.leads for insert
  with check (true);

-- Читати заявки може тільки адміністратор.
drop policy if exists "Authenticated can read leads" on public.leads;
create policy "Authenticated can read leads"
  on public.leads for select
  using (auth.role() = 'authenticated');

-- Адміністратор може видаляти заявки.
drop policy if exists "Authenticated can delete leads" on public.leads;
create policy "Authenticated can delete leads"
  on public.leads for delete
  using (auth.role() = 'authenticated');

-- Realtime для заявок не потрібен — список оновлюється при переході на вкладку.

-- Готово. Далі:
-- 1. Authentication → Users → Add user — створіть собі логін/пароль адміністратора.
-- 2. Project Settings → API — скопіюйте Project URL та anon public key у файл .env
--    (див. .env.example у корені проєкту).
