<script lang="ts">
    import { Separator } from "$lib/components/ui/separator";
    import * as Breadcrumb from "$lib/components/ui/breadcrumb";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import Card from "$lib/components/ui/card/card.svelte";
    import AppNav from "$lib/components/main/app-nav.svelte";
    import BellIcon from "@lucide/svelte/icons/bell";
    import CheckIcon from "@lucide/svelte/icons/check";
    import GlobeIcon from "@lucide/svelte/icons/globe";
    import HouseIcon from "@lucide/svelte/icons/house";
    import KeyboardIcon from "@lucide/svelte/icons/keyboard";
    import LinkIcon from "@lucide/svelte/icons/link";
    import LockIcon from "@lucide/svelte/icons/lock";
    import MenuIcon from "@lucide/svelte/icons/menu";
    import MessageCircleIcon from "@lucide/svelte/icons/message-circle";
    import PaintbrushIcon from "@lucide/svelte/icons/paintbrush";
    import SettingsIcon from "@lucide/svelte/icons/settings";
    import VideoIcon from "@lucide/svelte/icons/video";

    import { authClient } from "$lib/auth-client";
    import type { Component } from "svelte";
    import Logo from "./logo.svelte";
    import LogoSquare from "./logo-square.svelte";
    import { cn } from "$lib/utils";
    import { match, type MatchFunction } from "path-to-regexp";
    import { page } from "$app/state";
    import AppUserProfile from "./app-user-profile.svelte";
    const session = authClient.useSession();

    const data: Record<
        string,
        Array<{
            name: string;
            match?: MatchFunction<Partial<Record<string, string | string[]>>>;
            path?: string;
            icon: Component;
        }>
    > = {
        Menu: [
            {
                name: "Home",
                icon: HouseIcon,
                match: match("/"),
                path: "/",
                //
            },
            // {
            //     name: "Setting",
            //     icon: SettingsIcon,
            //     match: match("/setting"),
            //     path: "/setting",
            // },
        ],
    };

    let isActive = Object.keys(data)
        .map((a) => data[a])
        .flat(1)
        .find((a) => !!a.match?.(page.url.pathname));

    let props = $props();
</script>

<div class="flex flex-col w-full h-screen overflow-hidden">
    <!-- <AppNav></AppNav> -->
    <Sidebar.Provider>
        <Sidebar.Root class="border-r">
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
                                        Workspace
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
                        <Sidebar.GroupLabel>{key}</Sidebar.GroupLabel>
                        <Sidebar.GroupContent>
                            <Sidebar.Menu>
                                {#each data[key] as item (item.name)}
                                    <Sidebar.MenuItem>
                                        <Sidebar.MenuButton
                                            class="h-10"
                                            isActive={!!item.match?.(
                                                page.url.pathname,
                                            )}
                                        >
                                            {#snippet child({ props })}
                                                <a href={item.path} {...props}>
                                                    <item.icon />
                                                    <span>{item.name}</span>
                                                </a>
                                            {/snippet}
                                        </Sidebar.MenuButton>
                                    </Sidebar.MenuItem>
                                {/each}
                            </Sidebar.Menu>
                        </Sidebar.GroupContent>
                    </Sidebar.Group>
                {/each}
            </Sidebar.Content>
        </Sidebar.Root>
        <Sidebar.Inset>
            <header
                class="flex bg-sidebar h-16 shrink-0 items-center gap-2 border-b px-4"
            >
                <Sidebar.Trigger class="-ml-1" />
                <Separator orientation="vertical" class="mr-2 h-4" />
                <Breadcrumb.Root>
                    <Breadcrumb.List>
                        <Breadcrumb.Item class="hidden md:block">
                            <Breadcrumb.Link href="/">
                                Workspace
                            </Breadcrumb.Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Separator class="hidden md:block" />
                        <Breadcrumb.Item>
                            <Breadcrumb.Page>{isActive?.name}</Breadcrumb.Page>
                        </Breadcrumb.Item>
                    </Breadcrumb.List>
                </Breadcrumb.Root>
                <div class="ml-auto"></div>
                <AppUserProfile></AppUserProfile>
            </header>
            <div class="flex flex-1 flex-col gap-4 p-4 overflow-y-auto">
                {@render props.children?.()}
            </div>
        </Sidebar.Inset>
    </Sidebar.Provider>
</div>
