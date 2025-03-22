# Estrutura do Banco de Dados Supabase

## Tabelas

### users (gerenciada pelo Supabase Auth)

```sql
-- Esta tabela é criada automaticamente pelo Supabase Auth
id uuid references auth.users primary key,
email text unique,
created_at timestamp with time zone default timezone('utc'::text, now()) not null,
updated_at timestamp with time zone default timezone('utc'::text, now()) not null
```

### user_profiles

```sql
create table user_profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null unique,
  username text not null,
  email text not null,
  theme text default 'light' not null,
  primary_color text default 'kawaii-pink' not null,
  font_family text default 'rounded' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar índices para melhor performance
create index user_profiles_user_id_idx on user_profiles(user_id);
create index user_profiles_username_idx on user_profiles(username);
create index user_profiles_email_idx on user_profiles(email);

-- Habilitar RLS (Row Level Security)
alter table user_profiles enable row level security;

-- Criar política para leitura pública de alguns campos (username)
create policy "Qualquer pessoa pode ver usernames"
  on user_profiles for select
  using (true);

-- Criar política para que usuários possam inserir seus próprios perfis
create policy "Usuários podem criar seus próprios perfis"
  on user_profiles for insert
  with check (auth.uid() = user_id);

-- Criar política para que usuários possam atualizar seus próprios perfis
create policy "Usuários podem atualizar seus próprios perfis"
  on user_profiles for update
  using (auth.uid() = user_id);

-- Criar política para que usuários possam deletar seus próprios perfis
create policy "Usuários podem deletar seus próprios perfis"
  on user_profiles for delete
  using (auth.uid() = user_id);

-- Trigger para atualizar updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_user_profiles_updated_at
  before update on user_profiles
  for each row
  execute function update_updated_at_column();
```

### diaries

```sql
create table diaries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar índice para melhor performance nas buscas por usuário
create index diaries_user_id_idx on diaries(user_id);

-- Habilitar RLS (Row Level Security)
alter table diaries enable row level security;

-- Criar política para que usuários só vejam seus próprios diários
create policy "Users can only view their own diaries"
  on diaries for select
  using (auth.uid() = user_id);

-- Criar política para que usuários só possam inserir seus próprios diários
create policy "Users can only insert their own diaries"
  on diaries for insert
  with check (auth.uid() = user_id);

-- Criar política para que usuários só possam atualizar seus próprios diários
create policy "Users can only update their own diaries"
  on diaries for update
  using (auth.uid() = user_id);

-- Criar política para que usuários só possam deletar seus próprios diários
create policy "Users can only delete their own diaries"
  on diaries for delete
  using (auth.uid() = user_id);

-- Trigger para atualizar updated_at
create trigger update_diaries_updated_at
  before update on diaries
  for each row
  execute function update_updated_at_column();
```

### entries

```sql
create table entries (
  id uuid default uuid_generate_v4() primary key,
  diary_id uuid references diaries on delete cascade not null,
  title text not null,
  content text not null,
  mood text,
  weather text,
  location text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Criar índice para melhor performance nas buscas por diário
create index entries_diary_id_idx on entries(diary_id);

-- Habilitar RLS (Row Level Security)
alter table entries enable row level security;

-- Criar política para que usuários só vejam entradas de seus próprios diários
create policy "Users can only view entries from their own diaries"
  on entries for select
  using (
    exists (
      select 1 from diaries
      where diaries.id = entries.diary_id
      and diaries.user_id = auth.uid()
    )
  );

-- Criar política para que usuários só possam inserir entradas em seus próprios diários
create policy "Users can only insert entries in their own diaries"
  on entries for insert
  with check (
    exists (
      select 1 from diaries
      where diaries.id = entries.diary_id
      and diaries.user_id = auth.uid()
    )
  );

-- Criar política para que usuários só possam atualizar entradas de seus próprios diários
create policy "Users can only update entries from their own diaries"
  on entries for update
  using (
    exists (
      select 1 from diaries
      where diaries.id = entries.diary_id
      and diaries.user_id = auth.uid()
    )
  );

-- Criar política para que usuários só possam deletar entradas de seus próprios diários
create policy "Users can only delete entries from their own diaries"
  on entries for delete
  using (
    exists (
      select 1 from diaries
      where diaries.id = entries.diary_id
      and diaries.user_id = auth.uid()
    )
  );

-- Trigger para atualizar updated_at
create trigger update_entries_updated_at
  before update on entries
  for each row
  execute function update_updated_at_column();
```

