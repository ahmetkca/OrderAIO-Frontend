<script>
    import {createEventDispatcher} from "svelte";
    const dispatch = createEventDispatcher();
    export let isOpen = false;

    function toggleModal() {
        isOpen = !isOpen;
    }

    function clickedSave() {
        dispatch("saveChanges")
    }
</script>


<div class:hidden={!isOpen} class="font-mono overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center" id="modal-id">
    <div class="relative w-auto my-6 mx-auto max-w-3xl">
        <!--content-->
        <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            <!--header-->
            <div class="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                <h3 class="text-3xl font-semibold">
                    Filter
                </h3>
                <button class="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none" onclick="toggleModal('modal-id')">
          <span class="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
            ×
          </span>
                </button>
            </div>
            <!--body-->
            <div class="relative p-6 flex-auto">
                <slot name="body">

                </slot>
            </div>
            <!--footer-->
            <div class="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                <button on:click={toggleModal} class="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" >
                    Close
                </button>
                <button on:click={() => {toggleModal(); clickedSave();}} class="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150" type="button" >
                    Save Changes
                </button>
            </div>
        </div>
    </div>
</div>
<div class:hidden={!isOpen} class=" opacity-25 fixed inset-0 z-40 bg-black" id="modal-id-backdrop"></div>

<style>
    .bg-emerald-500 {
        background-color: #10b981;
    }
</style>