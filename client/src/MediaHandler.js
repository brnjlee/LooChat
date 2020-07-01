export default class MediaHandler {
    getPermissions() {
        return new Promise((res, rej) => {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true})
                .then((stream) => {
                    res(stream);
                })
                .catch(err => {
                    throw new Error(`Unable to fetch stream ${err}`);
                })
        })
    }
}

export function notify(message, avatar) {
    if (Notification.permission !== 'granted') return
    else {
        var notification = new Notification(message, {
            icon: avatar,
        });
        notification.onclick = function() {
            window.focus();
            this.close(); 
        };
    }
}
