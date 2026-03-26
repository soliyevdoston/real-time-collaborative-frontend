# Real-time Collaborative Notes App Frontend

Ushbu loyiha real-time jamoaviy hujjat yozish uchun frontend qismi hisoblanadi.
Frontend Next.js App Router asosida qurilgan va backend bilan REST + Socket + Hocuspocus orqali ishlaydi.

## Asosiy imkoniyatlar

- Ro'yxatdan o'tish va kirish (JWT access token + refresh cookie oqimi)
- Dashboard: hujjat yaratish, ro'yxatini ko'rish, o'chirish
- Note sahifasi: real-time editor, online foydalanuvchilar, kommentlar, versiyalar
- Share boshqaruvi: `RESTRICTED` va `ANYONE_WITH_LINK`, `VIEW` va `EDIT`
- Kabinet: ism yangilash, avatar yuklash
- Real-time kollaboratsiya:
  - TipTap + Y.js + Hocuspocus (matn sinxroni)
  - Socket.IO (presence, komment eventlari, share/collaborator o'zgarishlari)

## Texnologiyalar

- Next.js 16 (App Router)
- React 19 + TypeScript
- TanStack Query
- TipTap + Y.js + `@hocuspocus/provider`
- Socket.IO Client
- date-fns, lucide-react

## Muhim papkalar

- `src/app/` - route sahifalar (`/`, `/auth/*`, `/dashboard`, `/notes/[id]`, `/cabinet`)
- `src/components/` - umumiy UI va providerlar
- `src/contexts/auth-context.tsx` - autentifikatsiya sessiyasi va `authenticatedFetch`
- `src/lib/` - API util, type va yordamchi funksiyalar

## Lokal ishga tushirish

1. Dependency o'rnatish:

```bash
npm install
```

2. Root papkada `.env.local` yarating:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
NEXT_PUBLIC_COLLAB_URL=ws://localhost:1234
```

3. Frontendni ishga tushirish:

```bash
npm run dev
```

4. Brauzer:

- `http://localhost:3000`

## Production env (Vercel)

Vercel loyihasida quyidagi env qiymatlarini kiriting:

```env
NEXT_PUBLIC_API_URL=https://<backend-domain>/api
NEXT_PUBLIC_SOCKET_URL=https://<backend-domain>
NEXT_PUBLIC_COLLAB_URL=wss://<backend-domain>
```

Misol:

```env
NEXT_PUBLIC_API_URL=https://real-time-collaborative-notes-app-rxhf.onrender.com/api
NEXT_PUBLIC_SOCKET_URL=https://real-time-collaborative-notes-app-rxhf.onrender.com
NEXT_PUBLIC_COLLAB_URL=wss://real-time-collaborative-notes-app-rxhf.onrender.com
```

## Frontend qanday ishlaydi

1. Foydalanuvchi `login/register` qiladi.
2. Backend `accessToken` (response body) va `refreshToken` (httpOnly cookie) qaytaradi.
3. Frontend access tokenni `localStorage`da saqlaydi.
4. Har bir himoyalangan so'rovda `Authorization: Bearer <token>` yuboriladi.
5. Agar `401` bo'lsa, frontend avtomatik `/auth/refresh` qilib sessiyani yangilaydi.
6. Note sahifasida:
   - Editor `NEXT_PUBLIC_COLLAB_URL` orqali Hocuspocusga ulanadi.
   - Socket `NEXT_PUBLIC_SOCKET_URL` orqali presence/komment eventlarini oladi.
   - REST API note metadata, share, comments, versions uchun ishlaydi.

## NPM scriptlar

- `npm run dev` - development server
- `npm run build` - production build
- `npm run start` - builddan keyin ishga tushirish
- `npm run lint` - ESLint tekshiruvi

## Backend bilan bog'lanish

Backend alohida repository/papkada bo'lishi mumkin.
Sizning local muhitingizda backend:

- `../Real-time Colloborative Notes app/real-time-collaborative-notes-app-backend`

Frontend to'g'ri ishlashi uchun backendda CORS va cookie sozlamalari production domain bilan mos bo'lishi shart.

## Tez-tez uchraydigan xatolar

- CORS xatosi:
  - Sabab: backend `Access-Control-Allow-Origin` frontend domeniga mos emas.
  - Yechim: backend `FRONTEND_URL`/`FRONTEND_URLS` ni to'g'ri sozlash.
- `localhost:4000`ga urinish:
  - Sabab: Vercel env qiymati kiritilmagan.
  - Yechim: `NEXT_PUBLIC_*` env’larni platformada qo'shib, redeploy qilish.
- Refresh ishlamasligi:
  - Sabab: productionda cookie `SameSite/secure` noto'g'ri.
  - Yechim: backendda production cookie `sameSite: "none"`, `secure: true`.
