<script lang="ts">
    import Loader from '$lib/Loader.svelte';
    import type { ActionData } from './$types.js';
    export let form: ActionData;

    let showPassword = false;
    $: password = showPassword ? 'text' : 'password';

    let loading = false;
</script>

<svelte:head>
    <title>YongoNet Login</title>
</svelte:head>

{#if loading}
    <Loader></Loader>
{/if}

<div class="flex min-h-screen items-center justify-center bg-transparent px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-3">
        <div>
            <h2 class="mt-4 text-center text-[35px] font-bold text-white">
                YongoNet Login
            </h2>
        </div>
        <form 
            action="?/login" method="POST" class="space-y-4"
            on:submit={ () => {loading = !loading} }
        >
            <div class="space-y-2 rounded-md inset-shadow-xs/40 py-6 bg-[#091d38]">
                <div>
                    <label for="username" class="sr-only">Username</label>
                    <input class="flex w-7/8 mx-auto rounded-lg outline-none border-none bg-gray-900 text-white"
                        id="username"
                        name="username"
                        type="text"
                        required
                        placeholder="Username"
                    />
                </div>

                <div>
                    <label for="password" class="sr-only">Password</label>
                    <input class="flex w-7/8 mx-auto rounded-lg outline-none border-none bg-gray-900 text-white"
                        id="password"
                        name="password"
                        type={password}
                        required
                        placeholder="Password"
                    />
                </div>
                {#if form?.emptyFields}
                    <div class="flex w-7/8 mx-auto">
                        <p class="error -mt-1 text-sm text-red-500">Please fill out both fields.</p>
                    </div>
                {/if}
                {#if form?.wrongFields}
                    <div class="flex w-7/8 mx-auto">
                        <p class="error -mt-1 text-sm text-red-500">Incorrect username or password. Try again.</p>
                    </div>
                {/if}

                <div class="flex w-7/8 mx-auto items-center pt-0.5">
                    <input
                        type="checkbox"
                        bind:checked={showPassword}
                        id="showPassword"
                        class="form-checkbox ml-1.5 h-4.5 w-4.5 text-[#0087e8] border-none focus:ring-transparent focus:ring-offset-0 bg-gray-50 rounded-xs"
                    />
                    <label for="showPassword" class="ml-2 text-sm text-white hover:cursor-pointer">
                        Show Password
                    </label>
                </div>
            </div>

            <div class="flex items-center space-x-4">
                <button
                    type="submit"
                    class="flex-auto justify-center rounded-md my-4 bg-[#0087e8] px-4 py-2 text-base font-semibold text-white shadow-sm hover:bg-[#046bbf] hover:cursor-pointer focus:ring-offset-0 focus:ring-transparent"
                >
                    Log in
                </button>
                <div class="text-xs text-right text-[#0087e8]">
                    <p>Don't have an account yet? <br> 
                    <a href='/register' class="underline underline-offset-2">Sign up.</a></p>
                </div>
            </div>
        </form>
    </div>
</div>