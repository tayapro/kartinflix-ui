async function register() {
    localStorage.clear()
    document.getElementById('ItemPreview').src = ''
    document.getElementById('div_picture').style.display = 'none'

    let login = document.getElementById('login').value
    let password = document.getElementById('pwd').value

    let url = 'http://localhost:3001/api/register'
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: login,
            password: password,
        }),
    })

    document.getElementById('username').innerHTML = result.username
    //Hide buttons *login* & *register*, and fields for login/register credentials
    document.getElementById('div_login_register').style.display = 'none'
    document.getElementById('div_username_logout').style.display = 'initial'
}

async function login() {
    localStorage.clear()
    document.getElementById('ItemPreview').src = ''
    document.getElementById('div_picture').style.display = 'none'

    let login = document.getElementById('login').value
    let password = document.getElementById('pwd').value

    let url = 'http://localhost:3001/api/login'
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: login,
            password: password,
        }),
    })

    const result = await res.json()
    localStorage.setItem('username', result.username)
    localStorage.setItem('accessToken', result.accessToken)
    localStorage.setItem('refreshToken', result.refreshToken)

    document.getElementById('username').innerHTML = result.username
    //Hide buttons *login* & *register*, and fields for login/register credentials
    document.getElementById('div_login_register').style.display = 'none'
    document.getElementById('div_username_logout').style.display = 'initial'

    getPicturesList()
}

async function logout() {
    localStorage.clear()
    document.getElementById('login').value = ''
    document.getElementById('pwd').value = ''
    document.getElementById('div_login_register').style.display = 'initial'
    document.getElementById('div_username_logout').style.display = 'none'
    document.getElementById('div_picture').style.display = 'none'
    document.getElementById('list_pictures').innerHTML = ''
    document.getElementById('ItemPreview').src = ''
}

async function getPicturesList() {
    //cleanup div with links
    document.getElementById('list_pictures').innerHTML = ''

    // URL надо пробрасывать через переменные окружения
    let url = 'http://localhost:3002/pictures/'

    const token = localStorage.getItem('accessToken')

    let headers = {
        Authorization: `Bearer ${token}`,
    }

    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: headers,
        })
        console.log('RES ', res)
        if (res.status != 200) {
            throw Error(`HTTP error ${res.status}`)
        }
        const pictures = await res.json()
        console.log(pictures)
        //process list items div list_pictures
        var ul = document.getElementById('list_pictures')
        for (let i = 0; i < pictures.length; i++) {
            console.log(`Picture ${i} = ${pictures[i]}`)
            var a = document.createElement('a')
            var linkText = document.createTextNode(pictures[i].toString())
            a.appendChild(linkText)
            a.href = '#'
            a.id = pictures[i].toString()
            a.addEventListener('click', loadPicture)

            var li = document.createElement('li')
            li.appendChild(a)
            ul.appendChild(li)
        }
    } catch (e) {
        console.log('ERROR:: ', e)
        return
    }
}

async function loadPicture() {
    console.log('stipaxa', this.id)

    document.getElementById('div_picture').style.display = 'initial'

    document.getElementById('ItemPreview').src = ''

    document.getElementById('ItemPreview').style.width = '300px'
    document.getElementById('ItemPreview').style.height = '300px'

    // URL надо пробрасывать через переменные окружения
    let url = `http://localhost:3002/picture/${this.id}`

    const token = localStorage.getItem('accessToken')

    let headers = {
        Authorization: `Bearer ${token}`,
    }

    let picture_blob = ''
    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: headers,
        })
        if (res.status != 200) {
            throw Error(`HTTP error ${res.status}`)
        }
        picture_blob = await res.blob()
        document.getElementById(
            'GetPictureResult'
        ).innerHTML = `Picture ID is ${this.id}`
    } catch (e) {
        console.log('ERROR:: ', e)
        document.getElementById('GetPictureResult').innerHTML =
            'its not your picture'
        document.getElementById('ItemPreview').style.display = 'none'
        return
    }
    const reader = new FileReader()
    reader.readAsDataURL(picture_blob)
    reader.onloadend = function () {
        const base64string = reader.result
        // console.log('base64 string >>>>>>>>>', base64string)
        const picture = base64string.split(',')[1]
        // console.log('picture>>>>>>>>>>', picture)
        document.getElementById('ItemPreview').src =
            'data:image/png;base64,' + picture
    }
}
