<script>
    export let receiptId;

    import { onMount } from 'svelte';
    import receiptNoteService from '../../../services/receiptNote.service';
</script>

<div>
    <form class="flex flex-col">
        <label>
            Status:
            <select>
                <option>COMPLETED</option>
                <option>UNCOMPLETED</option>
            </select>
        </label>
        <textarea class="resize-none border rounded-md overflow-hidden">

        </textarea>
        <button type="submit">Save</button>
    </form>
</div>