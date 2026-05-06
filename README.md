# printrax
A webapp used to track medium to large-scale print jobs.

## Supabase auth setup
1. Create a `.env.local` file using `.env.example`.
2. Fill in your Supabase project URL and anon key.
3. In Supabase Auth settings, set your site URL to your app URL (for local dev use `http://localhost:3000`).
4. Start the app with `npm run dev`.

## Auth routes
- `/auth/sign-up` for account creation
- `/auth/login` for returning users
