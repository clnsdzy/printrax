alter table public.print_jobs
add column if not exists batch_dates timestamptz[] not null default '{}'::timestamptz[];
