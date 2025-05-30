<script lang="ts">
    export let data: {
        userIp: string | null
    };
    
</script>

<svelte:head>
    <title>Welcome to YongoNet!</title>
</svelte:head>

<br>
    <strong>Welcome to YongoNet!</strong>
{#if data.userIp}
    <p>Tu IP: {data.userIp}</p>
{:else}
    <p>No se pudo obtener tu IP.</p>
{/if}
