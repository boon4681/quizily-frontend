<script lang="ts">
    import { Separator } from "$lib/components/ui/separator";
    import * as Breadcrumb from "$lib/components/ui/breadcrumb";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import Card from "$lib/components/ui/card/card.svelte";
    import { authClient } from "$lib/auth-client";
    import type { Component, Snippet } from "svelte";
    import Logo from "../logo.svelte";
    import LogoSquare from "../logo-square.svelte";
    import { cn } from "$lib/utils";
    import { match, type MatchFunction } from "path-to-regexp";
    import { page } from "$app/state";
    import AppUserProfile from "../app-user-profile.svelte";
    import { randiman, SHAPE_COLORS } from "../avaaataaar";
    import { BACKGROUND_COLORS } from "../avaaataaar/map";
    import type { Question } from ".";
    import Button from "$lib/components/ui/button/button.svelte";
    const session = authClient.useSession();

    let {
        questions,
        title,
        active = $bindable(),
        sidebar,
        ...props
    }: {
        questions?: Array<Question>;
        active?: string;
        title?: string;
        children?: Snippet;
        sidebar?: Snippet;
        header?: Snippet;
    } = $props();

    let data = $derived<Record<string, Array<Question>>>({
        Questions: questions ?? [],
    });

    let isActive = $derived<Question | undefined>(
        (questions ?? []).find((a) => a.id == active),
    );
</script>

<div class="flex flex-col w-full h-screen overflow-hidden">
    <!-- <AppNav></AppNav> -->
    <Sidebar.Provider>
        <Sidebar.Root class="border-r" collapsible="icon">
            <Sidebar.Header>
                <Sidebar.Menu>
                    <Sidebar.MenuItem>
                        <Sidebar.MenuButton size="lg">
                            {#snippet child({ props })}
                                <a
                                    href="/"
                                    {...props}
                                    class={cn(
                                        props.class + "",
                                        "bg-muted-foreground/25",
                                    )}
                                >
                                    <div
                                        class="bg-sidebar-primary p-2 text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
                                    >
                                        <LogoSquare variant="white"
                                        ></LogoSquare>
                                    </div>
                                    <div
                                        class="flex w-[100px] flex-col gap-0.5 leading-none"
                                    >
                                        Quiz
                                    </div>
                                </a>
                            {/snippet}
                        </Sidebar.MenuButton>
                    </Sidebar.MenuItem>
                </Sidebar.Menu>
            </Sidebar.Header>
            <Sidebar.Content>
                {#each Object.keys(data) as key (key)}
                    <Sidebar.Group>
                        <Sidebar.GroupLabel
                            class="top-0 rounded-none sticky z-10 bg-sidebar"
                        >
                            {key}
                        </Sidebar.GroupLabel>
                        <Sidebar.GroupContent>
                            <Sidebar.Menu>
                                {#each data[key] as item, i (item.id)}
                                    <Sidebar.MenuItem>
                                        <Sidebar.MenuButton
                                            class="border-2 hover:border-indigo-400 hover:bg-indigo-100 data-[active=true]:border-indigo-500"
                                            isActive={isActive?.id == item.id}
                                            onclick={() => (active = item.id)}
                                        >
                                            {#snippet child({ props })}
                                                {@const color =
                                                    BACKGROUND_COLORS[
                                                        randiman({
                                                            value: String(i),
                                                            min: 0,
                                                            max: 19,
                                                        })
                                                    ]}
                                                <button
                                                    {...props}
                                                    class={cn(
                                                        props.class as string,
                                                        "h-auto flex flex-col items-start cursor-pointer",
                                                        "group-data-[collapsible=icon]:p-0!",
                                                    )}
                                                >
                                                    <div
                                                        class={cn(
                                                            "flex size-8 rounded-full shrink-0 items-center justify-center text-black",
                                                            "group-data-[collapsible=icon]:size-[28px] group-data-[collapsible=icon]:rounded-none",
                                                        )}
                                                        style="background-color: #{color};"
                                                    >
                                                        Q{i + 1}
                                                    </div>
                                                    <div
                                                        class="pt-2 w-full whitespace-nowrap overflow-hidden text-ellipsis"
                                                    >
                                                        <span>{item.title}</span
                                                        >
                                                    </div>
                                                </button>
                                            {/snippet}
                                        </Sidebar.MenuButton>
                                    </Sidebar.MenuItem>
                                {/each}
                            </Sidebar.Menu>
                        </Sidebar.GroupContent>
                    </Sidebar.Group>
                {/each}
                <div
                    class="w-full shrink-0 p-4 group-data-[collapsible=icon]:p-2 sticky bottom-0 z-10 bg-sidebar border-t"
                >
                    {@render sidebar?.()}
                </div>
            </Sidebar.Content>
        </Sidebar.Root>
        <Sidebar.Inset class="overflow-x-hidden">
            <header
                class="flex bg-sidebar h-16 shrink-0 items-center gap-2 border-b px-4 overflow-hidden w-full"
            >
                <Sidebar.Trigger class="-ml-1" />
                <Separator orientation="vertical" class="mr-2 h-4" />
                <Breadcrumb.Root
                    class="max-w-[70%] min-w-0 w-full overflow-hidden"
                >
                    <Breadcrumb.List>
                        <Breadcrumb.Item class="hidden md:block">
                            <Breadcrumb.Link href="/">Quiz</Breadcrumb.Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Separator class="hidden md:block" />
                        <Breadcrumb.Item>
                            <Breadcrumb.Page
                                class="w-full max-w-[120px] lg:max-w-[400px] overflow-hidden text-ellipsis whitespace-nowrap"
                            >
                                <!-- TODO -->
                                {title}
                            </Breadcrumb.Page>
                        </Breadcrumb.Item>
                    </Breadcrumb.List>
                </Breadcrumb.Root>
                <div class="ml-auto"></div>
                {@render props.header?.()}
            </header>
            <div class="flex flex-1 flex-col gap-4 p-4">
                {@render props.children?.()}
            </div>
        </Sidebar.Inset>
    </Sidebar.Provider>
</div>
