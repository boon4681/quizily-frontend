<script>
    import BoldButton from "$lib/components/main/bold-button.svelte";
    import LandingBg from "$lib/components/main/landing-bg.svelte";
    import Logo from "$lib/components/main/logo.svelte";
    import Button from "$lib/components/ui/button/button.svelte";
</script>

<main class="mx-auto max-w-5xl">
    <div class="flex justify-between pt-10 pb-3 px-4">
        <div class="w-[115px]"><Logo></Logo></div>
        <Button variant="outline" href="/sign-in">Sign in</Button>
    </div>
    <div class="text-center flex flex-col items-center mt-20 px-4 relative">
        <div class="w-full text-7xl font-semibold">Ace Your Exams with AI-Powered Practice Tests</div>
        <div class="max-w-3xl mt-6 text-neutral-400">
            Upload your lecture notes, textbooks, or any PDF file and let our AI create a variety of practices
            questions. Identify your weak points, save valuable time, and walk into your exams with confident
        </div>
        <div class="absolute pointer-events-none -mt-12 w-[1200px]">
            <LandingBg></LandingBg>
        </div>
    </div>
    <div class="flex justify-center gap-6 mt-12">
        <BoldButton href="/sign-up">Get Started</BoldButton>
        <BoldButton variant="dark" href="/sign-in">Sign in</BoldButton>
    </div>
</main>
