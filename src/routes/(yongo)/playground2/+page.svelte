<script lang="ts">
    import { enhance } from "$app/forms";
    import { fade } from "svelte/transition";
    import type { SubmitFunction } from '@sveltejs/kit';

    let selectedFile: File | null = null;
    let isUploading = false;
    let uploadResult: {
        success: boolean;
        filename?: string;
        url?: string;
        error?: string;
    } | null = null;

    const handleSubmit: SubmitFunction = ({ formElement, formData }) => {
        isUploading = true;
        uploadResult = null;
        
        return async ({ update }) => {
            try {
                const response = await fetch(formElement.action, {
                    method: formElement.method,
                    body: formData
                });
                
                const result = await response.json();
                uploadResult = result;
                update();
            } catch (error) {
                uploadResult = {
                    success: false,
                    error: 'Network error occurred'
                };
            } finally {
                isUploading = false;
            }
        };
    };

    function downloadFile(url: string, filename?: string) {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename || url.split('/').pop() || 'download';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function handleFileChange(event: Event) {
        const target = event.target as HTMLInputElement;
        if (!target?.files) return;
        selectedFile = target.files[0];
    }
</script>

<div class="upload-container">
    <h2>File Upload</h2>
    
    <form
        method="POST"
		action="/api/upload"
        enctype="multipart/form-data"
        use:enhance={handleSubmit}
    >
        <!-- Rest of your form content remains exactly the same -->
        <div class="file-input-area">
            <label for="file-upload" class:active={selectedFile !== null}>
                {#if selectedFile}
                    <span class="file-name">{selectedFile.name}</span>
                    <span class="file-size">
                        ({(selectedFile.size / 1024).toFixed(2)} KB)
                    </span>
                {:else}
                    <span class="prompt">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                        Click to select or drag a file
                    </span>
                {/if}
            </label>
    		<input
        			id="file-upload"
        			name="file"
        			type="file"
        			on:change={handleFileChange}
    		/>
        </div>

        <button
            type="submit"
            disabled={!selectedFile || isUploading}
            class:loading={isUploading}
        >
            {#if isUploading}
                <span class="spinner"></span>
                Uploading...
            {:else}
                Upload File
            {/if}
        </button>
    </form>
	
	{#if uploadResult}
    <div transition:fade class="result-message {uploadResult.success ? 'success' : 'error'}">
        {#if uploadResult.success && uploadResult.url}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>
                File uploaded successfully!<br />
                <div class="file-actions">
                    <a 
                        href={uploadResult.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="view-btn"
                    >
                        View
                    </a>
                    <button 
                        on:click={() => uploadResult && uploadResult.url && downloadFile(uploadResult.url, uploadResult.filename)}
                        class="download-btn"
                    >
                        Download
                    </button>
                </div>
            </span>
        {:else}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>
                {uploadResult.error || 'Upload failed. Please try again.'}
            </span>
        {/if}
    </div>
{/if}
</div> 

<style>
    .file-actions {
        display: flex;
        gap: 0.5rem;
        margin-top: 0.5rem;
    }

    .view-btn {
        padding: 0.25rem 0.5rem;
        background: #4299e1;
        color: white;
        border-radius: 4px;
        text-decoration: none;
        font-size: 0.875rem;
    }

    .download-btn {
        padding: 0.25rem 0.5rem;
        background: #38a169;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.875rem;
    }
	
    .upload-container {
        max-width: 500px;
        margin: 2rem auto;
        padding: 2rem;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    h2 {
        margin: 0 0 1.5rem;
        color: #1a365d;
        font-weight: 600;
    }

    .file-input-area {
        margin-bottom: 1.5rem;
    }

    label {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        border: 2px dashed #cbd5e0;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    label:hover, label.active {
        border-color: #4299e1;
        background-color: #ebf8ff;
    }

    .prompt {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        color: #4a5568;
    }

    .file-name {
        font-weight: 500;
        color: #2d3748;
    }

    .file-size {
        font-size: 0.875rem;
        color: #718096;
    }

    input[type="file"] {
        display: none;
    }

    button {
        width: 100%;
        padding: 0.75rem;
        background: #4299e1;
        color: white;
        border: none;
        border-radius: 6px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.2s ease;
    }

    button:hover:not(:disabled) {
        background: #3182ce;
    }

    button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    button.loading {
        position: relative;
        pointer-events: none;
    }

    .spinner {
        display: inline-block;
        width: 1rem;
        height: 1rem;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 1s ease-in-out infinite;
        margin-right: 0.5rem;
    }

    .result-message {
        margin-top: 1.5rem;
        padding: 1rem;
        border-radius: 6px;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .success {
        background: #f0fff4;
        color: #2f855a;
        border: 1px solid #c6f6d5;
    }

    .error {
        background: #fff5f5;
        color: #c53030;
        border: 1px solid #fed7d7;
    }

    a {
        color: #2b6cb0;
        text-decoration: underline;
        margin-top: 0.5rem;
        display: inline-block;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }
</style>
<svelte:head>
    <title>The Playground TWO BABY!</title>
</svelte:head>