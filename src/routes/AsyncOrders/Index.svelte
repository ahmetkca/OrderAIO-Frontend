<script>
    import ResultList from './components/ResultList.svelte';
    import searchService from '../../services/search.service';
    import {orders} from "../../stores/orders.store";
    import {onMount} from 'svelte';
    import * as dayjs from "dayjs";
    import SelectedReceipt from "./components/SelectedReceipt.svelte";
    import DatePicker from "@beyonk/svelte-datepicker/src/components/DatePicker.svelte";
    import {etsyConnections} from "../../stores/etsyConnection.store";
    import {CalendarStyle} from '../../lib/calendar-style.js';
    import Modal from "./components/Modal.svelte";
    import {filter} from "../../stores/filter.store";
    import { Circle } from 'svelte-loading-spinners';
    import SelectedReceiptSkeleton from './components/SelectedReceiptSkeleton.svelte';

    let searchData = "";
    let isSearching = false;
    let receipt = {};
    let isModalOpen =  false;

    let filterStatus = $filter?.is_completed;
    let filterShop = $filter?.shop_name;
    let filterFromDate = $filter?.from_date;
    let filterToDate = $filter?.to_date;

    onMount(async () => {
        await search($filter)
    })

    $: console.log($filter);

    const handleSelectedReceipt = (event) => {
        receipt = event.detail.receipt;
    }

    const handleOpenModal = () => {
        isModalOpen = !isModalOpen;
    }

    const search = async (filter) => {
        isSearching = true;
        await searchService.search({
            ...filter,
            projection: [
                "max_due_date",
                "receipt_id",
                "name",
                "shop_name",
                "grandtotal",
                "currency_code",
                "is_gift",
                "gift_message",
                "message_from_buyer",
                "formatted_address",
                "buyer_email",
                "Transactions.transaction_id",
                "Transactions.MainImage.url_fullxfull",
                "Transactions.title",
                "Transactions.variations",
                "Transactions.quantity",
                "Transactions.MainImage.url_170x135",
            ]
        })
            .then(res => {
                orders.set(res.data);
            })
            .catch(err => {
                console.error(err);
            });
        isSearching = false;
    }

    const handleSaveChanges = async () => {
        console.log("Save Changes");
        filter.update(f => {return {...f, "shop_name": filterShop}});
        filter.update(f => {return {...f, "is_completed": filterStatus}});
        filter.update(f => {return {...f, "from_date": filterFromDate}});
        filter.update(f => {return {...f, "to_date": filterToDate}});
        searchData = "";
        await search($filter);
    }

    const handleNotInCurrentData = async (event) => {
        await search({query: event.detail.query});
    }

</script>

{#if isSearching}
    <div class="w-full h-full fixed block top-0 left-0 bg-white opacity-75 z-50">
      <span class="text-green-500 opacity-75 top-1/2 my-0 mx-auto block relative w-0 h-0" style="
        top: 50%;
    ">
<!--        <i class="fas fa-circle-notch fa-spin fa-5x" style="color: dodgerblue;"></i>-->
          <Circle size="60" color="#FF3E00" unit="px" duration="1s"/>
      </span>
    </div>
{/if}

<Modal bind:isOpen={isModalOpen} on:saveChanges={handleSaveChanges}>
    <div slot="body">
        <form on:submit|preventDefault>
            <div class="my-2">
                Due date:

                <DatePicker
                        selected={[dayjs($filter?.from_date).add(-dayjs($filter?.from_date).utcOffset(), "m"), dayjs($filter?.to_date).add(-dayjs($filter?.to_date).utcOffset(), "m")]}
                        range={true}
                        on:range-selected={(e) => {
                                let fromD=new Date(e.detail.from);
                                fromD.setHours(0, -fromD.getTimezoneOffset(), 0, 0)
                                let toD=new Date(e.detail.to);
                                toD.setHours(0, -toD.getTimezoneOffset(), 0, 0)
                                filterFromDate = dayjs(fromD).toISOString();
                                filterToDate = dayjs(toD).toISOString();
                                console.trace({from: filterFromDate, to: filterToDate});
                            }}
                        styling={new CalendarStyle()}>
                </DatePicker>
            </div>
            <div class="my-2">
                <label class="">
                    Shop
                </label>
                <div class="inline-block relative w-64">
                    <select bind:value={filterShop} class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                        <option class="py-1" value={undefined}>All</option>
                        {#each Object.keys($etsyConnections) as etsyConnection ($etsyConnections[etsyConnection]?._id)}
                            <option class="py-1" value={$etsyConnections[etsyConnection]?.etsy_shop_name}>
                                {$etsyConnections[etsyConnection]?.etsy_shop_name}
                            </option>
                        {/each}
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
            </div>
            <div class="my-2">
                <label class="">
                    Status:
                </label>
                <div class="inline-block relative w-64">
                    <select bind:value={filterStatus} class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline" >
                        <option class="py-1" value={undefined}>All</option>
                        <option class="py-1" value={true}>Completed</option>
                        <option class="py-1" value={false}>Uncompleted</option>
                    </select>
                    <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
            </div>
        </form>
    </div>
</Modal>
<div class="container mx-auto p-5">
    <div class="flex flex-col ">
        <div class="flex flex-row ">
<!--            <div class="p-2 overflow-y-auto">-->
            <ResultList
                    bind:searchData={searchData}
                    data={$orders}
                    on:selectedReceipt={handleSelectedReceipt}
                    on:openModal={handleOpenModal}
                    on:notInCurrentData={handleNotInCurrentData}/>
<!--            </div>-->
            <div class="p-2 w-3/4 ml-1">
                {#if isSearching}
                    <SelectedReceiptSkeleton />
                {:else}
                    <SelectedReceipt {receipt}/>
                {/if}
            </div>
        </div>
    </div>
</div>
