import {getToken} from "../../../scripts/utils/utils.js";

const response = await fetch('http://localhost:4000/v1/infos/p-admin', {
    headers: {
        "Authorization": `Bearer ${getToken()}`
    }
})

const infos = await response.json()

const infoBoxesContainer = document.querySelector('.info-boxes-container')
infos.infos.forEach(box => {
    infoBoxesContainer.insertAdjacentHTML('beforeend',`
        <div class="col-4">
            <div class="home-content-revanue box">
                <div class="home-box">
                    <div class="home-box-left">
                        <div class="home-box-title">
                            <span>${box.title}</span>
                        </div>
                        <div class="home-box-value">
                            <div class="home-box-price">
                                <span>${box.count}</span>
                            </div>
                        </div>
                        <div class="home-box-text">
                            <span>تعداد ${box.title} بصورت کلی</span>
                        </div>
                    </div>
                    <div class="home-box-right">
                        <div class="home-box-icon">
                            <i class="fas fa-solid fa-question"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `)
})


const usersInformationContainer = document.querySelector('tbody')
infos.lastUsers.forEach(user => {
    const date = new Date(user.createdAt);
    usersInformationContainer.insertAdjacentHTML('beforeend', `
    <tr>
        <td>${user._id}</td>
        <td>${user.username}</td>
        <td>${user.name}</td>
        <td>${user.phone}</td>
        <td>${user.email}</td>
        <td>${date.toLocaleTimeString('fa-IR') + ' ,' + date.toLocaleDateString('fa-IR')}</td>
    </tr>
`)
})