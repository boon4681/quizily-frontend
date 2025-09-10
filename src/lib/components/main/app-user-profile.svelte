<script lang="ts">
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { createAvatar } from "@dicebear/core";
    import { notionists } from "@dicebear/collection";
    import { authClient } from "$lib/auth-client";
    import LogoutIcon from "@lucide/svelte/icons/log-out";
    const session = authClient.useSession();
    const avatar = createAvatar(notionists, {
        seed: $session.data?.user.email,
        scale: 170,
        backgroundColor: ["b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf"],
        translateY: 10,
    });
</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger>
        <div
            class="p-1.5 shadow rounded-3xl bg-white flex items-center gap-2.5 pr-5 w-full min-w-0 max-w-[170px] overflow-hidden"
        >
            <img
                class="size-9 rounded-[50%] shrink-0"
                src={avatar.toDataUri()}
                alt=""
            />
            <div
                class="w-[calc(100%)] overflow-hidden text-xs whitespace-nowrap text-ellipsis min-w-0 max-w-full"
            >
                {$session.data?.user.email}
            </div>
        </div>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content class="w-[170px]">
        <DropdownMenu.Group>
            <DropdownMenu.Label>My Account</DropdownMenu.Label>
            <DropdownMenu.Separator />
            <DropdownMenu.Item
                variant="destructive"
                onclick={async () => {
                    await authClient.signOut();
                }}
            >
                <LogoutIcon class="text-inherit"></LogoutIcon>
                Logout
            </DropdownMenu.Item>
        </DropdownMenu.Group>
    </DropdownMenu.Content>
</DropdownMenu.Root>
