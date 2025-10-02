<script>
    import AppLayout from "$lib/components/main/app-layout.svelte";
    import { AppQuizCard } from "$lib/components/main/app-quiz-card";
    import Button from "$lib/components/ui/button/button.svelte";
    import Plus from "@lucide/svelte/icons/plus";
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
            <AppQuizCard
                id="quiz-1-r"
                title="Japanese Vocab for beginner"
                categories={[
                    {
                        emoji: "🍡",
                        name: "dango",
                    },
                    {
                        emoji: "🍡",
                        name: "dango",
                    },
                ]}
            ></AppQuizCard>
            <AppQuizCard
                id=""
                title="ISE midterm"
                categories={[
                    {
                        emoji: "🍡",
                        name: "dango",
                    },
                    {
                        emoji: "🍡",
                        name: "dango",
                    },
                ]}
            ></AppQuizCard>
        </div>
    </section>
</AppLayout>
