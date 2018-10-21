const axios = require('axios');

let twitchAccessToken;
let twitchAccessTokenExpireDate;

async function getTwitchToken() {
    if (twitchAccessToken && notExpiringWithinNextHour(twitchAccessTokenExpireDate)) {
        return twitchAccessToken;
    }
    
    try {
        console.log('Getting new Twitch token');

        const {
            data: {
                access_token,
                expires_in,
            }
        } = await axios.post(
            'https://id.twitch.tv/oauth2/token' +
            '?client_id='+ process.env.TWITCH_APP_CLIENT_ID +
            '&client_secret='+ process.env.TWITCH_APP_CLIENT_SECRET +
            '&grant_type=client_credentials'
        );
        
        if (!access_token || !expires_in) {
            throw new Error();
        }

        twitchAccessToken = access_token;
        twitchAccessTokenExpireDate = new Date((new Date()).getTime() + (expires_in * 1000));

        return twitchAccessToken;
    }
    catch(error) {
        console.log('Unable to get Twitch token: ' + (error && error.response && error.response.data ? JSON.stringify(error.response.data) : null));
        throw e;
    }
}

function notExpiringWithinNextHour(expireDate) {
    return new Date(expireDate.getTime() - 1000 * 60 * 60) > new Date();
}

module.exports = {
    getChannel: async (user_name) => {
        let twitchToken, users, streams;
        twitchToken = await getTwitchToken();

        let {data: {data: usersData}} = await axios.get(
                'https://api.twitch.tv/helix/users?login=' + user_name,
                {
                    headers: {
                        'Authorization': 'Bearer ' + twitchToken
                    }
                }
            );
        users = usersData;

        const user = users.find((user) => {
            return user.login.toLowerCase() === user_name.toLowerCase();
        });

        if (!user) {
            return {};
        }
    
        let {data: {data: streamsData}} = await axios.get(
            'https://api.twitch.tv/helix/streams?user_login=' + user_name,
            {
                headers: {
                    'Authorization': 'Bearer ' + twitchToken
                }
            }
        );
        streams = streamsData;

        // Find the first live one
        const stream = streams.find((stream) => {
            return stream.type === 'live';
        });
        
        return {
            title: user.display_name + ' on Twitch',
            description: stream ? stream.title : user.description,
            imageUrl: stream ? stream.thumbnail_url.replace('{width}', '45').replace('{height}', '45') : user.profile_image_url,
        };
    },
}