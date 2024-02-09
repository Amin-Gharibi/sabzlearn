import {getToken} from "../../../scripts/utils/utils.js";

const response = await fetch('http://localhost:4000/v1/tickets', {
	headers: {
		"Authorization": `Bearer ${getToken()}`
	}
})

const allTickets = await response.json()

const ticketsContainer = document.querySelector('tbody')
allTickets.forEach((ticket, index) => {
	const date = new Date(ticket.createdAt)
	ticketsContainer.insertAdjacentHTML('beforeend', `
	    <tr>
                <td class="${
		ticket.answer === 1 ? "answer-ticket" : "no-answer-ticket"
	}">${index + 1}</td>
                <td>${ticket.title}</td>
                <td>${ticket.user}</td>
                <td>${ticket.departmentID}</td>
                <td>${date.toLocaleTimeString('fa-IR') + ' ,' + date.toLocaleDateString('fa-IR')}</td>
                <td>
                    <button type='button' data-value="${ticket._id}" class='btn btn-primary view-btn'>مشاهده</button>
                </td>
                <td>
                    <button type='button' data-value="${ticket._id}" class='btn btn-primary answer-btn'>پاسخ</button>
                </td>
       </tr>
	`)
})


const viewBtns = document.querySelectorAll('.view-btn')
viewBtns.forEach(btn => {
	btn.addEventListener('click', async () => await showTicketBodyHandler(btn.getAttribute('data-value')))
})

const showTicketBodyHandler = async ticketId => {
	const targetTicket = allTickets.find(ticket => ticket._id === ticketId)
	let commentText = targetTicket.body
	if (targetTicket.answer) {
		const response = await fetch(`http://localhost:4000/v1/tickets/answer/${ticketId}`, {
			headers: {
				"Authorization": `Bearer ${getToken()}`
			}
		})
		const ticket = await response.json()
		commentText = `${targetTicket.body}<br><br><span class="text-success">پاسخ: ${ticket.answer}</span>`
	}
	Swal.fire({
		title: "تیکت",
		html: commentText,
		showConfirmButton: false,
		showCancelButton: true,
		cancelButtonText: "بستن"
	})
}


const answerBtns = document.querySelectorAll('.answer-btn')
answerBtns.forEach(btn => {
	btn.addEventListener('click', () => answerTicketHandler(btn.getAttribute('data-value')))
})

const answerTicketHandler = ticketId => {
	Swal.fire({
		input: "textarea",
		inputLabel: "پاسخ",
		inputPlaceholder: "پاسخ را بنویسید",
		confirmButtonText: "ثبت",
		allowOutsideClick: true,
		inputValidator: (value) => {
			if (!value) {
				return 'پاسخ نمی‌تواند خالی باشد!';
			}
		}
	}).then(result => {
		if (result.isConfirmed) {
			fetch(`http://localhost:4000/v1/tickets/answer`, {
				method: 'POST',
				headers: {
					"Authorization": `Bearer ${getToken()}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					body: result.value.trim(),
					ticketID: ticketId
				})
			}).then(res => {
				console.log(res)
				if (res.status === 200) {
					Swal.fire({
						title: "موفق",
						text: "پاسخ با موفقیت ثبت شد",
						icon: "success",
						confirmButtonText: "بستن"
					}).then(() => {
						location.reload()
					})
				} else {
					Swal.fire({
						title: "ناموفق",
						text: "خطا در ثبت پاسخ برای این کامنت، لطفا بعدا تلاش کنید یا با پشتیبانی تماس بگیرید",
						icon: "error",
						confirmButtonText: "بستن"
					}).then(() => {
						location.reload()
					})
				}
			})
		}
	})
}