<script>
    import Logo from "./logo.svelte";
    import AppUserProfile from "./app-user-profile.svelte";
    import { authClient } from "$lib/auth-client";
    const session = authClient.useSession();
</script>

<div class="mx-auto max-w-5xl relative">
    <div class="flex justify-between pt-4 pb-3 px-4">
        <a class="w-[115px]" href="/"><Logo></Logo></a>
        <AppUserProfile></AppUserProfile>
    </div>
</div>
