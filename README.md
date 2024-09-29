# Blog Collection

## New Features

This blog post system is built on official [https://github.com/leerob/next-saas-starter](next-saas-starter) repo from lee-rob. With current features we have added some new exciting features.

- Role-based authorization on the server and client
- Permission that is dynamic and module-wise
- Data-table with rich feature.
- Server-side pagination to handle large data set.
- Server-side search and filter with better optimization.

## Getting Started

```bash
git clone https://github.com/shirjoybhuban
cd blog-collection
pnpm install
```

## Running Locally

Use the included setup script to create your `.env` file:

```bash
pnpm db:setup
```

Then, run the database migrations and seed the database with a default user and team:

```bash
pnpm db:migrate
pnpm db:seed
```

This will create the following users with their respective role and permissions:

- Roles:
- `owner`
- `author`
- `member`

- Users:
- `owner@test.com(admin123)`
- `author@test.com(admin123)`
- `member@test.com(admin123)`

In current system permission are applied in Blog module. Seed will create some dummy blogs to check all features.

- Permissions:
- `owner(Read, Write, Edit, Delete)`
- `author@test.com(Read, Write, Edit)`
- `member@test.com(Read)`


Finally, run the Next.js development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app in action.

## Stack used

- Frontend:
- `Nextjs`
- `Tailwind`
- `Shadcn-ui`
- `Stripe`

- Backend:
- `Nextjs`
- `Postgres`
- `Drizzle ORM`

## Implementation details

Data-Table
TenStack Table is being used for our data table. In terms of customization, We can customize it with our predeifined style and layout. It is very performant. It uses efficient internal memoization to minimize unnecessary re-renders which makes our tables faster and more responsive. TenStack Table makes it easy to implement server-side pagination, sorting, and filtering, which is essential for handling large datasets. It has strong TypeScript support. So for large datasets Tenstack table is perfect.

Search & Filter
Search and Filter acting independently outside table component. We can add custom filter whenever we want and accommodate that with data-table. I used debounce in searching for better performance and less api call.

Data-Fetch
I choose SWR because it simplify the data-fetching process. Its caching and revalidation feature makes the ui more responsive in slow and unreliable network. SWR is lightweight and has strong typescript support.

State Management
For global state management I choose context api to handle the state. Here we need to share the user data and permission list aross the compoonent. Redux or Mobox can be overkill to handle the state in this scenario though we can go with redux(RTK) in future if needed. Context api minimize the prop drilling. It is very  lighweight and easy to implement. The useConxet hook makes it simple to consume context value. For local state managemnt I used react's useState hook. 

Authorization
Role base authorization build on custom logic. A checker has been shared through component which accept module and action to check if the module has a permission or not. I wrapped a component with permission provider which contain the checker. I also added guard to check if the api has permission or not in backend. 

## Improvement Scope
- With more time we can make it more featureful. 