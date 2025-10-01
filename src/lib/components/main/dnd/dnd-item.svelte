<script lang="ts" module>
    import {
        onDestroy,
        tick,
        type Component,
        type ComponentProps,
        type Snippet,
    } from "svelte";
    import {
        RenderComponentConfig,
        RenderSnippetConfig,
        type Renderable,
    } from "./render-helpers";
    export type Context<TData> = { id: string } & TData;
</script>

<script lang="ts" generics="TData, TContext extends Context<TData>,TRender">
    import { Sortable } from "@dnd-kit/dom/sortable";
    import { onMount } from "svelte";
    import { DndManagerContext } from "./context";
    import GripVertical from "@lucide/svelte/icons/grip-vertical";
    import GripHorizontal from "@lucide/svelte/icons/grip-horizontal";
    import { watch } from "runed";
    interface Props<TContext, TRender> {
        index: number;
        data: TContext;
        handle?: Snippet;
        render: TRender extends (
            data: TContext,
            index: number,
        ) => Renderable<any>
            ? TRender
            : never;
    }
    let { data, render, index, ...props }: Props<TContext, TRender> = $props();

    const manager_context = DndManagerContext.get();
    let ref = $state<HTMLElement>();
    let sortable: Sortable;
    onMount(async () => {
        await tick();
        sortable = new Sortable(
            {
                id: data.id,
                index,
                element: ref,
            },
            $manager_context,
        );
    });

    watch(
        () => index,
        () => {
            if (!sortable) return;
            if (sortable.manager?.dragOperation.status.idle) {
                sortable.refreshShape();
            }
        },
    );
    onDestroy(() => {
        ref?.remove();
    });
</script>

{#snippet FlexRender()}
    {@const result = render(data, index)}
    {#if result instanceof RenderComponentConfig}
        {@const { component: Component, props } = result}
        <Component {...props} {...data}></Component>
    {:else if result instanceof RenderSnippetConfig}
        {@const { snippet, params } = result}
        {@render snippet(params)}
    {/if}
{/snippet}

<div
    class="dnd-item relative select-none w-full h-full overflow-hidden flex gap-3"
    bind:this={ref}
>
    <div
        class="flex bg-muted items-center w-full overflow-hidden border rounded-md px-2"
    >
        <GripVertical
            class="text-foreground cursor-pointer outline-none shrink-0 size-5"
        ></GripVertical>
        <div class="w-full p-2 overflow-hidden">
            <div class="rounded w-full">
                {@render FlexRender()}
            </div>
        </div>
    </div>

    <!-- Placeholder -->
    <!-- {#if isDragging.current}
        <div class="flex items-center justify-center absolute inset-0">
            <div
                class="w-full h-full bg-orange-400/10 rounded border-2 border-orange border-dashed flex items-center justify-center"
            >
                <span class="text-orange">Moving</span>
            </div>
        </div>
    {/if} -->
</div>
