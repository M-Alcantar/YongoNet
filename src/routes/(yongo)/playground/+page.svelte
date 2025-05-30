<script lang="ts">
    import { onMount, tick } from 'svelte';

    let content = '';
    let showDino = false;
    var button: HTMLElement | null;
    var img: HTMLElement | null;

    async function loadContent() {
        const res = await fetch(`/api/web-content`, {
            method: 'GET',
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
        content = await res.text();

        await tick();
        addButtonEvent();
    }
    onMount(loadContent);

    function toggleDino() {
        if (button && img) {
            showDino = !showDino
            if (showDino) {
                button.innerText = "Why is it spinning";
                button.style.backgroundColor = "#fb2c36";
                img.hidden = false;
            } else {
                button.innerText = "Ok I wanna see a cool dinosaur";
                button.style.backgroundColor = "#00c951";
                img.hidden = true;
            }
        }
    }

    function addButtonEvent() {
        button = document.getElementById("pg-button")
        img = document.getElementById("pg-img")
        button?.addEventListener('click', toggleDino);
    }
</script>

<div class="w-[100vw] min-h-[90vh]">
    {@html content}
</div>