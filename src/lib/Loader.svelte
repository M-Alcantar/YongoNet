<script>

</script>

<div class="absolute top-0 w-full h-full z-[1000]" style="background-color: rgba(0,0,0,0.3)">
    <span class="circle" style="--size: 65px; --color: white; --duration: 1.2s"></span>
</div>

<style>
    .circle {
        height: var(--size);
        width: var(--size);
        position: fixed;
        top: 0;
        left: 0;
        inset: calc(50% - calc(var(--size) / 2));
        border-color: var(--color) transparent var(--color) var(--color);
        border-width: calc(var(--size) / 15);
        border-style: solid;
        border-image: initial;
        border-radius: 50%;
        animation: var(--duration) linear 0s infinite normal none running rotate;
    }

    @keyframes rotate {
        0% {
            transform: rotate(0);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>