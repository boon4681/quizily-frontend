<script lang="ts">
    let {
        shape,
        class: className,
        style,
    }: {
        shape: string;
        class?: string;
        style?: string;
    } = $props();
</script>

<svg
    class={className}
    {style}
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
>
    {@html shape}
</svg>
