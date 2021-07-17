<script>
    export let receiptId;

    import { onMount } from 'svelte';
    import receiptNoteService from '../../../services/receiptNote.service';
</script>

<div>
    <form class="flex flex-col">
        <div class="my-2">
            <label class="underline text-lg">
                Status:
            </label>
            <select class="outline-none border border-gray-300 rounded bg-gray-50">
                <option>✅ COMPLETED</option>
                <option>&#10060; UNCOMPLETED</option>
            </select>
        </div>
        <textarea class="text-sm border border-gray-300 p-2 resize-none border rounded-md overflow-hidden" rows="5" cols="24">

        </textarea>
        <button type="submit" class="ml-auto align-middle justify-end w-24 my-2 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
            Save
        </button>
    </form>
</div>