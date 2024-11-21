-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Create the history table
create table public.history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  type text not null check (type in ('chat', 'completion')),
  model text not null,
  title text not null,
  tokens_used integer not null,
  response_time text not null,
  status text not null check (status in ('success', 'error')),
  messages jsonb,
  prompt text,
  completion text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better query performance
create index history_user_id_idx on public.history(user_id);
create index history_created_at_idx on public.history(created_at desc);

-- Create subscriptions table
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade unique,
  stripe_customer_id text,
  stripe_subscription_id text,
  plan_id text not null,
  status text not null check (status in ('active', 'canceled', 'expired')),
  current_period_end timestamp with time zone not null,
  token_limit integer not null,
  tokens_used integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create index for subscription lookups
create index subscriptions_user_id_idx on public.subscriptions(user_id);
create index subscriptions_stripe_customer_id_idx on public.subscriptions(stripe_customer_id);

-- Enable RLS
alter table public.history enable row level security;
alter table public.subscriptions enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can insert their own history items" on public.history;
drop policy if exists "Users can view their own history items" on public.history;
drop policy if exists "Users can delete their own history items" on public.history;
drop policy if exists "Users can view their own subscription" on public.subscriptions;
drop policy if exists "Users can manage their own subscription" on public.subscriptions;

-- History policies
create policy "Users can insert their own history items"
  on public.history for insert
  with check (auth.uid() = user_id);

create policy "Users can view their own history items"
  on public.history for select
  using (auth.uid() = user_id);

create policy "Users can delete their own history items"
  on public.history for delete
  using (auth.uid() = user_id);

-- Subscription policies - combined into a single policy for all operations
create policy "Users can manage their own subscription"
  on public.subscriptions
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Function to handle updated_at timestamp
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger for updated_at
create trigger handle_updated_at
  before update on public.subscriptions
  for each row
  execute function handle_updated_at();

-- Function to safely increment token usage
create or replace function increment_token_usage(user_id_input uuid, tokens_to_add int)
returns void as $$
begin
  update public.subscriptions
  set 
    tokens_used = tokens_used + tokens_to_add,
    updated_at = now()
  where user_id = user_id_input;
end;
$$ language plpgsql;