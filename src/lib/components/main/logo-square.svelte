<script lang="ts">
    let {
        class: className,
        variant = "default",
    }: { class?: string; variant?: "default" | "white" } = $props();
    let color = variant == "default" ? "#4157FF" : "white";
</script>

<svg
    width="36"
    height="36"
    viewBox="0 0 36 36"
    class={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
>
    <rect
        width="7.2"
        height="4.8"
        rx="2.4"
        transform="matrix(4.37114e-08 1 1 -4.37114e-08 31.2 28.8)"
        fill={color}
    />
    <path
        d="M25.3496 36C27.2551 36 28.7998 34.4553 28.7998 32.5498V32.5498C28.7998 30.6443 27.2551 29.0996 25.3496 29.0996L15 29.0996C8.92487 29.0996 4 24.1747 4 18.0996L4 14C4 7.92487 8.92487 3 15 3L21 3C27.0751 3 32 7.92487 32 14L32 23.2002C32 24.3048 32.8954 25.2002 34 25.2002V25.2002C35.1046 25.2002 36 24.3048 36 23.2002L36 11C36 4.92487 31.0751 -1.35834e-06 25 -1.09278e-06L11 -4.80825e-07C4.92487 -2.15273e-07 2.15273e-07 4.92487 4.80825e-07 11L1.09278e-06 25C1.35834e-06 31.0751 4.92487 36 11 36L25.3496 36Z"
        fill={color}
    />
</svg>
