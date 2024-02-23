---
title: "Using Hono with SvelteKit: Full type-safety with RPC"
date: 2024-01-29
tags: ["hono", "sveltekit", "showcase", "tutorial"]
published: true
---

Introduction
-----------------------------

I fell in love with Svelte and SvelteKit recently and it gave me the fuel I needed to start some personal projects. I was feeling hostage by React and maybe that was ok until I needed some features that only RSC/Next.js was going to give me. That was the Armageddon. After dwelling with some ClojureScript and other FP languages that compile to JS I stumbled on the Svelte community and it was a blast how easy and beautiful it is.

Why Hono?
----------------------

If you ever used an SSRish framework you know that it has a way to create endpoints within its (probably) file-based routing. Of course, you can also simply inject the data into the route itself using its loaders.

But when trying to fix the problem of invalidation and wanting to get the same data in the same way on the client side you will probably lose some of the type-safety on the params, URL, response, etc.

After using tRPC on Next.js (t3) I've been passionate about the possibility of having end-to-end type-safety + a way to write your data sources not bound to the file-based route and its default APIs.

[Hono](https://hono.dev/) offers good DX and a blazingly fast library to help you build your backend with native RPC embedded in its code. It has Zod support and it's written with TypeScript with very readable types so you can understand what's happening. It also supports Bun and a bunch of runtimes so you can run it everywhere. Check the documentation! It's also very helpful.

Setup
---------------

First we need to scaffold a SvelteKit project using pnpm:

```bash
pnpm create svelte@latest sveltekit-hono-playground
```

Enter fullscreen mode Exit fullscreen mode

I used the following options (but it doesn't matter):

[![](https://media.dev.to/cdn-cgi/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F8w8tgtyj5bous1vbmkj9.png)
](https://media.dev.to/cdn-cgi/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F8w8tgtyj5bous1vbmkj9.png)

Now let's install hono (and validations dependencies):

```bash
pnpm install hono zod @hono/zod-validator
```

Enter fullscreen mode Exit fullscreen mode

Now let's run the project and keep it running with:

```bash
pnpm dev
```

Enter fullscreen mode Exit fullscreen mode

You should see something resembling the following:

[![](https://media.dev.to/cdn-cgi/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fw26mbylyxd2svb0k7k4q.png)
](https://media.dev.to/cdn-cgi/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fw26mbylyxd2svb0k7k4q.png)

The Backend
---------------------------

Let's focus now on creating some endpoints for us. Please don't get caught up on file placement and structure. Do it however you please and contact me if you fail to place the logic inside your preferred structure and I will try to help you.

###### ./src/lib/api.ts

```typescript
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

export const Task = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    done: z.boolean()
});

export type Task = z.infer<typeof Task>;

export const TaskCreateInput = Task.pick({ name: true });

export type TaskCreateInput = z.infer<typeof TaskCreateInput>;

export const TaskParam = Task.pick({ id: true });
export type TaskParam = z.infer<typeof TaskParam>;

/**
 * This will be our in-memory data store
 */
let tasks: Task[] = [];

export const router = new Hono()
    .get('/tasks', (c) => c.json<Task[]>(tasks))
    .post('/tasks', zValidator('json', TaskCreateInput), (c) => {
        const body = c.req.valid('json');
        const task = {
            id: crypto.randomUUID(),
            name: body.name,
            done: false
        };
        tasks = [...tasks, task];
        return c.json(task);
    })
    .post('/tasks/:id/finish', zValidator('param', TaskParam), (c) => {
        const { id } = c.req.valid('param');
        const task = tasks.find((task) => task.id === id);
        if (task) {
            task.done = true;
            return c.json(task);
        }

        throw c.json({ message: 'Task not found' }, 404);
    })
    .post('/tasks/:id/undo', zValidator('param', TaskParam), (c) => {
        const { id } = c.req.valid('param');
        const task = tasks.find((task) => task.id === id);
        if (task) {
            task.done = false;
            return c.json(task);
        }

        throw c.json({ message: 'Task not found' }, 404);
    })
    .post('/tasks/:id/delete', zValidator('param', TaskParam), (c) => {
        const { id } = c.req.valid('param');
        tasks = tasks.filter((task) => task.id !== id);
        return c.json({ message: 'Task deleted' });
    });

export const api = new Hono().route('/api', router);

export type Router = typeof router;
```

Enter fullscreen mode Exit fullscreen mode

And to make it work:

###### ./src/routes/api/\[...paths\]/+server.ts

```typescript
import { api } from '$lib/api';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ request }) => api.fetch(request);
export const POST: RequestHandler = ({ request }) => api.fetch(request);
```

Enter fullscreen mode Exit fullscreen mode

Above you can see the code that redirects the requests made with a URL starting with `/api` to be handled by Hono. The fetch method can be used in various ways to lift a Hono server including Bun. You can test `/api/tasks` on the browser you should see an empty JSON array.

RPC
-----------

So now let's add the RPC part:

###### ./src/lib/make-client.ts

> Please be aware that this part is not as straightforward as the rest. Make sure you give it a good read. I will be explaining it step-by-step on what is happening and why is it happening that way.

```svelte
import type { Router } from '$lib/api';
import { hc } from 'hono/client';

let browserClient: ReturnType<typeof hc<Router>>;

export const makeClient = (fetch: Window['fetch']) => {
    const isBrowser = typeof window !== 'undefined';
    const origin = isBrowser ? window.location.origin : '';

    if (isBrowser && browserClient) {
        return browserClient;
    }

    const client = hc<Router>(origin + '/api', { fetch });

    if (isBrowser) {
        browserClient = client;
    }

    return client;
};
```

Enter fullscreen mode Exit fullscreen mode

Now we will be using it like this to load the tasks into our view:

###### ./src/routes/+page.ts

```svelte
import { makeClient } from '$lib/make-client';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
    const client = makeClient(fetch);
    const tasks = await client.tasks.$get();

    if (!tasks.ok) {
        return { tasks: [] };
    }

    return {
        tasks: await tasks.json()
    };
}) satisfies PageLoad;
```

Enter fullscreen mode Exit fullscreen mode

> But what about that `makeClient` monster you made?
> Common Reader

The make client needs to be like that because it's being used on the backend and on the browser to bring data to the page.

You can see it receives fetch as a parameter, right? That is because (see ./src/routes/+page.ts) SvelteKit makes a custom fetch available from the backend to us. Of course, on the client side, Hono will be using the default `window.fetch` while on the backend, it's just not that simple.

That's because, in the backend context, we don't have access to the origin URL, and imagine doing self-requests every time to grab data, that would be not good.

SvelteKit fixes that by giving you a fetch that, before going to the network layer, tries to resolve the request into its handlers, which will fall back into calling what we wrote on `./src/routes/api/[...paths]/+server.ts` and if Hono can identify the route, will simply run its handler and return the value, again, skipping the network layer.

_You can [read more](https://kit.svelte.dev/docs/load#making-fetch-requests) about it if you want._

Also, we are sprinkling some **singleton pattern** esque to make sure that when creating the client on the browser we don't recreate the client at every usage.

The `window.location.origin` part is to not break the `$url` methods on the browser so we can easily invalidate the request on the client side. You can [also read more](https://hono.dev/guides/rpc#url) about this.

Building Our Application
-----------------------------------------------------

Our Task Manager will have only one page. I have added a little progressive enhancement, just for demonstration, by adding `use:enhance` on the form. And now you can see the whole app:

###### ./src/routes/+page.server.ts

```svelte
import { TaskCreateInput } from '$lib/api';
import { makeClient } from '$lib/make-client';
import type { Actions } from '@sveltejs/kit';

export const actions = {
    async default({ fetch, request }) {
        const client = makeClient(fetch);
        const form = await request.formData();
        const data = TaskCreateInput.parse(Object.fromEntries(form));
        const response = await client.tasks.$post({
            json: data
        });

        if (!response.ok) {
            return {
                message: 'An error occurred'
            };
        }

        return await response.json();
    }
} satisfies Actions;
```

Enter fullscreen mode Exit fullscreen mode

###### ./src/routes/+page.svelte

```svelte
<script lang="ts">
    import { enhance } from '$app/forms';
    import { invalidate } from '$app/navigation';
    import { makeClient } from '$lib/make-client.js';

    export let data;
    const client = makeClient(fetch);

    let isLoading = false;
    let taskName = '';

    async function handleActionClick(id: string, action: `${keyof (typeof client.tasks)[':id']}`) {
        try {
            isLoading = true;
            await client.tasks[':id'][action].$post({
                param: { id }
            });
            await invalidate(client.tasks.$url());
        } catch (error) {
            console.error(error);
        } finally {
            isLoading = false;
        }
    }
</script>

<h1>BTMW: The best task manager in the world</h1>

<div>
    <h2>New Task</h2>
    <form method="POST" use:enhance>
        <input type="text" name="name" required bind:value={taskName} disabled={isLoading} autofocus />
        <button type="submit" disabled={isLoading}>Add</button>
    </form>
</div>

<div>
    <h2>My Tasks</h2>
    {#if data.tasks.length === 0}
        <p>You don't have any tasks! Be free little bird</p>
    {:else}
        <ul>
            {#each data.tasks as task (task.id)}
                <li>
                    {task.done ? '✅' : '⬛️'}
                    {task.name}
                    {#if !task.done}
                        <button type="button" on:click={() => handleActionClick(task.id, 'finish')}
                            >Finish</button
                        >
                    {:else}
                        <button type="button" on:click={() => handleActionClick(task.id, 'undo')}>Undo</button>
                        <button type="button" on:click={() => handleActionClick(task.id, 'delete')}
                            >Delete</button
                        >
                    {/if}
                </li>
            {/each}
        </ul>
    {/if}
</div>
```

Enter fullscreen mode Exit fullscreen mode

Notice how Hono makes invalidating RPC requests frictionless by giving us the `$url` method. For every action that can be done on a single task, it invalidates the task list so we can have the updated task list without refreshing the page.

This will give us the following **responsive, fast, progressively enhanced, tasty** SPA to use as our task manager:

![](https://media.dev.to/cdn-cgi/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Ftys5905jyvi0bbvf242j.gif)

###  with Eden?

Elysia and (Eden)[https://github.com/elysiajs/eden] are awesome! I've been trying it and it gives probably the same features as Hono. Maybe some even better DX sometimes. But the lack of Zod support (I don't want to learn a new validation framework), `$url` method, and running on Bun [for now](https://github.com/elysiajs/node-adapter) made me choose to focus on Hono.

### Inspiration

[This article](https://dev.to/subhendupsingh/typed-fetch-with-sveltekit-and-hono-using-rpc-2clf), the Hono docs, Elysia SvelteKit example, [trpc-sveltekit](https://github.com/icflorescu/trpc-sveltekit) and lot's of general reading.

### Repository

You can find it [here](https://github.com/brunoti/sveltekit-hono-playground/tree/tutorial-1).

### What comes next?

Next will be trying to create a post on how and why use [@tanstack/query](https://tanstack.com/query/latest/docs/svelte) on SvelteKit. Keep in touch!

Thanks
-----------------

Thank you for reading. Feedback welcome to help me share knowledge effectively.

About the author
-------------------------------------

Hello there! I'm **bop**, a dedicated software engineer driven by a love for continuous learning and creative exploration. Stay connected with me for updates on my current activities and exciting projects.

- 🌐 **Website:** [bop.systems](http://bop.systems/)
- 📧 **Email:** [brunooliveira37@hotmail.com](https://mailto:brunooliveira37@hotmail.com/)

📱 **Social Media:**

*   [Twitter](https://twitter.com/original_bop)
*   [LinkedIn](https://www.linkedin.com/in/bruno-oliveira-de-paula-7175699a/)
*   [GitHub](https://github.com/brunoti)
*   [dev.to](https://dev.to/bop)

_You can also [buy me a coffee](https://www.buymeacoffee.com/bopdev) to support me, if you like what I do_
