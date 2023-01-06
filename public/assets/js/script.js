var socket = new WebSocket('ws://localhost:8181/', 'chat');
var name = 'u1'
socket.onopen = function () {

    name = "name" + Math.floor(Math.random() * Math.floor(700));
    socket.send('{"type": "join", "name":" ' + name + '"}');
}

$('#send').on('click', function (e) {
    
    e.preventDefault();
    //name = 'u1',
    msg = $('#textArea').val();
    console.log(msg);
    //schicke die msg an socket 
    socket.send('{"type": "msg", "msg": "' + msg + '"}');
    // make the field empty:
    $('#textArea').val('');

});

socket.onmessage = function (msg) {
    var data = JSON.parse(msg.data);
    console.log(data);
    switch (data.type) {
        case 'msg':
            if (data.name == "MegaBot") {
                var msg = $('<div class="d-flex flex-row justify-content-start mb-4"><img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp" alt="avatar 1"style="width: 45px; height: 100%;"><div class="p-3 ms-3" style="border-radius: 15px; background-color: rgba(57, 192, 237,.2);"><p class="small mb-0">'+data.msg+'</p></div></div>')
            } else {
                var msg = $('<div class="d-flex flex-row justify-content-end mb-4"><div class="p-3 me-3 border" style="border-radius: 15px; background-color: #fbfbfb;"><p class="small mb-0">'+data.msg+'</p></div><img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp" alt="avatar 1" style="width: 45px; height: 100%;"></div>')
            }
            $('#chat').append(msg);
            $('#chat').scrollTop( $('#chat').prop("scrollHeight"));
            break;
        case 'join':
            $('#users').empty();
            for (var i = 0; i < data.names.length; i++) {
                var user = $('<div>' + data.names[i] + '</div>');
                $('#users').append(user);
            }
            break;
    }
};
