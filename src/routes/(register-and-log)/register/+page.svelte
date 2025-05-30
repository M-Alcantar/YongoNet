<script lang="ts">
    import Loader from '$lib/Loader.svelte';
    import type { ActionData } from './$types.js';
    export let form: ActionData;

    let showPassword = false;
    $: password = showPassword ? 'text' : 'password';

    let loading = false;
</script>

<svelte:head>
    <title>Join YongoNet</title>
</svelte:head>

{#if loading}
    <Loader></Loader>
{/if}

<div class="flex min-h-screen items-center justify-center bg-transparent px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-3">
        <div>
            <h2 class="mt-4 text-center text-[35px] font-bold text-white">
                Join YongoNet
            </h2>
        </div>
        <form 
            action="?/register" method="POST" class="space-y-4"
            on:submit={ () => {loading = !loading} }
        >
            <div class="space-y-2 rounded-md inset-shadow-xs/40 py-6 bg-[#091d38]">
                <div>
                    <label for="usermail" class="sr-only">Mail account (optional)</label>
                    <input class="flex w-7/8 mx-auto rounded-lg outline-none border-none bg-gray-900 text-white"
                        id="usermail"
                        name="usermail"
                        type="text"
                        placeholder="Mail account"
                    />
                </div>

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
                {#if form?.userExists}
                    <div class="flex w-7/8 mx-auto">
                        <p class="error -mt-1 text-sm text-red-500">Username is taken.</p>
                    </div>
                {/if}
                {#if form?.nameEmpty}
                    <div class="flex w-7/8 mx-auto">
                        <p class="error -mt-1 text-sm text-red-500">Username cannot be empty.</p>
                    </div>
                {/if}
                {#if form?.nameLen}
                    <div class="flex w-7/8 mx-auto">
                        <p class="error -mt-1 text-sm text-red-500">Username cannot exceed 64 characters.</p>
                    </div>
                {/if}

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
                {#if form?.passLen}
                    <div class="flex w-7/8 mx-auto">
                        <p class="error -mt-1 text-sm text-red-500">Password must be between 8 and 50 characters long.</p>
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
                    Sign Up
                </button>
                <div class="text-xs text-right text-[#0087e8]">
                    <p>Already have an account? <br> 
                    <a href='/login' class="underline underline-offset-2">Log in.</a></p>
                </div>
            </div>
        </form>
    </div>
</div>