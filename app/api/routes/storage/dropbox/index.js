const dropboxRoute = require('express').Router();
const Dropbox = require('dropbox').Dropbox;
const axios = require('axios');
const fetch = require('isomorphic-fetch');
const {format: dateFormat} = require('date-fns');

function getDropboxClient() {
    return new Dropbox({clientId: 'v7642g8xms9wmlf', fetch});
}

dropboxRoute.get('/auth', async (req, res, next) => {
    // Redirect to login page
    const dropboxClient = getDropboxClient();
    res.redirect(302, dropboxClient.getAuthenticationUrl(process.env.HOSTNAME + '/captioner/settings/dropbox'));
});

dropboxRoute.post('/auth-revoke', async (req, res, next) => {
    const {accessToken} = req.body;

    if (!accessToken) {
        // Missing required params
        res.sendStatus(400);
        return;
    }

    const dropboxClient = getDropboxClient();
    dropboxClient.setAccessToken(accessToken);
    dropboxClient.authTokenRevoke()
        .then(response => {
            res.sendStatus(200);
        })
        .catch(error => {
            console.log('error revoking token');
            console.log(error);
            res.sendStatus(400);
        });
});

// Get the current user profile
dropboxRoute.get('/profile', async (req, res, next) => {
    const {accessToken, accountId} = req.query;

    if (!accessToken || !accountId) {
        // Missing required params
        res.sendStatus(400);
        return;
    }

    const dropboxClient = getDropboxClient();
    dropboxClient.setAccessToken(accessToken);

    dropboxClient.usersGetAccount({account_id: accountId})
        .then(response => {
            res.json(response);
        })
        .catch(error => {
            res.send(400);
        });
    
});

dropboxRoute.post('/push', async (req, res) => {
    const {contents, accessToken, sessionStartDate} = req.body;

    if (!contents || !accessToken || !sessionStartDate) {
        // Missing required params
        res.sendStatus(400);
        return;
    }

    const dropboxClient = getDropboxClient();
    dropboxClient.setAccessToken(accessToken);

    dropboxClient.filesUpload({
        path: '/Transcripts/' + dateFormat(sessionStartDate, 'YYYY-MM-DD HH.mm.ss') + '.txt',
        contents,
        mode: 'overwrite',
    })
        .then(function(response) {
            res.sendStatus(200);
        })
        .catch(function(error) {
            res.sendStatus(400);
        });
});

dropboxRoute.get('/transcripts', async (req, res, next) => {
    const {accessToken, cursor} = req.query;

    if (!accessToken) {
        // Missing required param
        res.sendStatus(400);
        return;
    }

    const dropboxClient = getDropboxClient();
    dropboxClient.setAccessToken(accessToken);
    
    if (!cursor) {
        // First check
        dropboxClient.filesListFolder({
            path: '/Transcripts',
            recursive: false,
            include_media_info: false,
            include_deleted: false,
        })
        .then(result => {
            res.json({
                has_more: result.has_more,
                cursor: result.cursor,
                files: (result.entries || []).map(entry => {
                    return {
                        name: entry.name,
                        size: entry.size,
                    };
                }),
            });
        })
        .catch(error => {
            console.log(error);
            res.sendStatus(400);
        });
    }
    else {
        // Additional check with given cursor
        dropboxClient.filesListFolderContinue({
            cursor,
        })
        .then(result => {
            res.json({
                has_more: result.has_more,
                cursor: result.cursor,
                files: (result.entries || []).map(entry => {
                    return {
                        name: entry.name,
                        size: entry.size,
                    };
                }),
            });
        })
        .catch(error => {
            console.log(error);
            res.sendStatus(400);
        });
    }

});

dropboxRoute.get('/transcripts/:fileName', async (req, res, next) => {
    const {accessToken} = req.query;
    const {fileName} = req.params;

    if (!accessToken || !fileName) {
        // Missing required param
        res.sendStatus(400);
        return;
    }

    const dropboxClient = getDropboxClient();
    dropboxClient.setAccessToken(accessToken);
    
    dropboxClient.filesGetTemporaryLink({
        path: '/Transcripts/' + fileName + '.txt'
    })
        .then(result => {
            if (result.link) {
                console.log(result);
                res.redirect(result.link);
            }
            else {
                res.sendStatus(400);
            }
        })
        .catch(error => {
            console.log(error);
            res.sendStatus(400);
        });

});

module.exports = dropboxRoute;