### tags

```sql
create table tags (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  user_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(name, user_id)
);

-- Criar índice para melhor performance nas buscas por usuário
create index tags_user_id_idx on tags(user_id);

-- Habilitar RLS (Row Level Security)
alter table tags enable row level security;

-- Criar política para que usuários só vejam suas próprias tags
create policy "Users can only view their own tags"
  on tags for select
  using (auth.uid() = user_id);

-- Criar política para que usuários só possam inserir suas próprias tags
create policy "Users can only insert their own tags"
  on tags for insert
  with check (auth.uid() = user_id);

-- Criar política para que usuários só possam atualizar suas próprias tags
create policy "Users can only update their own tags"
  on tags for update
  using (auth.uid() = user_id);

-- Criar política para que usuários só possam deletar suas próprias tags
create policy "Users can only delete their own tags"
  on tags for delete
  using (auth.uid() = user_id);
```

### entry_tags (tabela de junção entre entries e tags)

```sql
create table entry_tags (
  entry_id uuid references entries on delete cascade,
  tag_id uuid references tags on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (entry_id, tag_id)
);

-- Criar índices para melhor performance
create index entry_tags_entry_id_idx on entry_tags(entry_id);
create index entry_tags_tag_id_idx on entry_tags(tag_id);

-- Habilitar RLS (Row Level Security)
alter table entry_tags enable row level security;

-- Criar política para que usuários só vejam relações de suas próprias entradas e tags
create policy "Users can only view their own entry_tags"
  on entry_tags for select
  using (
    exists (
      select 1 from entries
      join diaries on entries.diary_id = diaries.id
      where entries.id = entry_tags.entry_id
      and diaries.user_id = auth.uid()
    )
  );

-- Criar política para que usuários só possam inserir relações com suas próprias entradas e tags
create policy "Users can only insert their own entry_tags"
  on entry_tags for insert
  with check (
    exists (
      select 1 from entries
      join diaries on entries.diary_id = diaries.id
      where entries.id = entry_tags.entry_id
      and diaries.user_id = auth.uid()
    )
  );

-- Criar política para que usuários só possam deletar relações de suas próprias entradas e tags
create policy "Users can only delete their own entry_tags"
  on entry_tags for delete
  using (
    exists (
      select 1 from entries
      join diaries on entries.diary_id = diaries.id
      where entries.id = entry_tags.entry_id
      and diaries.user_id = auth.uid()
    )
  );
```

## Funcionalidades Principais

1. **Autenticação de Usuários**

   - Gerenciada pelo Supabase Auth
   - Suporte para login com email/senha
   - Perfil de usuário com configurações personalizadas
   - Possibilidade de adicionar outros provedores (Google, GitHub, etc.)

2. **Gerenciamento de Diários**

   - Cada usuário pode ter múltiplos diários
   - Controle total sobre seus próprios diários (CRUD)
   - Segurança baseada em RLS

3. **Entradas de Diário**

   - Vinculadas a um diário específico
   - Título e conteúdo em texto
   - Metadados como humor, clima e localização
   - Proteção por RLS baseada na propriedade do diário

4. **Sistema de Tags**
   - Tags personalizadas por usuário
   - Relacionamento many-to-many com entradas
   - Segurança baseada em RLS

## Segurança

- Row Level Security (RLS) habilitada em todas as tabelas
- Políticas de acesso específicas para cada operação CRUD
- Relacionamentos protegidos através de políticas em cascata
- Índices otimizados para melhor performance

## Observações

1. As timestamps são automaticamente gerenciadas usando UTC
2. UUIDs são usados como identificadores primários para maior segurança
3. Constraints de chave estrangeira garantem integridade referencial
4. Índices estratégicos para otimizar consultas comuns
5. Triggers automáticos para atualização de timestamps
6. Perfil de usuário unificado com configurações
