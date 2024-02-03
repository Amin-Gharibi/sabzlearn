import {getLatestSignedUpUsers} from "../../utils.js";

const users = (await getLatestSignedUpUsers()).slice(0, 10);
const usersInformationContainer = document.querySelector('tbody')

users.forEach(user => {
    const date = new Date(user.createdAt);
    usersInformationContainer.insertAdjacentHTML('beforeend', `
    <tr>
        <td>${user._id}</td>
        <td>${user.username}</td>
        <td>${user.name}</td>
        <td>${user.phone}</td>
        <td>${user.email}</td>
        <td>${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')} ${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}</td>
    </tr>
`)
})