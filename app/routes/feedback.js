var express = require('express');
var router = express.Router();
var request = require('request');
var path = require('path');
var fs = require("fs");

router.post('/', function(req, res, next) {
  function sendSuccessResponse() {
    res.redirect('/feedback/thanks');
  }

  function sendSomethingWentWrongResponse() {
    fs.readFile(path.join(__dirname, '../blog/public/feedback/index.html'), 'utf8', (error, data) => {
      if (data) {
        res.send(
          data
            .replace(/\<\!--PREVIOUS_SUBMISSION_INSERT_POINT--\>/, req.sanitize(req.body.feedback))
            .replace(/\<\!-- WARNING_INSERT_POINT --\>/, '<div class="alert alert-danger">There was a problem submitting that. Please try again.</div>')
        );
      }
      else {
        // Couldn't get the error message; send them somewhere
        res.redirect('/feedback');
      }
    });
  }

  function makeGitLabIssue() {
    request.post(
      {
        url: 'https://gitlab.com/api/v4/projects/2927716/issues',
        headers: {
          'PRIVATE-TOKEN': process.env.GITLAB_API_KEY
        },
        json: {
          id: '2927716',
          title: 'Feedback submission',
          description: req.body.feedback + '\n\n@curtgrimes',
          labels: 'Feedback',
        },
      },
      function (error, response, body) {
        if (response && response.statusCode == 201) {
          sendSuccessResponse();
        }
        else {
          sendSomethingWentWrongResponse();
        }
      }
    );
  }

  request.post(
    'https://www.google.com/recaptcha/api/siteverify',
    {
      form: {
        secret: 'REMOVED',
        response: req.body['g-recaptcha-response'],
        remoteip: req.headers['x-forwarded-for'] || req.connection.remoteAddress || '',
      }
    },
    function (error, response, body) {
      if (JSON.parse(body).success) {
        makeGitLabIssue();
      }
      else {
        sendSomethingWentWrongResponse();
      }
    }
  );

});

module.exports = router;
