<script lang="ts">
    import type { ActionData } from './$types.ts';
    export let form: ActionData;
    let showPassword = false;
    $: password = showPassword ? 'text' : 'password';
</script>

<div class="flex min-h-screen items-center justify-center bg-transparent px-4 py-12 sm:px-6 lg:px-8">
    <div class="w-full max-w-md space-y-5">
        <div>
            <h2 class="mt-6 text-center text-3xl font-bold text-white">
                Join YongoNet
            </h2>
        </div>
        <form action="?/register" method="POST" class="space-y-4">
            <div class="space-y-2 rounded-md inset-shadow-sm py-6 bg-[#091d38]">
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

            {#if form?.user}
                <p class="error">Username is taken.</p>
            {/if}

            <div>
                <button
                    type="submit"
                    class="group relative flex w-3/4 justify-center rounded-md mx-auto my-4 bg-[#0087e8] px-4 py-2 text-base font-semibold text-white hover:bg-[#046bbf] focus:ring-offset-0 focus:ring-transparent"
                >
                    Sign Up
                </button>
            </div>
        </form>
    </div>
</div>