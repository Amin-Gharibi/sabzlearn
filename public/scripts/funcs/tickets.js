import {getToken} from "../utils/utils.js";

// get tickets of each user
const getTickets = async () => {
    const userToken = getToken()

    if (!userToken) {
        return false
    }

    const response = await fetch('http://localhost:4000/v1/tickets/user', {
        method: 'GET',
        headers: {
            'Authorization': `Bearers ${userToken}`
        }
    })
    return response.json()
}

const showRecentTicketsHandler = tickets => {
    const recentTicketsWrapper = document.querySelector('.recent-tickets--wrapper')
    if (!tickets.length) {
        recentTicketsWrapper.insertAdjacentHTML('beforeend', `
        <div class="max-h-96 overflow-y-auto space-y-3 -ml-2 pl-2">
            <div class="text-center bg-gray-100 dark:bg-darkGray-700 p-3 rounded-xl">تیکتی وجود ندارد.</div>
        </div>
        `)
    } else {
        tickets.forEach(ticket => {
            recentTicketsWrapper.insertAdjacentHTML('beforeend', `
                <div class="flex justify-between items-center flex-wrap gap-y-3 p-3 hover:bg-gray-100 dark:hover:bg-darkGray-700 rounded-xl transition-colors">
                    <a href="#" class="w-full sm:max-w-sm sm:truncate">
                        دوره تیلویند
                    </a>
                    <!--date and status-->
                    <div class="flex items-center gap-3 text-xs">
                        <!--date-->
                        <span class="text-slate-500 dark:text-slate-400">
                            1402/08/23
                        </span>
                        <!--status-->
                        <span class="py-1 px-1.5 bg-slate-500/10 dark:bg-yellow-400/10 text-slate-500 dark:text-yellow-400 rounded">
                            بسته شده
                        </span>
                    </div>
                </div>
            `)
        })
    }
}

export {getTickets, showRecentTicketsHandler}