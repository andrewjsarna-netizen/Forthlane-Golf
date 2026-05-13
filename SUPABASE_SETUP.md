# Supabase Setup

1. Create a Supabase project.
2. Run [supabase-setup.sql](C:\Users\AndrewSarna\OneDrive - Forthlane Partners\Documents\Codex\supabase-setup.sql) in the SQL Editor, even if you already used Supabase for the Masters version.
3. Copy your project URL and anon key from Project Settings > API.
4. Paste them into [supabase-config.js](C:\Users\AndrewSarna\OneDrive - Forthlane Partners\Documents\Codex\supabase-config.js).

Use this format:

```js
window.SUPABASE_CONFIG = {
  url: "https://YOUR-PROJECT.supabase.co",
  anonKey: "YOUR-ANON-KEY"
};
```

This setup now creates a dedicated shared table for the PGA pool:

`public.pga_championship_teams_2026`
