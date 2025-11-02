<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import Card from "$lib/components/ui/card/card.svelte";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import EllipsisVertical from "@lucide/svelte/icons/ellipsis-vertical";
    import { MediaQuery } from "svelte/reactivity";
    import { Avaaataaar, getAvaaataaar } from "../avaaataaar";
    import AppQuizCardCategory from "./app-quiz-card-category.svelte";
    import type { QuizCardProps } from "./types";
    import { cn } from "$lib/utils";
    import { useMediaQuery } from "$lib/hooks/use-media-query.svelte";
    import { Skeleton } from "$lib/components/ui/skeleton";
    let {
        title,
        id,
        categories,
        state: _state,
        ondelete,
    }: QuizCardProps = $props();

    const url = id.length > 0 ? "/" + ["quiz", id].join("/") : "";
    const a = getAvaaataaar(title);
    const b = getAvaaataaar(title + 1);
    const c = getAvaaataaar(title + 2);

    const large_mediaquery = useMediaQuery("min-width: 460px");
    const small_mediaquery = useMediaQuery("min-width: 360px");

    let is_pending = $state(_state.toLowerCase() == "pending");
</script>

<Card
    class="relative bg-neutral-100 hover:ring-2 ring-blue-400 transition-all flex md:flex-row gap-3 rounded-lg p-3 pb-6 md:pb-3 md:pl-6 w-full h-[300px] md:h-[260px] border border-stone-300 overflow-hidden"
>
    {#if !is_pending}
        <a
            href={url}
            class="absolute top-0 left-0 size-full opacity-0"
            tabindex="-1">a</a
        >
    {/if}
    <div
        class="w-2 h-full absolute left-0 top-0 opacity-60 hidden md:flex"
        style="background: #{b.shape_color};"
    ></div>
    <div
        class="w-full md:max-w-[400px] h-full overflow-hidden relative pointer-events-none rounded-lg"
        style="color: #{a.shape_color}; background: #{b.background}"
    >
        {#if is_pending}
            <Skeleton class="h-full w-full absolute" />
        {:else}
            <Avaaataaar
                style="
opacity: 0.2;
position: absolute;
top:{a.y}%;
left:{c.x}%;
transform: scale({c.scale * 12})"
                shape={c.shape}
            ></Avaaataaar>
            <Avaaataaar
                style="
color: #{a.shape_color};
position: absolute;
top:{a.y - 10}%;
left:{Math.abs(a.x - c.x)}%;
transform: scale({a.scale * 8})"
                shape={a.shape}
            ></Avaaataaar>
            <Avaaataaar
                style="
color: #{b.shape_color};
opacity:0.8;
position: absolute;
top:{a.x}%;
left:{a.y}%;
transform: scale({b.scale * 5})"
                shape={b.shape}
            ></Avaaataaar>
        {/if}
    </div>
    <div use:large_mediaquery use:small_mediaquery class="md:pl-4 w-full">
        <div class="flex justify-between w-full relative">
            {#if is_pending}
                <div class="w-full flex flex-col gap-2 pr-4">
                    <div class="flex gap-2">
                        <Skeleton class="h-10 w-[30%]"></Skeleton>
                        <Skeleton class="h-10 w-full"></Skeleton>
                    </div>
                    <Skeleton class="h-10 w-[40%]"></Skeleton>
                </div>
            {:else}
                <div class="lg:text-2xl md:text-lg pr-4">{title}</div>
            {/if}
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    {#snippet child({ props })}
                        <Button {...props} variant="ghost" size="icon">
                            <EllipsisVertical></EllipsisVertical>
                        </Button>
                    {/snippet}
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="end">
                    <DropdownMenu.Item
                        variant="destructive"
                        onclick={() => ondelete?.(id)}
                    >
                        Delete
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </div>
        <div
            class={cn(
                "mt-4 grid gap-4",
                large_mediaquery.current
                    ? "grid-cols-3"
                    : small_mediaquery.current
                      ? "grid-cols-2"
                      : "grid-cols-1",
            )}
        >
            {#if is_pending}
                {#each { length: 2 } as _}
                    <Skeleton class="flex gap-2 h-10 max-w-[200px]"></Skeleton>
                {/each}
            {:else}
                {#each categories ?? [] as cate}
                    <AppQuizCardCategory {...cate}></AppQuizCardCategory>
                {/each}
            {/if}
        </div>
    </div>
</Card>
