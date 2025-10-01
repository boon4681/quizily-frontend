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
    let { title, id, categories }: QuizCardProps = $props();

    const url = id.length > 0 ? "/" + ["quiz", id].join("/") : "";
    const a = getAvaaataaar(title);
    const b = getAvaaataaar(title + 1);
    const c = getAvaaataaar(title + 2);

    const large_mediaquery = useMediaQuery("min-width: 460px");
    const small_mediaquery = useMediaQuery("min-width: 360px");

    let is_pending = $state(false);
</script>

<Card
    class="relative bg-neutral-100 hover:ring-2 ring-blue-400 transition-all flex flex-row gap-3 rounded-lg p-3 md:pl-6 w-full h-[260px] border border-stone-300 overflow-hidden"
>
    <a
        href={url}
        class="absolute top-0 left-0 size-full opacity-0"
        tabindex="-1">a</a
    >
    <div
        class="w-2 h-full absolute left-0 top-0 opacity-60 hidden md:flex"
        style="background: #{b.shape_color};"
    ></div>
    <div
        class="w-full md:max-w-[400px] h-full overflow-hidden relative pointer-events-none rounded-lg"
        style="color: #{a.shape_color}; background: #{a.background}"
    >
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
    </div>
    <div use:large_mediaquery use:small_mediaquery class="pl-4 w-full">
        <div class="flex justify-between w-full relative">
            <div class="text-2xl">{title}</div>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                    {#snippet child({ props })}
                        <Button {...props} variant="ghost" size="icon">
                            <EllipsisVertical></EllipsisVertical>
                        </Button>
                    {/snippet}
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="start">
                    <DropdownMenu.Item variant="destructive">
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
            {#each categories ?? [] as cate}
                <AppQuizCardCategory {...cate}></AppQuizCardCategory>
            {/each}
        </div>
    </div>
</Card>
