<script lang="ts" module>
    import { cn, type WithElementRef } from "$lib/utils.js";
    import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
    import { type VariantProps, tv } from "tailwind-variants";

    export const boldButtonVariants = tv({
        base: "rounded-full transition-all duration-100 font-medium px-8 py-3 not-disabled:cursor-pointer disabled:bg-[#D3D3D3] disabled:text-[#9F9F9F]",
        variants: {
            variant: {
                default: "c-shadow bg-c-light-gold [--color:var(--color-c-light-gold)]",
                dark: "c-shadow bg-[#333330] [--color:#191810] not-disabled:text-white",
                outline: "border-2 border-[#A9A9A9] not-disabled:hover:border-[#878787]",
            },
            size: {
                default: "",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    });

    export type BoldButtonVariant = VariantProps<typeof boldButtonVariants>["variant"];
    export type BoldButtonSize = VariantProps<typeof boldButtonVariants>["size"];

    export type BoldButtonProps = WithElementRef<HTMLButtonAttributes> &
        WithElementRef<HTMLAnchorAttributes> & {
            variant?: BoldButtonVariant;
            size?: BoldButtonSize;
        };
</script>

<script lang="ts">
    let {
        class: className,
        variant = "default",
        size = "default",
        ref = $bindable(null),
        href = undefined,
        type = "button",
        disabled,
        children,
        ...restProps
    }: BoldButtonProps = $props();
</script>

<div class="group">
    <div
        class={cn(
            variant == "outline" || disabled
                ? ""
                : "pb-1 transition-all duration-100 group-active:pt-1 group-active:pb-0",
        )}
    >
        {#if href}
            <a
                data-slot="button"
                aria-disabled={disabled}
                role={disabled ? "link" : undefined}
                bind:this={ref}
                href={disabled ? undefined : href}
                tabindex={disabled ? -1 : undefined}
            >
                <div class={cn(boldButtonVariants({ variant, size }), className)}>
                    {@render children?.()}
                </div>
            </a>
        {:else}
            <button
                bind:this={ref}
                data-slot="button"
                class={cn(boldButtonVariants({ variant, size }), className)}
                {type}
                {disabled}
                {...restProps}
            >
                {@render children?.()}
            </button>
        {/if}
    </div>
</div>

<style>
    .c-shadow:not(*:disabled) {
        box-shadow:
            0 4px 0 0 rgba(0, 0, 0, 0.395),
            0 4px 0 0 var(--color);
    }
    .group:active .c-shadow:not(*:disabled) {
        box-shadow: 0 0 0 0 currentColor;
    }
    .group:active .c-shadow:not(*:disabled) {
        opacity: 0.7;
    }
</style>
