<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { cn } from "$lib/utils.js";
    import type { HTMLAttributes } from "svelte/elements";
    import Logo from "$lib/components/main/logo.svelte";
</script>

<div class="mx-auto max-w-5xl relative">
    <div class="flex justify-between pt-10 pb-3 px-4 absolute">
        <a class="w-[115px]" href="/"><Logo></Logo></a>
    </div>
</div>
<div class="bg-background flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
    <div class="w-full max-w-sm md:max-w-3xl">
        <div class={cn("flex flex-col gap-6")}>
            <Card.Root class="overflow-hidden p-0">
                <Card.Content class="grid p-0 md:grid-cols-2">
                    <form class="p-6 md:p-8">
                        <div class="flex flex-col gap-6">
                            <div class="flex flex-col items-center text-center">
                                <h1 class="text-2xl font-bold">Register</h1>
                                <p class="text-muted-foreground text-balance">Create your Quizily account</p>
                            </div>
                            <div class="grid gap-3">
                                <Label for="email">Email</Label>
                                <Input id="email" type="email" placeholder="m@example.com" required />
                            </div>
                            <div class="grid gap-3">
                                <div class="flex items-center">
                                    <Label for="password">Password</Label>
                                    <!-- <a href="##" class="ml-auto text-sm underline-offset-2 hover:underline">
                                        Forgot your password?
                                    </a> -->
                                </div>
                                <Input id="password" type="password" required placeholder="***" />
                            </div>
                            <div class="grid gap-3">
                                <div class="flex items-center">
                                    <Label for="confirm-password">Confirm-Password</Label>
                                    <!-- <a href="##" class="ml-auto text-sm underline-offset-2 hover:underline">
                                        Forgot your password?
                                    </a> -->
                                </div>
                                <Input id="confirm-password" type="password" required placeholder="Confirm password" />
                            </div>
                            <Button type="submit" class="w-full">Login</Button>
                            <div
                                class="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t"
                            >
                                <span class="bg-card text-muted-foreground relative z-10 px-2"> Or continue with </span>
                            </div>

                            <div class="text-center text-sm">
                                Aready have an account?
                                <a href="/sign-in" class="underline underline-offset-4"> Sign in </a>
                            </div>
                        </div>
                    </form>
                    <div class="bg-muted relative hidden md:block">
                        <img
                            src="/static-2.svg"
                            alt="placeholder"
                            class="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </Card.Content>
            </Card.Root>
        </div>
    </div>
</div>
