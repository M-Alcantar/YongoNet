<script>
    import dinoImg from '$lib/assets/dinosaur.jpg';

    let showDino = false;
</script>

<svelte:head>
    <title>I just wanna make a button</title>
</svelte:head>

<!-- svelte-ignore a11y_consider_explicit_label -->
<button
    style="width:20%;"
    class="absolute top-36 left-36 rounded-lg py-2"
    class:bg-red-300={showDino}
    class:bg-green-300={!showDino}
    on:click=
        {
            () => {showDino = !showDino}
        }
>
    {#if showDino}
        Nvm I'm scared
    {:else}
        Ok I wanna see a cool dinosaur
    {/if}
</button>

<img src={dinoImg} alt="RAAAAAAARRRRRRRRRRRR" 
    style="height:500px;" 
    class="absolute top-12 right-50" 
    hidden={!showDino} />