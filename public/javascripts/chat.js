var socket = io();

let bootstrap_colors = ['primary', 'secondary', 'success', 'danger', 'warning text-dark', 'info text-dark', 'light text-dark', 'dark'];

/**
 *  random get user color
 * @returns
 */
let get_user_color = function()
{
    return bootstrap_colors[Math.floor(Math.random()* bootstrap_colors.length)];
}

/**
 *  add new message to content
 * @param {*} name
 * @param {*} msg
 * @param {*} user_color
 */
let add_message = function(name, msg, user_color)
{
    $("#messages").append(
        `<li>
            <span class="badge bg-${user_color}">${name}</span>
            <span class="text">${msg}</span>
        </li>`
    );

    $("#messages").scrollTop($("#messages")[0].scrollHeight);
}

/**
 *  count user number
 * @param {*} count
 */
let set_connection_count = function(count)
{
    $(".count").text(count);
}

$(function(){
    let connected = false;
    let name = '';
    let user_color = bootstrap_colors[0];

    // set username
    Swal.fire({
        title: '輸入名稱',
        input: 'text',
        inputAttributes: {
        autocapitalize: 'off'
        },
        allowOutsideClick: false,
        allowEscapeKey:false,
        confirmButtonText: '確定',
        preConfirm: function(name){
            if (!name) {
                return false;
            }
        },
    }).then((result) => {
        if (result.isConfirmed) {
            name       = result.value;
            user_color = get_user_color();

            socket.emit('add user', {
                name      : result.value,
                user_color: user_color
            });
        }
    });

    // send message
    $("#send-btn").on('click', function(){
        if (!connected) {
            Swal.fire({
                title: '請先輸入名稱',
                icon: 'error',
            }).then((result) => {
                window.location.reload();
            });
            return false;
        }
        if (!$("#message").val()) {
            Swal.fire({
                title: '請先輸入訊息',
                icon: 'warning',
            });
            return false;
        }

        add_message(name, $("#message").val(), user_color);
        socket.emit('send message', $("#message").val());
        $("#message").val('');
    });

    // set user
    socket.on('login', function(count) {
        connected = true;
        set_connection_count(count);
    });

    // set message to content
    socket.on('show message', function(result) {
        add_message(result.name, result.msg, result.user_color);
    });

    // refresh connection count
    socket.on('refresh count', function(count) {
        set_connection_count(count);
    });

});