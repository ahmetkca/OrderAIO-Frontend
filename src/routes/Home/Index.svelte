<script>
    import {toasts} from "../../stores/toast.store";
    import Success from "../../components/Success.svelte";
    import Danger from '../../components/Danger.svelte';
    import Warning from '../../components/Warning.svelte';
    import { onMount } from 'svelte';
    import csvFileUploadService from '../../services/csvFileUpload.service';
    let files;
    let fileUpload
    onMount(async () => {
    })

    const regex = new RegExp("(.*?)\.(csv)$");

    function triggerValidation(el) {
        if (!(regex.test(fileUpload.value.toLowerCase()))) {
            fileUpload.value = '';
            // alert('');
            toasts.push(Danger, 4000, {message: "Please select correct file format.\nOnly csv files."});
        }
    }

    const handleSubmit = async () => {
        console.log(files)
        if (!(files && files[0])) {
            return
        }
        const formData = new FormData()
        // formData.append('damName', files[0].name)
        formData.append('file', files[0])
        await csvFileUploadService.uploadStallionCsvFile(formData)
            .then(res => {
                console.log(res)
                if (res?.status === 200 && res?.statusText === "OK") {
                    toasts.push(Success, 4500, {message: "Csv file successfully uploaded.\nProcessing time might take a while depends on the size of the file."});
                } else {
                    toasts.push(Danger, 3500, {message: "Something went wrong while uploading the file.\nTry again later."});
                }
            })
    }
</script>

<div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
<!--    <div class="flex w-full h-screen items-center justify-center bg-grey-lighter">-->
<!--        -->
<!--    </div>-->

    <form on:submit|preventDefault={handleSubmit}>
        <div class="flex flex-col items-center space-y-2">
            <p class="text-xl">Upload Stallion CSV file here</p>
            <label class="transition-colors w-64 flex flex-col items-center px-4 py-6 bg-white text-blue-500 rounded-lg shadow-md tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-500 hover:text-white">
                <svg class="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                </svg>
                <span class="mt-2 text-base leading-normal">Select a file</span>
                <input type='file' accept=".csv" class="hidden" bind:this={fileUpload} bind:files on:change={triggerValidation} />
            </label>
    <!--        <button type="submit">Upload</button>-->
            {#if files && files[0]}
                <p class="my-1 mt-2 italic text-sm">
                    Selected file: {files[0].name}
                </p>
            {/if}
    <!--        <div class="overflow-hidden relative w-64 mt-4 mb-4">-->
                <button type="submit" class="focus:outline-none transition-colors mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 w-full inline-flex items-center rounded-lg">
                    <svg fill="#FFF" height="18" viewBox="0 0 24 24" width="18" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0h24v24H0z" fill="none"/>
                        <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
                    </svg>
                    <span class="ml-2">Upload Document</span>
                </button>
    <!--            <input-->
    <!--                    class="cursor-pointer absolute block py-2 px-4 w-full opacity-0 pin-r pin-t"-->
    <!--                    type="file"-->
    <!--                    name="documents[]"-->
    <!--                    accept="image/*"-->
    <!--            >-->
    <!--        </div>-->
        </div>
    </form>


</div>
