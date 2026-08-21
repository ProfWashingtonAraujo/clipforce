alter table public.projects
  add column source_url text,
  add column storage_path text,
  add column thumbnail_path text,
  add column import_status text not null default 'idle'
    check (import_status in ('idle', 'queued', 'processing', 'ready', 'failed')),
  add column import_error text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-media',
  'project-media',
  false,
  524288000,
  array['video/mp4', 'image/jpeg']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Users can view their project media"
on storage.objects for select to authenticated
using (
  bucket_id = 'project-media'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

create policy "Users can delete their project media"
on storage.objects for delete to authenticated
using (
  bucket_id = 'project-media'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
