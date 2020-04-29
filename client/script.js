let baseUrl = 'http://localhost:3000'
$( document ).ready(function() {
    auth()
    $('#login-form').submit(function(event) {
        event.preventDefault()
        $.ajax({
            method: 'post',
            url: baseUrl + '/users/login',
            data: {
                email: $('#email').val(),
                password: $('#password').val()
            }
        })
            .done(data => {
                localStorage.setItem('token', data.token)
                auth()
            })
            .fail(err => {
                console.log(err.responseJSON.message,'-errorrrrrrrr')
            })
            .always(_ => {
                $('#email').val('')
                $('#password').val('')
            })

    })
})

function auth() {
    if (localStorage.token) {
        $('#login-page').hide()
        $('#main-page').show()
        $('#edit-page').hide()
        fetchData()
    } else {
        $('#login-page').show()
        $('#main-page').hide()
        $('#edit-page').hide()
    }
}

function showEditPage()  {
    $('#edit-page').show()
    $('#main-page').hide()
}

function logout() {
    localStorage.clear()
    auth()
}

function fetchData() {
    $.ajax({
        method: 'get',
        url: baseUrl + '/digimons',
        headers: {
            token: localStorage.token
        }
    })
        .done(data => {
            $( ".main-container" ).empty()
            data.Digimons.forEach(el => {
                $( ".main-container" ).append( 
                    `<div class="card">
                        <div class="card-image">
                            <img src="${el.imgUrl}" alt="digimon">
                        </div>
                        <div class="card-name">
                            <h4>${el.name}</h4>
                        </div>
                        <div class="card-info">
                            <span>Level</span>
                            <p>${el.level}</p>
                        </div>
                    </div>`
                 )
            })
        })
        .fail(err => {
            console.log(err,'errrrorr')
        })
}

function addDigimon(event) {
    event.preventDefault()
    let data = {
        name: $('#name').val(),
        level: $('#level').val(),
        imgUrl: $('#imgUrl').val()
    }
    $.ajax({
        method: 'post',
        url: baseUrl + '/digimons',
        data,
        headers: {
            token: localStorage.token
        }
    })
    .done(_ => {
        $('#edit-page').hide()
        $('#main-page').show()
        auth()
    })
    .fail(err => {
        console.log(err.responseJSON.message,'-errorrrrrrrr')
    })
    .always(_ => {
        $('#name').val('')
        $('#level').val('')
        $('#imgUrl').val('')
    })

}