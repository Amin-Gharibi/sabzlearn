import {intlDateToPersianDate} from "../utils/utils.js";

const showRecentTicketsHandler = tickets => {
    const recentTicketsWrapper = document.querySelectorAll('.recent-tickets--wrapper')
    if (!tickets.length) {
        recentTicketsWrapper.forEach(wrapper => {
            wrapper.insertAdjacentHTML('beforeend', `
                <div class="max-h-96 overflow-y-auto space-y-3 -ml-2 pl-2">
                    <div class="text-center bg-gray-100 dark:bg-darkGray-700 p-3 rounded-xl">تیکتی وجود ندارد.</div>
                </div>
        `)
        })
    } else {
        tickets.forEach(ticket => {
            const date = intlDateToPersianDate(ticket.updatedAt)
            const localDate = new Date(ticket.updatedAt)
            recentTicketsWrapper.forEach(wrapper => {
                if (wrapper.classList.contains('dashboard-recent-tickets-wrapper')) {
                    wrapper.insertAdjacentHTML('beforeend', `
                        <div class="flex items-center justify-between flex-wrap gap-y-3 p-3 hover:bg-gray-100 dark:hover:bg-darkGray-700 rounded-xl transition-colors">
                            <a href="dashboard.html?sec=my-tickets&add-ticket=false&ticket=${ticket._id}" class="text-zinc-700 dark:text-white w-full sm:max-w-sm sm:truncate">
                                ${ticket.title}
                            </a>
                            <div class="flex items-center gap-3">
                                <span class="text-xs text-slate-500 dark:text-slate-400">
                                    ${date}
                                </span>
                                <!--status-->
                                <span class="text-xs py-1 px-1.5 text-slate-500 dark:text-yellow-400 bg-slate-500/10 dark:bg-yellow-400/10 rounded">
                                    ${ticket.answer ? 'بسته شده' : 'باز است'}
                                </span>
                            </div>
                        </div>
                    `)
                } else {
                    wrapper.insertAdjacentHTML('beforeend', `
                <div class="flex justify-between items-center flex-wrap gap-y-3 p-3 hover:bg-gray-100 dark:hover:bg-darkGray-700 rounded-xl transition-colors">
                    <a href="dashboard.html?sec=my-tickets&add-ticket=false&ticket=${ticket._id}" class="w-full sm:max-w-max sm:truncate">
                        ${ticket.title}
                    </a>
                    <!--date and status-->
                    <div class="flex items-center gap-3 text-xs">
                        <!--date-->
                        <span class="text-slate-500 dark:text-slate-400">
                            (${localDate.toString().split(' ')[4].slice(0, 5)}) ${date}
                        </span>
                        <!--department-->
                        <span class="py-1 px-1.5 bg-slate-500/10 dark:bg-yellow-400/10 text-slate-500 dark:text-yellow-400 rounded">
                            ${ticket.departmentID}
                        </span>
                        <!--status-->
                        <span class="py-1 px-1.5 bg-slate-500/10 dark:bg-yellow-400/10 text-slate-500 dark:text-yellow-400 rounded">
                            ${ticket.answer ? 'بسته شده' : 'باز است'}
                        </span>
                    </div>
                </div>
            `)
                }
            })
        })
    }
}

export {showRecentTicketsHandler}