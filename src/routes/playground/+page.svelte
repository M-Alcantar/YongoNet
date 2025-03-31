<script>
    import dinoImg from '$lib/assets/dinosaur.jpg';

    let showDino = false;
</script>

<svelte:head>
    <title>The Playground</title>
</svelte:head>

<header>The Playground</header>

<button
    style="width:20%;color:white;"
    class="absolute top-36 left-36 rounded-lg py-2"
    class:bg-red-500={showDino}
    class:bg-green-500={!showDino}
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
    class="absolute top-24 right-70" 
    hidden={!showDino} />