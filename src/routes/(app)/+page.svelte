<script lang="ts">
    import AppLayout from "$lib/components/main/app-layout.svelte";
    import { AppQuizCard } from "$lib/components/main/app-quiz-card";
    import type { Quiz } from "$lib/components/main/quiz-layout";
    import Button from "$lib/components/ui/button/button.svelte";
    import Spinner from "$lib/components/ui/spinner/spinner.svelte";
    import Plus from "@lucide/svelte/icons/plus";
    import * as AlertDialog from "$lib/components/ui/alert-dialog/index.js";
    import {
        createMutation,
        createQuery,
        useQueryClient,
    } from "@tanstack/svelte-query";
    const client = useQueryClient();

    const quiz_list = createQuery<Quiz[]>(() => ({
        queryKey: ["quiz", "list"],
        queryFn: async () =>
            await fetch("/api/quiz/list")
                .then((r) => r.json())
                .then((a) => a["data"]),
        refetchInterval: 5000,
    }));

    const deleteMutation = createMutation(() => ({
        mutationFn: async (id: string) =>
            await fetch(`/api/quiz/${id}`, {
                method: "DELETE",
            })
                .then((r) => r.json())
                .then((a) => {
                    if ("data" in a) {
                        return a["data"];
                    }
                    throw new Error(JSON.stringify(a));
                }),
        onSuccess: () =>
            client.invalidateQueries({ queryKey: ["quiz", "list"] }),
    }));
</script>

<AppLayout>
    <section class="max-w-5xl w-full mx-auto">
        <div class="flex justify-between">
            <h1 class="text-2xl mb-4">My quizzes</h1>
            <Button size="lg" href="/new/quiz">
                <Plus></Plus>
                <div>New Quiz</div>
            </Button>
        </div>
        <div class="flex flex-col gap-4">
            {#if quiz_list.status == "pending"}
                <div class="w-full flex items-center justify-center my-10">
                    <Spinner class="size-12"></Spinner>
                </div>
            {/if}
            {#if quiz_list.error}
                An error has occurred:
                {quiz_list.error.message}
            {/if}
            {#if quiz_list.data}
                {#each quiz_list.data as item (item.id+item.state)}
                    <AppQuizCard
                        id={item.id}
                        title={item.title}
                        state={item.state}
                        ondelete={() => {
                            deleteMutation.mutate(item.id, {
                                onSuccess() {
                                    quiz_list.data = quiz_list.data.filter(
                                        (a) => a.id != item.id,
                                    );
                                },
                            });
                        }}
                        categories={item.emoji
                            .map((a) => {
                                return {
                                    emoji: a.emoji,
                                    name: a.category,
                                };
                            })
                            .slice(0, 2)}
                    ></AppQuizCard>
                {/each}
            {/if}
        </div>
    </section>
</AppLayout>
<AlertDialog.Root open={deleteMutation.isPending}>
    <AlertDialog.Content
        class="bg-transparent border-none shadow-none items-center justify-center"
    >
        <Spinner class="size-12"></Spinner>
    </AlertDialog.Content>
</AlertDialog.Root>
